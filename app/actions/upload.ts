"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Replicate from "replicate";
// import { waitUntil } from "@vercel/functions";

import { uploadData } from "aws-amplify/storage";

export async function upload(previousState: any, formData: FormData) {
  console.log("uploading image");
  const image = formData.get("image") as File;
  if (!image) {
    return { message: "Missing image", status: 400 };
  }
  console.log(image);

  try {
    // Generate a unique ID for the image
    const imageId = nanoid();

    // Upload the image to S3 using Amplify
    const result = await uploadData({
      data: image,
      path: `images/${imageId}`,
    }).result;

    console.log("Image uploaded successfully:", result);

    // Return the image ID and key
    return {
      message: "Image uploaded successfully",
      data: {
        id: imageId,
        key: result.path,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      message: "Unexpected error uploading image, please try again",
      status: 400,
    };
  }
}
