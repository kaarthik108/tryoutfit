"use client";
import { Button } from "@/components/ui/button";
import React from "react";

type TrythisButtonProps = {
  handleTryThis: () => Promise<string | undefined>;
  isLoading: boolean;
};

export default function TrythisButton({
  handleTryThis,
  isLoading,
}: TrythisButtonProps) {
  return (
    <div>
      <Button onClick={handleTryThis} disabled={isLoading}>
        {isLoading ? "Generating..." : "Try this"}
      </Button>
    </div>
  );
}
