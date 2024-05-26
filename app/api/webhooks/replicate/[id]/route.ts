import { uploadOutputToS3 } from "@/app/actions/upload";
import { cookieBasedClient } from "@/lib/amplify-utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[4];
  const { output, status } = await req.json();

  if (status === "succeeded") {
    try {
      const s3Url = await uploadOutputToS3(output, id);
      console.log("Uploaded successfully to:", s3Url);

      const updateResponse = await cookieBasedClient.models.generations.update(
        {
          id: id,
          output: s3Url,
        },
        { authMode: "apiKey" }
      );

      if (!updateResponse.data) {
        return new Response(`Error updating output URL: ${updateResponse}`, {
          status: 400,
        });
      }
    } catch (error) {
      console.error("Error handling succeeded status:", error);
      return new Response(`Error: ${error}`, { status: 500 });
    }
  } else if (status === "failed" || status === "cancelled") {
    const updateResponse = await cookieBasedClient.models.generations.update(
      {
        id: id,
        failed: true,
      },
      { authMode: "apiKey" }
    );

    if (!updateResponse.data) {
      return new Response(`Error updating failed status: ${updateResponse}`, {
        status: 400,
      });
    }
  }

  return new Response("OK", { status: 200 });
}
