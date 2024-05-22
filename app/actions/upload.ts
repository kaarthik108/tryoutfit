"use server";

// import { waitUntil } from "@vercel/functions";

// import { Schema } from "@/amplify/data/resource";
import { cookieBasedClient } from "@/lib/amplify-utils";
import { Amplify } from "aws-amplify";
import { uploadData } from "aws-amplify/storage";
import Replicate from "replicate";
import { bucketUrl } from "./uploadClient";
// import outputs from "../../amplify_outputs.json";

// Amplify.configure(outputs, { ssr: true });

export async function upload(previousState: any, formData: FormData) {
  // const client = generateClient<Schema>({});

  console.log("uploading image");
  const image = formData.get("image") as File;
  if (!image) {
    return { message: "Missing image", status: 400 };
  }
  console.log(image);

  const { data: response } = await cookieBasedClient.models.Images.create(
    {
      path: image.name,
    },
    {
      authMode: "apiKey",
    }
  );
  console.log(response);

  // const data = {
  //   id: "3a3f45bd-c4a9-4961-8178-6b6b43ce2c43",
  //   path: "musk-1.jpeg",
  //   createdAt: "2024-05-20T02:23:10.813Z",
  //   updatedAt: "2024-05-20T02:23:10.813Z",
  // };

  if (!response) {
    return { message: "Failed to upload image", status: 400 };
  }
  try {
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

export async function Inference(selectedImage: string, imageUrl: string) {
  const replicate = new Replicate();
  const input = {
    garm_img: bucketUrl + `/img` + imageUrl,
    human_img: selectedImage,
    garment_des: "t-shirt",
  };
  const output = await replicate.run(
    "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
    { input }
  );

  return output as unknown as string;
}

export async function getProduct(id: string) {
  // const client = generateClient<Schema>({});

  const response = await cookieBasedClient.models.product.get(
    {
      id: id,
    },
    {
      authMode: "apiKey",
      selectionSet: ["src", "altText", "description"],
    }
  );

  console.log(response);

  return response.data;
}
