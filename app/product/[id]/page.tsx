// product.tsx
import { Gallery } from "@/components/gallery";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Sample product record for testing
const sampleProduct = {
  id: "1",
  title: "Sample Product",
  description: "This is a sample product description.",
  featuredImage: {
    url: "https://example.com/sample-image.jpg",
  },
  images: [
    {
      src: "/assets/t-shirt-circles-black.png",
      altText: "Sample Image 1",
    },
    {
      src: "/assets/bag-black.png",
      altText: "Sample Image 2",
    },
  ],
  availableForSale: true,
  priceRange: {
    minVariantPrice: {
      currencyCode: "USD",
      amount: "9.99",
    },
    maxVariantPrice: {
      currencyCode: "USD",
      amount: "19.99",
    },
  },
};

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = sampleProduct; // Use the sample product for testing

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
          <div className="mb-8">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery images={product.images} productId={product.id} />
            </Suspense>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export type Image = {
  url: string;
  altText: string;
  width?: number;
  height?: number;
};
