import { NextResponse } from "next/server";
import { deletePost, getPostById, updatePost } from "@/lib/contentStore";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = await updatePost(params.id, body);

  if (!updated) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const deleted = await deletePost(params.id);

  if (!deleted) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Post deleted" });
}
