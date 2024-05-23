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
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import SubmitButton from "./submit-button";
import { Button } from "./ui/button";

const predefinedImages = [
  "https://replicate.delivery/pbxt/KgwTlhCMvDagRrcVzZJbuozNJ8esPqiNAIJS3eMgHrYuHmW4/KakaoTalk_Photo_2024-04-04-21-44-45.png",
  "https://replicate.delivery/pbxt/KgwRNxqx2U8TUdq5Vxy7cCihIH5Ws4GBPMooiid3OHtk0B9k/out-0.png",
  "https://replicate.delivery/pbxt/KhBUJsv1Zap5TxaQHgt3TiUmwqs5WbPxnLQW9NWl9Hon3RXM/KakaoTalk_Photo_2024-04-04-21-20-19.png",
];
const blurDataURL = `data:image/gif;base64,R0lGODlhAQABAPAAABsbG////yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

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
  const [s3Image, sets3Image] = useState<string | null>(null);

  console.log("selectedImage", selectedImage);

  console.log("s3Image", s3Image);

  useEffect(() => {
    const storedS3Image = localStorage.getItem("s3Image");
    if (storedS3Image) {
      sets3Image(storedS3Image);
    }
  }, []);

  const onImageSelect = useCallback(
    (image: string) => {
      setSelectedImage(image);
      setUploadedImage(null);
      sets3Image(null);
      localStorage.removeItem("s3Image");
    },
    [setSelectedImage]
  );

  useEffect(() => {
    if (selectedImage) {
      onImageSelect(selectedImage);
      toast("Image selected", {
        description: "You can now try the outfit with this image.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  }, [selectedImage, onImageSelect]);

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
    loading: true,
  });

  useEffect(() => {
    if (state.status === 200 && state.data && uploadedImage) {
      const { id, key } = state.data;
      console.log("id", id);
      console.log("key", key);

      setIsUploading(true);
      uploadImageClient(uploadedImage, id)
        .then((res) => {
          setSelectedImage(res.url);
          sets3Image(res.path);
          localStorage.setItem("s3Image", res.path); // Store the s3Image URL in local storage
          onClose?.();
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast("Error uploading image", {
            description: "Please try again",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
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
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setUploadedImage(null);
    sets3Image("");
    localStorage.removeItem("selectedImage");
    localStorage.removeItem("s3Image");
    toast("Image deleted", {
      description: "You can now select another image.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Choose Model</SheetTitle>
          <SheetDescription>
            Select a model from the predefined options or upload your own.
          </SheetDescription>
        </SheetHeader>
        <form action={uploadFormAction} className="grid gap-6">
          {/* Predefined images */}
          <div className="grid grid-cols-3 gap-4 mt-2">
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
                <p className="block text-sm font-medium">Upload</p>
                {fileSizeTooBig && (
                  <p className="text-sm text-red-500">
                    File size too big (max 5MB)
                  </p>
                )}
              </div>
              <label
                htmlFor="image-upload"
                className={`group relative mt-2 flex h-96 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 ${
                  uploadedImage ? "border-blue-500" : ""
                }`}
              >
                {uploadedImage ? (
                  <Image
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded"
                    className="h-full w-full rounded-md object-cover"
                    fill
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

          {selectedImage && s3Image && (
            <>
              <h2 className="text-sm font-medium mt-4">Selected Image</h2>
              <div className="relative aspect-square h-full w-full overflow-hidden">
                <StorageImage
                  path={s3Image}
                  alt="model image"
                  className="h-full w-full object-contain"
                  fallbackSrc={blurDataURL}
                />
              </div>
            </>
          )}
          {selectedImage && !s3Image && (
            <>
              <h2 className="text-sm font-medium mt-4">Selected Image</h2>
              <div className="relative aspect-square h-full w-full overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="model image"
                  className="h-full w-full object-contain"
                  fill
                />
              </div>
            </>
          )}

          {uploadedImage && (
            <div className="flex items-center gap-2">
              <SubmitButton uploading={isUploading} />

              <Button
                type="button"
                className="rounded"
                variant={"ghost"}
                size={"sm"}
                onClick={handleDeleteImage}
              >
                Delete
              </Button>
            </div>
          )}
          {selectedImage && (
            <Button
              type="button"
              className="rounded"
              variant={"outline"}
              size={"sm"}
              onClick={handleDeleteImage}
            >
              Delete
            </Button>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
