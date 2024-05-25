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
    handle: "black-shirt",
    title: "Elegant black shirt with a sleek design",
    featuredImage: {
      url: "/black-shirt.png",
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
    title: "Classic Denim Skirt",
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
    handle: "blue-t-shirt",
    title: "Light Blue T-Shirt",
    featuredImage: {
      url: "/blue-t-shirt.png",
    },
    priceRange: {
      maxVariantPrice: {
        amount: "39.99",
        currencyCode: "USD",
      },
    },
  },
];
