import { NextResponse } from "next/server";
import { createPost, getPosts } from "@/lib/contentStore";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.title || !body?.excerpt) {
    return NextResponse.json(
      { message: "Title and excerpt are required." },
      { status: 400 }
    );
  }

  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
