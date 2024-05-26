import { cookieBasedClient } from "@/lib/amplify-utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[4];
  const { output, status } = await req.json();

  if (status === "succeeded") {
    const updateResponse = await cookieBasedClient.models.generations.update(
      {
        id: id,
        output: output,
      },
      { authMode: "apiKey" }
    );

    if (!updateResponse.data) {
      return new Response(`Error updating output URL: ${updateResponse}`, {
        status: 400,
      });
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
