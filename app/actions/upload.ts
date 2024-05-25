"use server";

import { cookieBasedClient } from "@/lib/amplify-utils";
import Replicate from "replicate";

export async function upload(previousState: any, formData: FormData) {
  console.log("uploading image");
  const image = formData.get("image") as File;
  if (!image) {
    return { message: "Missing image", status: 400, loading: false };
  }

  try {
    const { data: response } = await cookieBasedClient.models.Images.create(
      {
        path: image.name,
      },
      {
        authMode: "apiKey",
      }
    );

    if (!response) {
      return { message: "Failed to upload image", status: 400 };
    }
    return {
      message: "Image uploaded successfully",
      data: { id: response.id, key: `${response.path}` },
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

export async function updateImage({ id, path }: { id: string; path: string }) {
  const updateResponse = await cookieBasedClient.models.Images.update(
    {
      id: id,
      path: `${path}`,
    },
    {
      authMode: "apiKey",
    }
  );

  const updatedData = updateResponse.data;
  console.log("updatedData", updatedData);

  if (!updatedData) {
    return { message: "Failed to upload image", status: 400 };
  }
}

export async function Inference(
  selectedImage: string,
  imageUrl: string,
  category: string,
  altText: string
) {
  const replicate = new Replicate();

  console.log("image", process.env.BUCKET_URL + `/img` + imageUrl);

  const input = {
    garm_img: process.env.BUCKET_URL + `/img` + imageUrl,
    human_img: selectedImage,
    category: category,
    garment_des: altText,
  };
  const output = await replicate.run(
    "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
    { input }
  );

  return output as unknown as string;
}

export async function getProduct(id: string) {
  const response = await cookieBasedClient.models.product.get(
    {
      id: id,
    },
    {
      authMode: "apiKey",
      selectionSet: ["src", "altText", "description", "title", "category"],
    }
  );

  return response.data;
}

export async function getAllProducts() {
  const response = await cookieBasedClient.models.product.list({
    authMode: "apiKey",
    selectionSet: ["id"],
  });

  return response.data;
}
