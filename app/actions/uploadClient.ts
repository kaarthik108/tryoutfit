import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { getUrl, uploadData } from "aws-amplify/storage";
import outputs from "../../amplify_outputs.json";
import { updateImage } from "./upload";

Amplify.configure(outputs, { ssr: true });

export async function uploadImageClient(image: File, id: string) {
  try {
    const result = await uploadData({
      data: image,
      path: `img/${id}-${image.name}`,
    }).result;
    console.log("Image uploaded successfully:", result);

    const signedURL = await getUrl({
      path: result.path,
      options: { expiresIn: 3600, useAccelerateEndpoint: true },
    });

    // await updateImage({ id, path: result.path });
    return { url: signedURL.url.toString(), path: result.path };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function getAllProducts() {
  const client = generateClient<Schema>();
  const response = await client.models.product.list({
    authMode: "apiKey",
    selectionSet: ["id"],
  });

  return response.data;
}
