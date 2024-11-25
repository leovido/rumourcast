import { NextResponse } from "next/server";
import { ActionPayload } from "@/lib/types";

export const runtime = "edge";

const NEXT_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://rumourcast.xyz.org"
    : "https://nook.ngrok.dev";

export async function POST(request: Request) {
  const body: ActionPayload = await request.json();

  return NextResponse.json({
    type: "form",
    title: "Rumourcast",
    url: `${NEXT_SERVER_URL}/actions/create-post?data=${body.trustedData.messageBytes}`,
  });
}

export async function GET() {
  return NextResponse.json({
    type: "composer",
    name: "Rumourcast",
    icon: "question",
    description: "Post anonymously",
    aboutUrl: "https://rumourcast.xyz",
    imageUrl:
      "https://dd.dexscreener.com/ds-data/tokens/base/0x0db510e79909666d6dec7f5e49370838c16d950f.png?size=lg&key=862023",
    action: {
      type: "post",
    },
  });
}
