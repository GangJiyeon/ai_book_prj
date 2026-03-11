"""
Gutenberg → Supabase seeder (범용)

Usage:
  pip3 install requests beautifulsoup4 supabase nltk

  # 기본 실행 (Gutenberg ID만)
  python3 scripts/seed_gutenberg.py 902

  # 챕터 헤딩 태그 직접 지정
  python3 scripts/seed_gutenberg.py 1342 --heading h2

Environment variables required:
  SUPABASE_URL         — your project URL
  SUPABASE_SERVICE_KEY — service_role key (bypasses RLS for seeding)

책별 Gutenberg ID 예시:
  902   — The Happy Prince (Oscar Wilde)
  1342  — Pride and Prejudice (Jane Austen)
  11    — Alice's Adventures in Wonderland (Lewis Carroll)
  1661  — The Adventures of Sherlock Holmes (Arthur Conan Doyle)
  84    — Frankenstein (Mary Shelley)
"""

import argparse
import os
import re
import sys
import requests
import nltk
from bs4 import BeautifulSoup
from supabase import create_client
from pathlib import Path

nltk.download("punkt_tab", quiet=True)
from nltk.tokenize import sent_tokenize

# .env.local 자동 로드
def load_env_local():
    env_path = Path(__file__).parent.parent / ".env.local"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

load_env_local()

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ["NEXT_PUBLIC_SUPABASE_URL"]
# service_role 키 우선, 없으면 anon 키 (RLS insert 정책이 있으면 동작)
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]

GUTENDEX_API = "https://gutendex.com/books/{id}"
BOILERPLATE_RE = re.compile(
    r"gutenberg|project|contents|table of contents|note|preface|introduction|transcriber|footnote|end of",
    re.I,
)

# ── Gutendex 메타데이터 ────────────────────────────────────────────────────────

def fetch_metadata(gutenberg_id: str) -> dict:
    print(f"Fetching metadata for Gutenberg ID {gutenberg_id} ...")
    r = requests.get(GUTENDEX_API.format(id=gutenberg_id), timeout=15)
    r.raise_for_status()
    data = r.json()

    authors = data.get("authors", [])
    author = authors[0]["name"] if authors else "Unknown"
    # Gutendex returns "Last, First" format
    if "," in author:
        last, first = author.split(",", 1)
        author = f"{first.strip()} {last.strip()}"

    subjects = data.get("subjects", [])
    tags = [s.split(" -- ")[0].strip().lower() for s in subjects[:5]]

    formats = data.get("formats", {})
    cover_url = formats.get("image/jpeg")

    return {
        "title": data["title"],
        "author": author,
        "gutenberg_id": str(gutenberg_id),
        "description": ", ".join(subjects[:3]) if subjects else None,
        "tags": tags,
        "cover_url": cover_url,
    }

# ── HTML URL 추출 ─────────────────────────────────────────────────────────────

def get_html_url(gutenberg_id: str) -> str:
    """Gutendex formats에서 HTML URL 추출"""
    r = requests.get(GUTENDEX_API.format(id=gutenberg_id), timeout=15)
    r.raise_for_status()
    formats = r.json().get("formats", {})

    for mime in ["text/html", "text/html; charset=utf-8", "text/html; charset=us-ascii"]:
        if mime in formats:
            return formats[mime]

    # fallback: 직접 구성
    id_str = str(gutenberg_id)
    return f"https://www.gutenberg.org/files/{id_str}/{id_str}-h/{id_str}-h.htm"

# ── HTML 파싱 ─────────────────────────────────────────────────────────────────

def fetch_html(url: str) -> BeautifulSoup:
    print(f"Fetching {url} ...")
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")

def detect_heading_tag(soup: BeautifulSoup) -> str:
    """챕터 헤딩으로 쓸 태그 자동 감지 (h2 > h3 > h4 순)"""
    for tag in ["h2", "h3", "h4"]:
        headings = soup.find_all(tag)
        # 보일러플레이트 제외하고 2개 이상이면 채택
        real = [h for h in headings if not BOILERPLATE_RE.search(h.get_text())]
        if len(real) >= 2:
            print(f"  Auto-detected chapter heading tag: <{tag}> ({len(real)} chapters)")
            return tag
    return "h2"

def extract_chapters(soup: BeautifulSoup, heading_tag: str) -> list[dict]:
    chapters = []
    current_title = None
    current_paras = []

    for tag in soup.find_all([heading_tag, "p"]):
        if tag.name == heading_tag:
            text = tag.get_text(" ", strip=True)
            if BOILERPLATE_RE.search(text):
                continue
            if current_title and current_paras:
                chapters.append({"title": current_title, "paragraphs": current_paras})
            current_title = text
            current_paras = []
        elif tag.name == "p" and current_title:
            text = tag.get_text(" ", strip=True)
            if len(text) > 20:
                current_paras.append(text)

    if current_title and current_paras:
        chapters.append({"title": current_title, "paragraphs": current_paras})

    return chapters

# ── Supabase Insert ───────────────────────────────────────────────────────────

def seed(meta: dict, chapters: list[dict]):
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 1. Upsert book
    print(f'\nInserting book: "{meta["title"]}" by {meta["author"]} ...')
    result = sb.table("books").upsert(meta, on_conflict="gutenberg_id").execute()
    book_id = result.data[0]["id"]
    print(f"  book_id = {book_id}")

    # 2. Chapters → Paragraphs → Sentences
    total_paras = 0
    total_sents = 0

    for chapter_num, chapter in enumerate(chapters, start=1):
        print(f"  [{chapter_num}/{len(chapters)}] {chapter['title']} — {len(chapter['paragraphs'])} paragraphs")

        ch_result = (
            sb.table("chapters")
            .upsert(
                {"book_id": book_id, "number": chapter_num, "title": chapter["title"]},
                on_conflict="book_id,number",
            )
            .execute()
        )
        chapter_id = ch_result.data[0]["id"]

        for para_order, para_text in enumerate(chapter["paragraphs"], start=1):
            para_result = (
                sb.table("paragraphs")
                .upsert(
                    {"chapter_id": chapter_id, "order": para_order, "text": para_text},
                    on_conflict="chapter_id,order",
                )
                .execute()
            )
            paragraph_id = para_result.data[0]["id"]
            total_paras += 1

            sentences = sent_tokenize(para_text)
            sent_rows = [
                {"paragraph_id": paragraph_id, "order": j + 1, "text": sent}
                for j, sent in enumerate(sentences)
            ]
            if sent_rows:
                sb.table("book_sentences").upsert(
                    sent_rows, on_conflict="paragraph_id,order"
                ).execute()
                total_sents += len(sent_rows)

    print(f"\nDone! {len(chapters)} chapters / {total_paras} paragraphs / {total_sents} sentences")

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed a Gutenberg book into Supabase")
    parser.add_argument("gutenberg_id", help="Project Gutenberg book ID (e.g. 902)")
    parser.add_argument("--heading", help="Chapter heading tag (e.g. h2, h3). Auto-detected if omitted.")
    args = parser.parse_args()

    meta = fetch_metadata(args.gutenberg_id)
    print(f'\nBook: "{meta["title"]}" by {meta["author"]}')

    html_url = get_html_url(args.gutenberg_id)
    soup = fetch_html(html_url)

    heading_tag = args.heading or detect_heading_tag(soup)
    chapters = extract_chapters(soup, heading_tag)

    if not chapters:
        print("ERROR: No chapters found. Try specifying --heading h3 or --heading h4", file=sys.stderr)
        sys.exit(1)

    print(f"\nFound {len(chapters)} chapters:")
    for i, ch in enumerate(chapters, 1):
        print(f"  {i}. {ch['title']} — {len(ch['paragraphs'])} paragraphs")

    print()
    seed(meta, chapters)
