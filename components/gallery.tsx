// gallery.tsx
"use client";
import { useImageContext } from "@/app/ImageContext";
import { Inference } from "@/app/actions/upload";
import Image from "next/image";
import { useState } from "react";
import { UploadSheet } from "./UploadModal";

export function Gallery({
  images,
  productId,
}: {
  images: { src: string; altText: string };
  productId: string;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const { selectedImage, setSelectedImage } = useImageContext();
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("selectedImage", selectedImage);
  console.log("imageUrl", images.src);

  const handleTryThis = async () => {
    if (!selectedImage) {
      setShowUploadSheet(true);
      return;
    }

    if (imageUrl) {
      console.log("Image URL:", imageUrl);
      return imageUrl;
    }

    try {
      setIsLoading(true);
      const output = await Inference(selectedImage as string, images.src);
      console.log(output);
      setImageUrl(output as string);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
          {images.src && (
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={images?.altText as string}
              src={images?.src as string}
              priority={true}
            />
          )}
        </div>
        {(isLoading || imageUrl) && (
          <div className="mt-4 lg:mt-0 relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              imageUrl && (
                <Image
                  className="h-full w-full object-contain"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  alt="Generated Image"
                  src={imageUrl}
                  priority={true}
                />
              )
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleTryThis}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Try this"}
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
