"use client";
import { Camera } from "lucide-react";
import { useState } from "react";
import { UploadSheet } from "./UploadModal";
import { Button } from "./ui/button";

export default function UploadSheetWrapper() {
  const [showUploadSheet, setShowUploadSheet] = useState(false);

  const handleOpenSheet = () => {
    setShowUploadSheet(true);
  };

  const handleCloseSheet = () => {
    setShowUploadSheet(false);
  };

  return (
    <>
      <Button onClick={handleOpenSheet} size={"sm"} variant={"outline"}>
        <Camera size={18} />
      </Button>
      <UploadSheet open={showUploadSheet} onClose={handleCloseSheet} />
    </>
  );
}
