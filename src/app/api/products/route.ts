import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/contentStore";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.title || !body?.description) {
    return NextResponse.json(
      { message: "Title and description are required." },
      { status: 400 }
    );
  }

  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
