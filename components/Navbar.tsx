import Image from "next/image";
import Link from "next/link";
import UploadSheetWrapper from "./UploadWrapper";

export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden"></div>
      <div className="flex w-full items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="tryOutfit"
            width={50}
            height={50}
            priority
          />
        </Link>
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <div className="ml-2 flex-none text-sm font-medium lg:block tracking-widest text-neutral-300">
              TryOutFit
            </div>
          </Link>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3"></div>
        <div className="flex justify-end md:w-1/3">
          <UploadSheetWrapper />
        </div>
      </div>
    </nav>
  );
}
