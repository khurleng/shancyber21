import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/contentStore";
import { api, readBody, requireAdmin } from "@/lib/supabase";
import { validateContent } from "../../../../backend/lib/validation.mjs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return api(request, async () => NextResponse.json(await getProducts()));
}
export async function POST(request: Request) {
  return api(request, async () => {
    await requireAdmin();
    const body = validateContent("products", await readBody(request)) as { title: string; description: string };
    return NextResponse.json(await createProduct(body), { status: 201 });
  });
}
