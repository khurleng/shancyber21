import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { getProducts } from "@/lib/contentStore";

export default async function Product() {
  const products = await getProducts();

  return (
    <Container>
      <SectionTitle preTitle="Our Products" title="Explore Our Offerings">
        Discover our range of products designed to meet your needs.
      </SectionTitle>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {product.title}
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {product.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
