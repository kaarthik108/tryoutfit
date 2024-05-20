"use client";

import { useImageContext } from "@/app/ImageContext";
import { Button } from "@/components/ui/button";
import React from "react";
import { UploadSheet } from "./UploadModal";

export default function Trythis() {
  const { selectedImage, setSelectedImage } = useImageContext();

  const handleImageUpload = async () => {
    if (selectedImage) {
      try {
        // Perform the fetch operation to the API endpoint
        const response = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ image: selectedImage }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Handle the success case
          console.log("Image uploaded successfully");
          // Reset the selected image after successful upload
          setSelectedImage(null);
        } else {
          // Handle the error case
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const [showUploadSheet, setShowUploadSheet] = React.useState(false);

  const handleSelectImage = () => {
    setShowUploadSheet(true);
  };

  const handleCloseSheet = () => {
    setShowUploadSheet(false);
  };
  return (
    <div>
      {selectedImage ? (
        <button onClick={handleImageUpload}>Try this</button>
      ) : (
        <button onClick={handleSelectImage}>Select an image</button>
      )}
      <UploadSheet
        open={showUploadSheet}
        onClose={handleCloseSheet}
        // onImageSelect={(image) => setSelectedImage(image)}
      />
    </div>
  );
}
