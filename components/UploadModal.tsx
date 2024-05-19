"use client";

import { useImageContext } from "@/app/ImageContext";
import { upload } from "@/app/actions/upload";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";

const predefinedImages = [
  "https://replicate.delivery/pbxt/KgwTlhCMvDagRrcVzZJbuozNJ8esPqiNAIJS3eMgHrYuHmW4/KakaoTalk_Photo_2024-04-04-21-44-45.png",
  "https://replicate.delivery/pbxt/KgwRNxqx2U8TUdq5Vxy7cCihIH5Ws4GBPMooiid3OHtk0B9k/out-0.png",
  "https://replicate.delivery/pbxt/KhBUJsv1Zap5TxaQHgt3TiUmwqs5WbPxnLQW9NWl9Hon3RXM/KakaoTalk_Photo_2024-04-04-21-20-19.png",
];

export function UploadSheet({
  onImageSelect,
  onClose,
  open,
  initialSelectedImage,
}: {
  onImageSelect?: (image: string) => void;
  onClose?: () => void;
  open?: boolean;
  initialSelectedImage?: string | null;
}) {
  const router = useRouter();
  const { selectedImage, setSelectedImage } = useImageContext();
  const [fileSizeTooBig, setFileSizeTooBig] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      onImageSelect?.(selectedImage);
    }
  }, [selectedImage, onImageSelect]);

  useEffect(() => {
    if (initialSelectedImage) {
      setUploadedImage(initialSelectedImage);
    }
  }, [initialSelectedImage]);

  const onChangePicture = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFileSizeTooBig(false);
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          setFileSizeTooBig(true);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    []
  );

  const [state, uploadFormAction] = useFormState(upload, {
    message: "",
    status: 0,
  });

  useEffect(() => {
    if (state.status === 200 && state.data) {
      const { id, key } = state.data;
      setSelectedImage(key);
      onClose?.();

      // Set the search params with the image ID
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("imageId", id);
      // Update the URL with the search params
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      router.push(newUrl);
    }
  }, [state.status, state.data, setSelectedImage, onClose, router]);

  const handleCancelImage = () => {
    setSelectedImage(null);
    setUploadedImage(null);
    onClose?.();
  };

  const handleDeleteUploadedImage = () => {
    setUploadedImage(null);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload Image</SheetTitle>
          <SheetDescription>
            Select an image from the predefined options or upload your own.
          </SheetDescription>
        </SheetHeader>
        <form action={uploadFormAction} className="grid gap-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-sm text-red-600">{state.message}</p>
          </div>

          {/* Predefined images */}
          <div className="grid grid-cols-3 gap-4">
            {predefinedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Predefined ${index}`}
                  className={`cursor-pointer ${
                    selectedImage === image ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
                {selectedImage === image && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    onClick={handleCancelImage}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Image upload */}
          <div>
            <div className="flex items-center justify-between">
              <p className="block text-sm font-medium text-gray-700">Photo</p>
              {fileSizeTooBig && (
                <p className="text-sm text-red-500">
                  File size too big (max 5MB)
                </p>
              )}
            </div>
            <label
              htmlFor="image-upload"
              className={`group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 ${
                uploadedImage ? "border-blue-500" : ""
              }`}
            >
              {uploadedImage ? (
                <>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="h-full w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    onClick={handleDeleteUploadedImage}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </>
              ) : (
                <div
                  className={`absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
                    selectedImage
                      ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                      : "bg-white opacity-100 hover:bg-gray-50"
                  }`}
                >
                  <UploadCloud className="h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95" />
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Click to upload.
                  </p>
                  <p className="mt-2 text-center text-sm text-gray-500">
                    Recommended: 1:1 square ratio, with a clear view of your
                    face
                  </p>
                  <span className="sr-only">Image upload</span>
                </div>
              )}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onChangePicture}
              />
            </div>
          </div>

          {!selectedImage && uploadedImage && (
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
