import { getGeneration, getProduct } from "@/app/actions/upload";
import { Gallery } from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// static params doesn't work
// export async function generateStaticParams() {
//   const products = await getAllProducts();
//   return products.map((product) => ({ params: { id: product.id } }));
// }

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (!product || !product.src || !product.altText) return notFound();
  return {
    title: product.title,
    description: product.description,
    image: product.src,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const generationId = searchParams?.id as string | undefined;

  const [product, generationResult] = await Promise.all([
    getProduct(params.id),
    generationId ? getGeneration(generationId) : Promise.resolve(null),
  ]);
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
                category={product.category || ""}
                generation={generationResult || ""}
              />
            </Suspense>
          </div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <div>
            <p>{product.description}</p>
          </div>
          <Button className="mt-4 rounded-xl" variant={"secondary"}>
            ${20} {"USD"}
          </Button>
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
