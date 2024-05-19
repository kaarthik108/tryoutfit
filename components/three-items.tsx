import { useImageContext } from "@/app/ImageContext";
import Link from "next/link";
import { GridTileImage } from "./tile";

function ThreeItemGridItem({
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
      <div
        className="relative block aspect-square h-full w-full"
        // href={`/product/${item.handle}`}
      >
        <GridTileImage
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
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </div>
    </div>
  );
}

export function ThreeItemGrid() {
  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
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

const homepageItems = [
  {
    handle: "product-1",
    title: "Product 1",
    featuredImage: {
      url: "/assets/t-shirt-circles-black.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "19.99",
        currencyCode: "USD",
      },
    },
  },
  {
    handle: "product-2",
    title: "Product 2",
    featuredImage: {
      url: "/assets/bag-black.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "29.99",
        currencyCode: "USD",
      },
    },
  },
  {
    handle: "product-3",
    title: "Product 3",
    featuredImage: {
      url: "/assets/cup-black.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "39.99",
        currencyCode: "USD",
      },
    },
  },
];
