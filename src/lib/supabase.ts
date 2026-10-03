import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, assertSameOrigin } from "../../backend/lib/validation.mjs";

export const SESSION_COOKIE = "sc-admin-session";
export { ApiError };

export function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!!url !== !!key) throw new ApiError("Set both Supabase environment variables.", 503);
  return Boolean(url && key);
}

export async function supabase<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  if (!isSupabaseConfigured()) throw new ApiError("Supabase is not configured. Follow backend/README.md to enable admin access.", 503);
  const headers = new Headers(init.headers);
  headers.set("apikey", process.env.SUPABASE_PUBLISHABLE_KEY!);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${process.env.SUPABASE_URL!.replace(/\/$/, "")}${path}`, {
      ...init, headers, cache: "no-store", signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError("The database is temporarily unavailable. Please try again.", 503);
  }
  if (!response.ok) {
    if (response.status === 401) throw new ApiError("Your session has expired. Please sign in again.", 401);
    if (response.status === 403) throw new ApiError("Administrator access is required.", 403);
    if (response.status === 429) throw new ApiError("Too many requests. Please try again later.", 429);
    if (response.status === 409) throw new ApiError("This record already exists.", 409);
    throw new ApiError("Supabase rejected the request. Check your input and backend setup.", response.status < 500 ? 400 : 503);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Please sign in to manage content.", 401);
  const user = await supabase<{ id: string; email: string }>("/auth/v1/user", {}, token);
  const memberships = await supabase<{ user_id: string }[]>(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`, {}, token);
  if (!memberships.length) throw new ApiError("Administrator access is required.", 403);
  return { token, user };
}

export async function readBody(request: Request) {
  const raw = await request.text();
  if (raw.length > 1_000_000) throw new ApiError("Request body is too large.", 413);
  try { return JSON.parse(raw); } catch { throw new ApiError("Invalid JSON body."); }
}

export async function api(request: Request, action: () => Promise<Response>) {
  try {
    if (request.method !== "GET") assertSameOrigin(request);
    const response = await action();
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const known = error instanceof ApiError;
    return NextResponse.json({ message: known ? error.message : "An unexpected server error occurred." }, {
      status: known ? error.status : 500, headers: { "Cache-Control": "no-store" },
    });
  }
}

export function setSession(response: NextResponse, token: string, expires: number) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: expires,
  });
  return response;
}
