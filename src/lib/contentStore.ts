import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

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

const postsFilePath = path.join(process.cwd(), "src", "data", "posts.json");
const productsFilePath = path.join(process.cwd(), "src", "data", "products.json");

const initialPosts: PostItem[] = [
  {
    id: "cyberbullying",
    title: "Cyberbullying: A Growing Concern",
    date: "May 9, 2026",
    excerpt: "Understanding the impact of cyberbullying and how to prevent it.",
    content: [
      "Cyberbullying affects people online through harassment, humiliation, threats, and repeated targeting.",
      "The best protection starts with awareness, empathy, and support from family, schools, and communities."
    ],
    image: "https://bgfalconmedia.com/wp-content/uploads/2023/03/cyberbullying.png"
  }
];

const initialProducts: ProductItem[] = [
  {
    id: "tug-game",
    title: "Tug Game for Classroom",
    description: "A beautifully designed product for fast workflows and better results.",
    buttonText: "View",
    image: "/img/hero.png",
    link: "https://tug.shancyber.com/"
  },
  {
    id: "shan-typing-mentor",
    title: "Shan Typing Mentor",
    description: "Improve your typing skills with our interactive mentorship program.",
    buttonText: "View",
    image: "https://typingmentor.com/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fbs3wcomf%2Fproduction%2F62b05cf2a38305d9d6923e78f324bd535c6081a0-1500x1000.jpg%3Frect%3D3%2C0%2C1494%2C1000%26w%3D808%26h%3D541%26fit%3Dcrop%26auto%3Dformat&w=1920&q=75",
    link: "https://typing.shancyber.com/"
  }
];

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents) as T;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      await writeJsonFile(filePath, fallback);
      return fallback;
    }
    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getPosts(): Promise<PostItem[]> {
  return readJsonFile<PostItem[]>(postsFilePath, initialPosts);
}

export async function getPostById(id: string): Promise<PostItem | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.id === id);
}

export async function createPost(input: Partial<PostItem> & { title: string; excerpt: string }): Promise<PostItem> {
  const posts = await getPosts();
  const baseId = input.id ?? slugify(input.title);
  const id = `${baseId}-${randomUUID().slice(0, 8)}`;
  const newPost: PostItem = {
    id,
    title: input.title,
    date: input.date ?? new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    excerpt: input.excerpt,
    content: input.content ?? [input.excerpt],
    image: input.image ?? "/img/hero.png"
  };

  posts.unshift(newPost);
  await writeJsonFile(postsFilePath, posts);
  return newPost;
}

export async function updatePost(id: string, input: Partial<PostItem>): Promise<PostItem | null> {
  const posts = await getPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return null;
  }

  const existing = posts[index];
  const updatedPost: PostItem = {
    ...existing,
    ...input,
    id: existing.id
  };

  posts[index] = updatedPost;
  await writeJsonFile(postsFilePath, posts);
  return updatedPost;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getPosts();
  const nextPosts = posts.filter((post) => post.id !== id);

  if (nextPosts.length === posts.length) {
    return false;
  }

  await writeJsonFile(postsFilePath, nextPosts);
  return true;
}

export async function getProducts(): Promise<ProductItem[]> {
  return readJsonFile<ProductItem[]>(productsFilePath, initialProducts);
}

export async function getProductById(id: string): Promise<ProductItem | undefined> {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function createProduct(input: Partial<ProductItem> & { title: string; description: string }): Promise<ProductItem> {
  const products = await getProducts();
  const id = input.id ?? `${slugify(input.title)}-${randomUUID().slice(0, 8)}`;
  const newProduct: ProductItem = {
    id,
    title: input.title,
    description: input.description,
    buttonText: input.buttonText ?? "View",
    image: input.image ?? "/img/hero.png",
    link: input.link ?? "#"
  };

  products.unshift(newProduct);
  await writeJsonFile(productsFilePath, products);
  return newProduct;
}

export async function updateProduct(id: string, input: Partial<ProductItem>): Promise<ProductItem | null> {
  const products = await getProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  const existing = products[index];
  const updatedProduct: ProductItem = {
    ...existing,
    ...input,
    id: existing.id
  };

  products[index] = updatedProduct;
  await writeJsonFile(productsFilePath, products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const nextProducts = products.filter((product) => product.id !== id);

  if (nextProducts.length === products.length) {
    return false;
  }

  await writeJsonFile(productsFilePath, nextProducts);
  return true;
}
