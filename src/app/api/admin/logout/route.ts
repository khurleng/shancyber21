import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api, setSession, SESSION_COOKIE, supabase, ApiError } from "@/lib/supabase";
export async function POST(request: Request) {
  return api(request, async () => {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (token) {
      try { await supabase("/auth/v1/logout", { method: "POST" }, token); }
      catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) {
          return setSession(NextResponse.json({ message: "Signed out locally. Server session revocation is temporarily unavailable." }, { status: 503 }), "", 0);
        }
      }
    }
    return setSession(NextResponse.json({ success: true }), "", 0);
  });
}
