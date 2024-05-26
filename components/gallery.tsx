"use client";
import { useImageContext } from "@/app/ImageContext";
import { Inference } from "@/app/actions/upload";
import { client } from "@/app/actions/uploadClient";
import { getUrl } from "aws-amplify/storage";
import { Download } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadSheet } from "./UploadModal";
import { Button } from "./ui/button";

export function Gallery({
  src,
  altText,
  category,
  generation,
}: {
  src: string;
  altText: string;
  category: string;
  generation: string;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const { selectedImage } = useImageContext();
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (generation) {
      setImageUrl(generation);
    }
  }, [generation]);

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
      const signedURL = await getUrl({
        path: selectedImage,
        options: { expiresIn: 100, useAccelerateEndpoint: true },
      });
      const id = crypto.randomUUID();
      const params = new URLSearchParams(searchParams.toString());
      params.set("id", id);

      const predictionId = await Inference(
        signedURL.url.toString(),
        src,
        category,
        altText,
        id
      );
      router.push(pathname + "?" + params.toString());

      const createResponse = await client.models.generations.create(
        {
          id: id,
          output: "",
          failed: false,
        },
        { authMode: "apiKey" }
      );

      if (!createResponse.data) {
        toast("Error creating generation entry", {
          description: "Please try again",
        });
        return;
      }

      const checkStatus = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/replicate/${predictionId}`,
          { cache: "no-store" }
        );
        console.log("Response from replicate API:", response);

        if (response.ok) {
          const prediction = await response.json();
          console.log("Prediction status:", prediction.status);
          console.log("Prediction output:", prediction.output);

          if (prediction.status === "succeeded") {
            setImageUrl(prediction.output);
            toast("Image created successfully", {
              description: "You can download the image now",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            });
            return true;
          } else if (prediction.status === "failed") {
            toast("Error generating image", {
              description: "Please try again",
            });
            return true;
          }
        } else {
          toast("Error generating image", {
            description: "Please try again",
          });
          return true;
        }
        return false;
      };

      // Start checking the status
      let predictionCompleted = false;
      while (!predictionCompleted) {
        const result = await checkStatus();
        if (result) {
          console.log("Prediction completed:", result);

          predictionCompleted = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for 2 seconds before checking again
        }
      }
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
      forceDownload(blobUrl, `generated_image_${category}.png`);
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

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      const id = params.get("id");

      if (id) {
        // Delete the record in the database
        await client.models.generations.delete(
          { id: id },
          { authMode: "apiKey" }
        );

        // Clear the search params
        params.delete("id");
        router.push(pathname + "?" + params.toString());

        // Reset the state
        setImageUrl("");
        toast("Image deleted successfully");
      }
    } catch (error) {
      toast("Error deleting image", {
        description: "Please try again",
      });
      console.error("Error deleting image:", error);
    } finally {
      setIsLoading(false);
    }
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
        {!imageUrl ? (
          <Button onClick={handleTryThis} disabled={isLoading}>
            {isLoading ? "Generating..." : "Try this"}
          </Button>
        ) : (
          <Button onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
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
