import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const homepageItems = [
  {
    handle: "sophisticated-mens-white-polo-shirt",
    title: "Sophisticated Men's White Polo Shirt",
    featuredImage: {
      url: "/sophisticated-mens-white-polo-shirt.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "19.99",
        currencyCode: "USD",
      },
    },
  },
  {
    handle: "t-shirt-circles-blue",
    title: "t-shirt circles blue",
    featuredImage: {
      url: "/t-shirt-circles-blue.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "29.99",
        currencyCode: "USD",
      },
    },
  },
  {
    handle: "blue-and-white-striped-knit-sweater",
    title: "Blue and White Striped Knit Sweater",
    featuredImage: {
      url: "/blue-and-white-striped-knit-sweater.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "39.99",
        currencyCode: "USD",
      },
    },
  },
  {
    handle: "pink-fuzzy-sweater-with-cat-design",
    title: "Pink Fuzzy Sweater with Cat Design",
    featuredImage: {
      url: "/pink-fuzzy-sweater-with-cat-design.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "19.99",
        currencyCode: "USD",
      },
    },
  },
  {
    handle: "denim-skirt",
    title: "Denim skirt",
    featuredImage: {
      url: "/denim-skirt.png",
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
    title: "t-shirt spiral 1",
    featuredImage: {
      url: "/t-shirt-spiral-1.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "39.99",
        currencyCode: "USD",
      },
    },
  },
];
