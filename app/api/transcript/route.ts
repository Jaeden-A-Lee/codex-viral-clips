import { NextResponse } from "next/server";
import { fetchTranscript } from "youtube-transcript";

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();

    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { error: "Invalid videoId" },
        { status: 400 }
      );
    }

    const transcriptEntries = await fetchTranscript(videoId);

    const segments = transcriptEntries.map((entry) => {
      const start =
        typeof entry.offset === "number" ? entry.offset : 0;

      const duration =
        typeof entry.duration === "number" ? entry.duration : 0;

      return {
        text: entry.text.trim(),
        start: Number(entry.offset) / 1000,
        duration: Number(entry.duration) / 1000,
        end: (Number(entry.offset) + Number(entry.duration)) / 1000
      };
    });

    return NextResponse.json({
      url: videoId,
      segments
    });

  } catch {
    return NextResponse.json(
      { error: "Could not fetch transcript" },
      { status: 500 }
    );
  }
}