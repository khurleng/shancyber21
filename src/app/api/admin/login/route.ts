import { NextResponse } from "next/server";
import { validateAdminLogin } from "@/lib/adminStore";

export async function POST(request: Request) {
  const body = await request.json();
  const isValid = await validateAdminLogin(body?.username, body?.password);

  if (!isValid) {
    return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
