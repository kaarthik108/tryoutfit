import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      }
    );

    if (response.ok) {
      const prediction = await response.json();
      return NextResponse.json(prediction);
    } else {
      return new NextResponse(null, { status: response.status });
    }
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch prediction" }),
      { status: 500 }
    );
  }
}
