import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, transcript } = await req.json();

  if (!url || typeof url !== "string" || url.trim() === "") {
    return NextResponse.json(
      { error: "Missing YouTube link" },
      { status: 400 }
    );
  }

  if (!transcript || typeof transcript !== "string" || transcript.trim() === "") {
    return NextResponse.json(
      { error: "Transcript is required" },
      { status: 400 }
    );
  }

  const clips = [
    {
      start: "01:23",
      end: "02:05",
      reason: "Strong emotional reaction + hook moment",
      hook: "You won't believe what happens next..."
    },
    {
      start: "05:10",
      end: "05:45",
      reason: "Controversial opinion that triggers engagement",
      hook: "This is where everything changes..."
    }
  ];

  return NextResponse.json({ url, clips });
}