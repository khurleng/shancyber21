import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostById } from "@/lib/contentStore";
import { PostContent } from "@/components/PostContent";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const article = await getPostById(params.slug);

  if (!article) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${article.title} | Shan Cyber Blog`,
    description: article.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const article = await getPostById(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="shell">
      <article className="mx-auto max-w-3xl py-10">
        <Link
          href="/blog"
          className="text-link mb-8"
        >
          ← Back to journal
        </Link>

        <img
          src={article.image}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="mb-8 h-72 w-full rounded-lg object-cover"
        />

        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          {article.date}
        </p>
        <h1 className="shan-text mb-6 text-4xl font-bold leading-relaxed tracking-normal text-gray-900 dark:text-white">
          {article.title}
        </h1>

        <PostContent content={article.content} />
      </article>
    </div>
  );
}
