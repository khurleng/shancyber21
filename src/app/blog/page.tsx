import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { getPosts } from "@/lib/contentStore";

export default async function Blog() {
  const articles = await getPosts();
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Container>
      <SectionTitle preTitle="Our Blog" title="Latest Articles">
        Discover our latest thoughts and insights.
      </SectionTitle>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedArticles.map((article) => (
          <div key={article.id} className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
            <img
              src={article.image}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {article.title}
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {article.date}
              </p>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                {article.excerpt}
              </p>
              <Link
                href={`/blog/${article.id}`}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Read Full Blog
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
