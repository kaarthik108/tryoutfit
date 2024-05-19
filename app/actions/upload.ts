"use server";

import Replicate from "replicate";
// import { waitUntil } from "@vercel/functions";
import { generateClient } from "aws-amplify/api";

import { Schema } from "@/amplify/data/resource";
import { getUrl, uploadData } from "aws-amplify/storage";

export async function upload(previousState: any, formData: FormData) {
  const client = generateClient<Schema>({});

  console.log("uploading image");
  const image = formData.get("image") as File;
  if (!image) {
    return { message: "Missing image", status: 400 };
  }
  console.log(image);

  const response = await client.models.images.create({
    path: image.name,
  });

  const data = response.data;

  if (!data) {
    return { message: "Failed to upload image", status: 400 };
  }

  try {
    // Upload the image to S3 using Amplify
    const result = await uploadData({
      data: image,
      path: `img/${data.id}-${image.name}`,
      options: {
        contentType: "image/*",
      },
    }).result;

    console.log("Image uploaded successfully:", result);

    const updateResponse = await client.models.images.update({
      id: data.id,
      path: result.path,
    });

    const updatedData = updateResponse.data;

    if (!updatedData) {
      return { message: "Failed to upload image", status: 400 };
    }

    const url = `https://amplify-tryoutfit-kaarthikand-tryoutbucketccc32003-bhgw6f11banb.s3.amazonaws.com/${result.path}`;
    return {
      message: "Image uploaded successfully",
      data: {
        id: data.id,
        key: url,
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

export async function Inference(selectedImage: string, imageUrl: string) {
  const replicate = new Replicate();
  const input = {
    garm_img: imageUrl,
    human_img: selectedImage,
    garment_des: "t-shirt",
  };
  const output = await replicate.run(
    "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
    { input }
  );

  return output as unknown as string;
}
