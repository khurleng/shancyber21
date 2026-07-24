import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/contentStore";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = await updateProduct(params.id, body);

  if (!updated) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const deleted = await deleteProduct(params.id);

  if (!deleted) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted" });
}
