import { GithubIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 mt-20">
      <div className="h-[0.1rem] bg-stone-800 mb-4"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Tryout. All rights reserved.
            </p>
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:text-right flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Built by{" "}
              <Link
                href="https://www.k01.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-muted-foreground transition-colors duration-200"
              >
                k01.dev
              </Link>
            </p>
            <div className="">
              <Link
                href="https://github.com/your-github-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <GithubIcon size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
