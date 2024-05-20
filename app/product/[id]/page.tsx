// product.tsx
// import { getProduct } from "@/app/actions/upload";
import { getProduct } from "@/app/actions/upload";
import { Gallery } from "@/components/gallery";
import { cookieBasedClient } from "@/lib/amplify-utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Sample product record for testing
const sampleProduct = {
  id: "t-shirt-circles-black",
  title: "T-Shirt Circles Black",
  description: "This is a t-shirt with circles on it.",
  // featuredImage: {
  //   url: "https://example.com/sample-image.jpg",
  // },
  src: "/t-shirt-circles-black.png",
  altText: "t-shirt-circles-black",
  // availableForSale: true,
  // priceRange: {
  //   minVariantPrice: {
  //     currencyCode: "USD",
  //     amount: "9.99",
  //   },
  //   maxVariantPrice: {
  //     currencyCode: "USD",
  //     amount: "19.99",
  //   },
  // },
};

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  console.log(product);

  if (!product || !product.src || !product.altText) return notFound();
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
          <div className="mb-8">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                src={product.src}
                altText={product.altText}
                productId={product.src}
              />
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
