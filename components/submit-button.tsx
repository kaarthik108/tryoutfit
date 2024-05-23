"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        className={`bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3
        ${pending || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={pending || uploading}
      >
        {pending || uploading ? <Loader2 className="animate-spin" /> : "Submit"}
      </button>
    </>
  );
}

export default SubmitButton;
