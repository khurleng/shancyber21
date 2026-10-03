import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { isSupabaseConfigured, requireAdmin, supabase } from "./supabase";

export interface PostItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
}
export interface ProductItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
}
type Table = "posts" | "products";
const columns = {
  posts: "id,title,date,excerpt,content,image",
  products: "id,title,description,buttonText,image,link",
};
async function list<T>(table: Table): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    const raw = await fs.readFile(path.join(process.cwd(), "src", "data", table + ".json"), "utf8");
    return JSON.parse(raw.replace(/^\uFEFF/, "")) as T[];
  }
  // Page explicitly so the Supabase API row cap cannot silently truncate content.
  const result: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const page = await supabase<T[]>(`/rest/v1/${table}?select=${columns[table]}&order=created_at.desc,id.asc&limit=500&offset=${offset}`);
    result.push(...page);
    if (page.length < 500) return result;
  }
}
async function find<T extends { id: string }>(table: Table, id: string): Promise<T | undefined> {
  if (!isSupabaseConfigured()) return (await list<T>(table)).find(item => item.id === id);
  const rows = await supabase<T[]>(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=${columns[table]}&limit=1`);
  return rows[0];
}
async function mutate<T>(table: Table, method: string, input?: object, id?: string): Promise<T[]> {
  const { token } = await requireAdmin();
  const filter = id === undefined ? "" : `id=eq.${encodeURIComponent(id)}&`;
  return supabase<T[]>(`/rest/v1/${table}?${filter}select=${columns[table]}`, {
    method, headers: { Prefer: "return=representation" },
    ...(input ? { body: JSON.stringify(input) } : {}),
  }, token);
}
function slug(title: string) {
  return (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item") + "-" + randomUUID().slice(0, 8);
}
export const getPosts = () => list<PostItem>("posts");
export const getProducts = () => list<ProductItem>("products");
export const getPostById = (id: string) => find<PostItem>("posts", id);
export const getProductById = (id: string) => find<ProductItem>("products", id);
export async function createPost(input: Partial<PostItem> & Pick<PostItem, "title" | "excerpt">) {
  const rows = await mutate<PostItem>("posts", "POST", {
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    content: [input.excerpt], image: "/img/hero.png", ...input, id: slug(input.title),
  });
  return rows[0];
}
export async function createProduct(input: Partial<ProductItem> & Pick<ProductItem, "title" | "description">) {
  const rows = await mutate<ProductItem>("products", "POST", {
    buttonText: "View", image: "/img/hero.png", ...input, id: slug(input.title),
  });
  return rows[0];
}
export async function updatePost(id: string, input: Partial<PostItem>) {
  return (await mutate<PostItem>("posts", "PATCH", input, id))[0] ?? null;
}
export async function updateProduct(id: string, input: Partial<ProductItem>) {
  return (await mutate<ProductItem>("products", "PATCH", input, id))[0] ?? null;
}
export async function deletePost(id: string) {
  return (await mutate<PostItem>("posts", "DELETE", undefined, id)).length > 0;
}
export async function deleteProduct(id: string) {
  return (await mutate<ProductItem>("products", "DELETE", undefined, id)).length > 0;
}
