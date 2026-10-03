import { ApiError, supabase } from "./supabase";
export interface AuthSession {
  access_token: string;
  expires_in: number;
  user: { id: string; email: string };
}
export async function signInAdmin(email: string, password: string): Promise<AuthSession> {
  if (typeof email !== "string" || typeof password !== "string" || !email.includes("@") || !password || email.length > 320 || password.length > 1024) {
    throw new ApiError("A valid email and password are required.");
  }
  let session: AuthSession;
  try {
    session = await supabase<AuthSession>("/auth/v1/token?grant_type=password", {
      method: "POST", body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    if (error instanceof ApiError && [400, 401].includes(error.status)) throw new ApiError("Invalid email or password.", 401);
    throw error;
  }
  const rows = await supabase<{ user_id: string }[]>(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id`, {}, session.access_token);
  if (!rows.length) {
    await supabase("/auth/v1/logout", { method: "POST" }, session.access_token);
    throw new ApiError("This account does not have administrator access.", 403);
  }
  return session;
}
