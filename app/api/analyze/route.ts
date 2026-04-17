import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json(
      { error: "Missing YouTube URL" },
      { status: 400 }
    );
  }

  // TEMP MOCK DATA (we will replace with AI later)
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