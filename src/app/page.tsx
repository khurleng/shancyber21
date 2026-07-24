import Link from "next/link";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

import { benefitOne, benefitTwo } from "@/components/data";
import { articles } from "./blog/articles";
import { products } from "./product/products";
export default function Home() {
  const recentProducts = products.slice(0, 2);

  const recentPosts = articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)
    .map((article) => ({
      id: article.id,
      title: article.title,
      description: article.excerpt,
      action: "Read More",
      image: article.image,
    }));

  return (
    <Container>
      <Hero />
      <SectionTitle
        preTitle="Our Services"
        title=" Why Shan Cyber"
      >
        Shan Cyber provides computer repair services, 
        sells IT equipment, and offers web design and development solutions. 
        We also specialize in graphic design services, including posters, logos, 
        and infographics for marketing purposes.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle preTitle="Products" title="Recently added products">
        A quick preview of our featured products. Click through to see the full list.
      </SectionTitle>

      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {recentProducts.map((product, index) => (
          <div key={index} className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.title}
              className="object-cover w-full h-48"
            />
            <div className="p-6">
              <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {product.title}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {product.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle preTitle="Blog" title="Recent articles">
        Read the latest updates and insights from our blog.
      </SectionTitle>

      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {recentPosts.map((post, index) => (
          <div key={index} className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-48"
            />
            <div className="p-6">
              <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {post.title}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {post.action}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle
        preTitle="Watch a video"
        title="Learn how to fullfil your needs"
      >
        This section is, Learn how to fulfill your needs with the right digital skills and technology solutions.
      </SectionTitle>

      <Video videoId="14AfdzJSW-c" />

      {/* <SectionTitle
        preTitle="Testimonials"
        title="Here's what our customers said"
      >
        Testimonials is a great way to increase the brand trust and awareness.
        Use this section to highlight your popular customers.
      </SectionTitle> */}

      {/* <Testimonials /> */}

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here, it will increase the
        conversion rate as well as support or chat requests.
      </SectionTitle>

      <Faq />
      <Cta />
    </Container>
  );
}
