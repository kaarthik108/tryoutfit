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
  altText: string,
  id: string
) {
  const replicate = new Replicate();

  console.log("image", process.env.BUCKET_URL + `/img` + imageUrl);
  const domain =
    process.env.NODE_ENV === "development"
      ? process.env.TUNNEL_URL!
      : `${process.env.NEXT_PUBLIC_PRODUCTION_URL}`;

  console.log("domain", domain);

  const input = {
    garm_img: process.env.BUCKET_URL + `/img` + imageUrl,
    human_img: selectedImage,
    category: category,
    garment_des: altText,
  };
  const prediction = await replicate.predictions.create({
    version: "906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
    input: input,
    webhook: `${domain}/api/webhooks/replicate/${id}`,
  });

  return prediction.id;
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

export async function getGeneration(id: string) {
  const response = await cookieBasedClient.models.generations.get(
    {
      id: id,
    },
    {
      authMode: "apiKey",
      selectionSet: ["output", "failed"],
    }
  );

  return response.data?.output!;
}

export async function uploadOutputToS3(outputUrl: string, id: string) {
  const uploadEndpoint = `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/upload`;

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: `${id}.jpg`,
      contentType: "image/jpeg",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get presigned URL");
  }

  const { url, fields } = await response.json();
  const fetchResponse = await fetch(outputUrl);
  if (!fetchResponse.ok) {
    throw new Error(`Failed to fetch output from ${outputUrl}`);
  }

  const outputBlob = await fetchResponse.blob();

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", outputBlob, `${id}.jpg`);

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData as any,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error("Failed to upload to S3:", errorText);
    throw new Error("Failed to upload to S3");
  }

  const key = fields.key || fields.Key;
  if (!key) {
    throw new Error("Missing key in presigned URL fields");
  }

  console.log("Final S3 Key:", key);
  return `${url}${key}`;
}
