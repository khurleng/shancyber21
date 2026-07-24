import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getPostById, getPosts } from "@/lib/contentStore";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const articles = await getPosts();
  return articles.map((article) => ({
    slug: article.id,
  }));
}

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
    <Container>
      <article className="mx-auto max-w-3xl py-10">
        <Link
          href="/blog"
          className="mb-8 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Back to blog
        </Link>

        <img
          src={article.image}
          alt={article.title}
          className="mb-8 h-72 w-full rounded-lg object-cover"
        />

        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          {article.date}
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-normal text-gray-900 dark:text-white">
          {article.title}
        </h1>

        <div className="space-y-5 text-lg leading-8 text-gray-700 dark:text-gray-300">
          {article.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  );
}
