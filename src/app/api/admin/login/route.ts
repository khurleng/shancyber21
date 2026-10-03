import { NextResponse } from "next/server";
import { signInAdmin } from "@/lib/adminStore";
import { api, readBody, setSession } from "@/lib/supabase";
export async function POST(request: Request) {
  return api(request, async () => {
    const body = await readBody(request);
    const session = await signInAdmin(body?.email, body?.password);
    return setSession(NextResponse.json({ success: true }), session.access_token, session.expires_in);
  });
}
