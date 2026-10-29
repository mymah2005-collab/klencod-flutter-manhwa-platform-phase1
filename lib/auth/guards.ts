import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// The owner is identified by a verified email. The database checks the same
// address in is_global_owner(), so keep the two in sync.
export const GLOBAL_OWNER_EMAIL = "mymah2005@gmail.com";

export type Role = "reader" | "staff" | "admin";

export type CurrentProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: Role;
  is_banned: boolean;
  frozen_until: string | null;
  points_balance: number;
};

export type Session = {
  user: User | null;
  profile: CurrentProfile | null;
  isOwner: boolean;
  isAdmin: boolean; // owner or admin
  isStaffOrAdmin: boolean; // owner, admin or staff
};

export type AuthedSession = Session & { user: User };

// Cached per request, so the navbar, layouts and pages share one lookup.
export const getSession = cache(async (): Promise<Session> => {
  const supabase = await createClient();

  // getUser() checks the token with the Auth server. Never trust getSession() on the server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, isOwner: false, isAdmin: false, isStaffOrAdmin: false };
  }

  const isOwner = user.email?.toLowerCase() === GLOBAL_OWNER_EMAIL;

  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role, is_banned, frozen_until, points_balance")
    .eq("id", user.id)
    .maybeSingle();

  const profile = (data as CurrentProfile | null) ?? null;
  const active = !!profile && !profile.is_banned;
  const isAdmin = isOwner || (active && profile?.role === "admin");
  const isStaffOrAdmin = isAdmin || (active && profile?.role === "staff");

  return { user, profile, isOwner, isAdmin, isStaffOrAdmin };
});

export async function requireGlobalOwner(): Promise<AuthedSession> {
  const session = await getSession();
  if (!session.user || !session.isOwner) redirect("/");
  return { ...session, user: session.user };
}

export async function requireAdminOrOwner(): Promise<AuthedSession> {
  const session = await getSession();
  if (!session.user) redirect("/login");
  if (!session.isAdmin) redirect("/admin");
  return { ...session, user: session.user };
}

export async function requireStaffOrAdmin(): Promise<AuthedSession> {
  const session = await getSession();
  if (!session.user) redirect("/login");
  if (!session.isStaffOrAdmin) redirect("/");
  return { ...session, user: session.user };
}
