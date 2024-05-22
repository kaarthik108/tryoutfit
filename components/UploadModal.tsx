"use client";

import { useImageContext } from "@/app/ImageContext";
import { upload } from "@/app/actions/upload";
import { uploadImageClient } from "@/app/actions/uploadClient";
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
  onClose,
  open,
}: {
  onClose?: () => void;
  open?: boolean;
}) {
  const router = useRouter();
  const { selectedImage, setSelectedImage } = useImageContext();
  const [fileSizeTooBig, setFileSizeTooBig] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedImage) {
      onImageSelect(selectedImage);
    }
  }, [selectedImage]);

  const onImageSelect = (image: string) => {
    setSelectedImage(image);
    setUploadedImage(null);
  };

  const onChangePicture = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFileSizeTooBig(false);
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 5) {
          setFileSizeTooBig(true);
        } else {
          setUploadedImage(file);
          setSelectedImage(null);
        }
      }
    },
    [setSelectedImage]
  );

  const [state, uploadFormAction] = useFormState(upload, {
    message: "",
    status: 0,
  });

  useEffect(() => {
    if (state.status === 200 && state.data && uploadedImage) {
      const { id, key } = state.data;
      console.log("id", id);
      console.log("key", key);

      setIsUploading(true);
      uploadImageClient(uploadedImage, id)
        .then((url) => {
          setSelectedImage(url);
          onClose?.();

          // // Set the search params with the image ID
          // const searchParams = new URLSearchParams(window.location.search);
          // searchParams.set("imageId", id);
          // // Update the URL with the search params
          // const newUrl = `${
          //   window.location.pathname
          // }?${searchParams.toString()}`;
          // router.push(newUrl);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  }, [
    state.status,
    state.data,
    setSelectedImage,
    onClose,
    router,
    uploadedImage,
  ]);

  const handleCancelImage = () => {
    setSelectedImage(null);
    setUploadedImage(null);
    // onClose?.();

    // // Remove the image ID from the search params
    // const searchParams = new URLSearchParams(window.location.search);
    // searchParams.delete("imageId");
    // // Update the URL without the image ID
    // const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    // router.push(newUrl);
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setUploadedImage(null);
    localStorage.removeItem("selectedImage");
    // onClose?.();

    // // Remove the image ID from the search params
    // const searchParams = new URLSearchParams(window.location.search);
    // searchParams.delete("imageId");
    // // Update the URL without the image ID
    // const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    // router.push(newUrl);
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
                  onClick={() => onImageSelect(image)}
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
          {!selectedImage && (
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
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all bg-white opacity-100 hover:bg-gray-50">
                    <UploadCloud className="h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95" />
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Click to upload.
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Recommended: 1:1 square ratio, max 5MB
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
          )}

          {uploadedImage && (
            <div>
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Submit"}
              </button>

              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded ml-4"
                onClick={handleDeleteImage}
              >
                Delete Image
              </button>
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
