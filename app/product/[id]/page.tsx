import { getProduct } from "@/app/actions/upload";
import { Gallery } from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
                category={product.category || ""}
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
