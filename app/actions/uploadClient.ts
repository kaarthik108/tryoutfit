// uploadClient.ts
import { Amplify } from "aws-amplify";
import { uploadData } from "aws-amplify/storage";
import outputs from "../../amplify_outputs.json";
import { updateImage } from "./upload";

Amplify.configure(outputs, { ssr: true });

export const bucketUrl = `https://amplify-tryoutfit-kaarthikand-tryoutbucketccc32003-sazzlwg5m0ej.s3.amazonaws.com`;

export async function uploadImageClient(image: File, id: string) {
  console.log("image", image);
  console.log("id", id);

  try {
    const result = await uploadData({
      data: image,
      path: `img/${id}-${image.name}`,
    }).result;
    console.log("Image uploaded successfully:", result);

    const url = `${bucketUrl}/${result.path}`;

    await updateImage({ id, path: result.path });
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
