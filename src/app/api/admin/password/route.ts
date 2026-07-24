import { NextResponse } from "next/server";
import { updateAdminPassword } from "@/lib/adminStore";

export async function POST(request: Request) {
  const body = await request.json();
  const updated = await updateAdminPassword(body?.currentPassword, body?.newPassword);

  if (!updated) {
    return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
