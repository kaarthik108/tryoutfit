"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ImageContextType = {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(() => {
    // if (typeof window !== "undefined") {
    //   return localStorage.getItem("selectedImage");
    // }
    return null;
  });

  // useEffect(() => {
  //   if (selectedImage) {
  //     localStorage.setItem("selectedImage", selectedImage);
  //   } else {
  //     localStorage.removeItem("selectedImage");
  //   }
  // }, [selectedImage]);

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
    </ImageContext.Provider>
  );
};
