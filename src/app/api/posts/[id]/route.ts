import { NextResponse } from "next/server";
import { deletePost, getPostById, updatePost } from "@/lib/contentStore";
import { api, readBody, requireAdmin } from "@/lib/supabase";
import { validateContent } from "../../../../../backend/lib/validation.mjs";
export const dynamic = "force-dynamic";
type Context = { params: { id: string } };
export async function GET(request: Request, { params }: Context) {
  return api(request, async () => {
    const item = await getPostById(params.id);
    return item ? NextResponse.json(item) : NextResponse.json({ message: "Not found." }, { status: 404 });
  });
}
export async function PUT(request: Request, { params }: Context) {
  return api(request, async () => {
    await requireAdmin();
    const body = validateContent("posts", await readBody(request), true);
    const item = await updatePost(params.id, body);
    return item ? NextResponse.json(item) : NextResponse.json({ message: "Not found." }, { status: 404 });
  });
}
export async function DELETE(request: Request, { params }: Context) {
  return api(request, async () => {
    await requireAdmin();
    const deleted = await deletePost(params.id);
    return NextResponse.json({ message: deleted ? "Deleted." : "Not found." }, { status: deleted ? 200 : 404 });
  });
}
