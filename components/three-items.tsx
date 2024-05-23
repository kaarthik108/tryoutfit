import { homepageItems } from "@/lib/utils";
import Link from "next/link";
import { ImageGrid } from "./tile";

function TopGrid({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
      >
        <ImageGrid
          src={item.featuredImage.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

function BottomGrid({ item, priority }: { item: Product; priority?: boolean }) {
  return (
    <div className="md:col-span-2">
      <Link
        className="relative block aspect-square w-full h-full"
        href={`/product/${item.handle}`}
      >
        <ImageGrid
          src={item.featuredImage.url}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          priority={priority}
          alt={item.title}
          label={{
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

export function ProductGrid() {
  const [firstProduct, secondProduct, thirdProduct, ...remainingProducts] =
    homepageItems;

  return (
    <>
      <section className="mx-auto grid max-w-screen-2xl gap-8 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
        <TopGrid size="full" item={firstProduct} priority={true} />
        <TopGrid size="half" item={secondProduct} priority={true} />
        <TopGrid size="half" item={thirdProduct} priority={true} />
      </section>
      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 mt-8">
        {remainingProducts.map((product, index) => (
          <BottomGrid
            key={product.handle}
            item={product}
            priority={index === 0}
          />
        ))}
      </section>
    </>
  );
}

type Product = {
  handle: string;
  title: string;
  featuredImage: {
    url: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};
