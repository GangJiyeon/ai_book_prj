import { supabase } from "@/lib/supabase"

export type Group = {
  id: string
  name: string
  description: string | null
  memberCount: number
  currentBook: { id: string; title: string; author: string } | null
  isPrivate: boolean
  createdAt: string
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function mapGroupRow(g: {
  id: string; name: string; description: string | null
  created_at: string; is_private: boolean
  group_members: unknown; books: unknown
}): Group {
  const book = Array.isArray(g.books) ? g.books[0] : g.books
  return {
    id: g.id,
    name: g.name,
    description: g.description,
    memberCount: (g.group_members as { count: number }[])[0]?.count ?? 0,
    currentBook: book ? { id: (book as { id: string; title: string; author: string }).id, title: (book as { id: string; title: string; author: string }).title, author: (book as { id: string; title: string; author: string }).author } : null,
    isPrivate: g.is_private,
    createdAt: g.created_at,
  }
}

export type FetchGroupsOptions = {
  search?: string
  sortBy?: "newest" | "members" | "name"
}

export async function fetchGroups(options: FetchGroupsOptions = {}): Promise<Group[]> {
  let query = supabase
    .from("groups")
    .select(`id, name, description, created_at, is_private, group_members(count), books(id, title, author)`)

  const s = options.search?.trim()
  if (s) {
    if (UUID_RE.test(s)) {
      query = query.eq("id", s)
    } else {
      query = query.ilike("name", `%${s}%`)
    }
  }

  if (options.sortBy === "name") {
    query = query.order("name")
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error

  let result = (data ?? []).map(mapGroupRow)
  if (options.sortBy === "members") {
    result = result.sort((a, b) => b.memberCount - a.memberCount)
  }
  return result
}

export async function fetchMyGroups(options: FetchGroupsOptions = {}): Promise<Group[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data: memberships, error: mErr } = await supabase
    .from("group_members")
    .select("group_id, joined_at")
    .eq("user_id", session.user.id)
    .eq("status", "approved")

  if (mErr || !memberships || memberships.length === 0) return []

  const groupIds = memberships.map((m) => m.group_id)
  const joinedAtMap = new Map(memberships.map((m) => [m.group_id, m.joined_at]))

  let query = supabase
    .from("groups")
    .select(`id, name, description, created_at, is_private, group_members(count), books(id, title, author)`)
    .in("id", groupIds)

  const s = options.search?.trim()
  if (s) {
    if (UUID_RE.test(s)) {
      query = query.eq("id", s)
    } else {
      query = query.ilike("name", `%${s}%`)
    }
  }

  const { data, error } = await query
  if (error) throw error

  let result = (data ?? []).map(mapGroupRow)

  switch (options.sortBy) {
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "members":
      result.sort((a, b) => b.memberCount - a.memberCount)
      break
    default:
      // newest joined
      result.sort((a, b) => {
        const aj = joinedAtMap.get(a.id) ?? ""
        const bj = joinedAtMap.get(b.id) ?? ""
        return bj.localeCompare(aj)
      })
  }

  return result
}

export type PendingMember = {
  userId: string
  username: string
}

export type GroupDetail = {
  id: string
  name: string
  description: string | null
  memberCount: number
  isAdmin: boolean
  isMember: boolean
  hasPendingRequest: boolean
  isPrivate: boolean
  hasPassword: boolean
  currentBook: { id: string; title: string; author: string } | null
  recentActivity: {
    id: string
    user: string
    quote: string | null
    text: string
    bookTitle: string
    timeAgo: string
  }[]
  pendingMembers: PendingMember[]
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export async function fetchGroupName(groupId: string): Promise<string | null> {
  const { data } = await supabase.from("groups").select("name").eq("id", groupId).single()
  return data?.name ?? null
}

export async function setGroupBook(groupId: string, bookId: string): Promise<void> {
  const { error } = await supabase
    .from("groups")
    .update({ current_book_id: bookId })
    .eq("id", groupId)
  if (error) throw error
}

export async function fetchGroupById(groupId: string): Promise<GroupDetail | null> {
  const { data: { session } } = await supabase.auth.getSession()

  const { data, error } = await supabase
    .from("groups")
    .select(`id, name, description, is_private, join_password, books(id, title, author)`)
    .eq("id", groupId)
    .single()

  if (error || !data) return null

  const [memberCountResult, membershipResult, commentsResult] = await Promise.all([
    supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", groupId)
      .eq("status", "approved"),
    session
      ? supabase
          .from("group_members")
          .select("role, status")
          .eq("group_id", groupId)
          .eq("user_id", session.user.id)
          .single()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("reader_comments")
      .select(`id, quote, text, created_at, users(username), paragraphs(chapters(books(title)))`)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  const membership = membershipResult.data
  const isAdmin = membership?.role === "admin" && membership?.status === "approved"
  const isMember = membership?.status === "approved"
  const hasPendingRequest = membership?.status === "pending"

  let pendingMembers: PendingMember[] = []
  if (isAdmin) {
    const { data: pending } = await supabase
      .from("group_members")
      .select("user_id, users(username)")
      .eq("group_id", groupId)
      .eq("status", "pending")

    pendingMembers = (pending ?? []).map((p) => {
      const u = Array.isArray(p.users) ? p.users[0] : p.users
      return {
        userId: p.user_id,
        username: (u as { username: string } | null)?.username ?? "unknown",
      }
    })
  }

  const comments = commentsResult.data ?? []
  const recentActivity = comments.map((c) => {
    const u = Array.isArray(c.users) ? c.users[0] : c.users
    const para = Array.isArray(c.paragraphs) ? c.paragraphs[0] : c.paragraphs
    const ch = para ? (Array.isArray(para.chapters) ? para.chapters[0] : para.chapters) : null
    const book = ch ? (Array.isArray(ch.books) ? ch.books[0] : ch.books) : null
    return {
      id: c.id,
      user: (u as { username: string } | null)?.username ?? "unknown",
      quote: c.quote ?? null,
      text: c.text,
      bookTitle: book?.title ?? "",
      timeAgo: formatTimeAgo(c.created_at),
    }
  })

  const book = Array.isArray(data.books) ? data.books[0] : data.books

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    memberCount: memberCountResult.count ?? 0,
    isAdmin,
    isMember,
    hasPendingRequest,
    isPrivate: data.is_private,
    hasPassword: !!data.join_password,
    currentBook: book ? { id: book.id, title: book.title, author: book.author } : null,
    recentActivity,
    pendingMembers,
  }
}

export async function createGroup(
  name: string,
  description: string,
  isPrivate: boolean,
  joinPassword: string | null,
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Not authenticated")

  const { data: group, error } = await supabase
    .from("groups")
    .insert({
      name,
      description: description || null,
      creator_id: session.user.id,
      is_private: isPrivate,
      join_password: isPrivate && joinPassword ? joinPassword : null,
    })
    .select("id")
    .single()

  if (error) throw error

  await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: session.user.id, role: "admin", status: "approved" })
}

export async function joinGroup(
  groupId: string,
  password?: string,
): Promise<"approved" | "pending" | "wrong_password" | "already_member"> {
  const { data, error } = await supabase.rpc("join_group_with_password", {
    p_group_id: groupId,
    p_password: password ?? "",
  })
  if (error) throw error
  return data as "approved" | "pending" | "wrong_password" | "already_member"
}

export async function adminAddMember(
  groupId: string,
  username: string,
): Promise<"added" | "already_member" | "user_not_found" | "not_authorized"> {
  const { data, error } = await supabase.rpc("admin_add_member", {
    p_group_id: groupId,
    p_username: username,
  })
  if (error) throw error
  return data as "added" | "already_member" | "user_not_found" | "not_authorized"
}

export async function approveMember(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase.rpc("approve_group_member", {
    p_group_id: groupId,
    p_user_id: userId,
  })
  if (error) throw error
}

export async function rejectMember(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase.rpc("reject_group_member", {
    p_group_id: groupId,
    p_user_id: userId,
  })
  if (error) throw error
}
