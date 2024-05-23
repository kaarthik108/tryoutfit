// gallery.tsx
"use client";
import { useImageContext } from "@/app/ImageContext";
import { Inference } from "@/app/actions/upload";
import { Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { UploadSheet } from "./UploadModal";
import { Button } from "./ui/button";

export function Gallery({
  src,
  altText,
  productId,
}: {
  src: string;
  altText: string;
  productId: string;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const { selectedImage } = useImageContext();
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
      const output = await Inference(selectedImage as string, src);
      console.log(output);
      setImageUrl(output as string);
      toast("Image created sucessfully", {
        description: "You can download the image now",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      toast("Error generating image", {
        description: "Please try again",
      });

      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl, {
        headers: new Headers({
          Origin: location.origin,
        }),
        mode: "cors",
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, `generated_image_${productId}.png`);
      toast("Image downloaded successfully", {
        description: "Check your downloads folder",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const forceDownload = (blobUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
          {src && (
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={altText as string}
              src={src as string}
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
                <div className="relative h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="relative">
                      <Image
                        className=""
                        width={400}
                        height={400}
                        alt="Generated Image"
                        src={imageUrl}
                        priority
                      />
                      <button
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                        ) : (
                          <Download className="h-4 w-4 m-1 text-gray-600 hover:scale-110" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        {!imageUrl && (
          <Button onClick={handleTryThis} disabled={isLoading}>
            {isLoading ? "Generating..." : "Try this"}
          </Button>
        )}
      </div>
      <UploadSheet
        open={showUploadSheet}
        onClose={() => setShowUploadSheet(false)}
      />
    </>
  );
}
