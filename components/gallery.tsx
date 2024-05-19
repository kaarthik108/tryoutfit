// gallery.tsx
"use client";
import { useImageContext } from "@/app/ImageContext";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UploadSheet } from "./UploadModal";

export function Gallery({
  images,
  productId,
}: {
  images: { src: string; altText: string }[];
  productId: string;
}) {
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get("image");
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;
  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set("image", nextImageIndex.toString());
  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set("image", previousImageIndex.toString());

  const [imageUrl, setImageUrl] = useState("");
  const { selectedImage, setSelectedImage } = useImageContext();
  const [showUploadSheet, setShowUploadSheet] = useState(false);

  const handleTryThis = async () => {
    if (!selectedImage) {
      setShowUploadSheet(true);
    }
    try {
      // const response = await fetch("/api/generate-image", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ productId }),
      // });

      setImageUrl("/assets/t-shirt-circles-black.png");

      // if (response.ok) {
      //   const data = await response.json();
      // } else {
      //   // Handle error case
      //   console.error("Failed to generate image");
      // }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
          {images[imageIndex] && (
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={images[imageIndex]?.altText as string}
              src={images[imageIndex]?.src as string}
              priority={true}
            />
          )}
        </div>
        {selectedImage && imageUrl && (
          <div className="mt-4 lg:mt-0 relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt="Generated Image"
              src={imageUrl}
              priority={true}
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleTryThis}
        >
          Try this
        </button>
      </div>
      <UploadSheet
        open={showUploadSheet}
        onClose={() => setShowUploadSheet(false)}
        onImageSelect={(image) => setSelectedImage(image)}
      />
    </>
  );
}
