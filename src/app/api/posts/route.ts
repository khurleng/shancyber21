import { NextResponse } from "next/server";
import { createPost, getPosts } from "@/lib/contentStore";
import { api, readBody, requireAdmin } from "@/lib/supabase";
import { validateContent } from "../../../../backend/lib/validation.mjs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return api(request, async () => NextResponse.json(await getPosts()));
}
export async function POST(request: Request) {
  return api(request, async () => {
    await requireAdmin();
    const body = validateContent("posts", await readBody(request)) as { title: string; excerpt: string };
    return NextResponse.json(await createPost(body), { status: 201 });
  });
}
