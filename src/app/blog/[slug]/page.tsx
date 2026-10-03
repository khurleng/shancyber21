import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostById } from "@/lib/contentStore";

function renderInlineText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);

    if (boldMatch) {
      return <strong key={`${part}-${index}`}>{boldMatch[1]}</strong>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderRichContent(content: string) {
  const trimmed = content.trim();

  if (!trimmed) {
    return null;
  }

  const headingMatch = trimmed.match(/^#\s+(.+)$/);
  if (headingMatch) {
    return (
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {renderInlineText(headingMatch[1])}
      </h2>
    );
  }

  const subHeadingMatch = trimmed.match(/^##\s+(.+)$/);
  if (subHeadingMatch) {
    return (
      <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
        {renderInlineText(subHeadingMatch[1])}
      </h3>
    );
  }

  return (
    <p className="text-justify text-lg leading-8 text-gray-700 dark:text-gray-300">
      {renderInlineText(trimmed)}
    </p>
  );
}

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
          className="mb-8 h-72 w-full rounded-lg object-cover"
        />

        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          {article.date}
        </p>
        <h1 className="shan-text mb-6 text-4xl font-bold leading-relaxed tracking-normal text-gray-900 dark:text-white">
          {article.title}
        </h1>

        <div className="shan-text space-y-5">
          {article.content.map((paragraph) => (
            <div key={paragraph}>{renderRichContent(paragraph)}</div>
          ))}
        </div>
      </article>
    </div>
  );
}
