import { NextResponse } from "next/server";
import { api, requireAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return api(request, async () => {
    const { user } = await requireAdmin();
    return NextResponse.json({ authenticated: true, email: user.email });
  });
}
