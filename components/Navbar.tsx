"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UploadSheet } from "./UploadModal";
import { Button } from "./ui/button";

export default function Navbar() {
  const [showUploadSheet, setShowUploadSheet] = useState(false);

  const handleOpenSheet = () => {
    setShowUploadSheet(true);
  };

  const handleCloseSheet = () => {
    setShowUploadSheet(false);
  };

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden"></div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <div className="ml-2 flex-none text-sm font-medium lg:block tracking-widest">
              tryOut
            </div>
          </Link>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3"></div>
        <div className="flex justify-end md:w-1/3">
          <Button onClick={handleOpenSheet} size={"sm"} variant={"outline"}>
            <Settings className="" size={18} />
          </Button>
        </div>
      </div>
      <UploadSheet open={showUploadSheet} onClose={handleCloseSheet} />
    </nav>
  );
}
