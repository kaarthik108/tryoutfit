"use client";

import { Loader2Icon } from "lucide-react";
import { useMemo } from "react";
import { useFormStatus } from "react-dom";

export function UploadButton() {
  const { pending } = useFormStatus();

  // const saveDisabled = useMemo(() => {
  //   return !data.image || pending;
  // }, [data.image, pending]);

  return (
    <button
      disabled={pending}
      className={`${
        pending
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : "border-black bg-black text-white hover:bg-white hover:text-black"
      } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
    >
      {pending ? (
        <Loader2Icon color="#808080" />
      ) : (
        <p className="text-sm">Confirm upload</p>
      )}
    </button>
  );
}
