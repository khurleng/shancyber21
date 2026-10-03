import { NextResponse } from "next/server";
import { signInAdmin } from "@/lib/adminStore";
import { api, ApiError, readBody, requireAdmin, setSession, supabase } from "@/lib/supabase";
export async function POST(request: Request) {
  return api(request, async () => {
    const { user } = await requireAdmin();
    const body = await readBody(request);
    if (typeof body?.newPassword !== "string" || body.newPassword.length < 12 || body.newPassword.length > 1024) {
      throw new ApiError("Use a new password between 12 and 1024 characters.");
    }
    const verified = await signInAdmin(user.email, body.currentPassword);
    await supabase("/auth/v1/user", {
      method: "PUT", body: JSON.stringify({ password: body.newPassword }),
    }, verified.access_token);
    const session = await signInAdmin(user.email, body.newPassword);
    return setSession(NextResponse.json({ success: true }), session.access_token, session.expires_in);
  });
}
