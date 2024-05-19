"use client";

import { useImageContext } from "@/app/ImageContext";
import Link from "next/link";
import { Suspense, useState } from "react";
import { UploadSheet } from "./UploadModal";
import LogoSquare from "./logo-square";

const { SITE_NAME } = process.env;
const test_menu = [{ title: "Home", path: "/" }];

type Menu = { title: string; path: string };

export default function Navbar() {
  const menu = test_menu as Menu[];
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const { selectedImage } = useImageContext();

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
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          {/* <Suspense fallback={<SearchSkeleton />}> <Search /> </Suspense> */}
        </div>
        <div className="flex justify-end md:w-1/3">
          <button
            onClick={handleOpenSheet}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Open
          </button>
        </div>
      </div>
      <UploadSheet
        open={showUploadSheet}
        onClose={handleCloseSheet}
        initialSelectedImage={selectedImage}
      />
    </nav>
  );
}
