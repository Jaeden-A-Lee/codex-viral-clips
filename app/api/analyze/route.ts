import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, segments } = await req.json();

  if (!Array.isArray(segments) || segments.length === 0) {
    return NextResponse.json(
      { error: "Transcript is required" },
      { status: 400 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const transcriptText = segments
    .map((s) => `[${s.start.toFixed(2)}s] ${s.text}`)
    .join("\n");

  const response = await openai.responses.create({
    model: "gpt-5.2",
    instructions:
      "You find viral podcast moments. You MUST ONLY use timestamps provided. Never invent or estimate time. Use segment.start values exactly.",
    input: `
Video URL: ${url}

Timestamped Transcript:
${transcriptText}
`,
    text: {
      format: {
        type: "json_schema",
        name: "clip_analysis",
        strict: true,
        schema: {
          type: "object",
          required: ["url", "clips"],
          additionalProperties: false,
          properties: {
            url: { type: "string" },
            clips: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                required: ["start", "end", "hook", "reason"],
                additionalProperties: false,
                properties: {
                  start: { type: "string" },
                  end: { type: "string" },
                  hook: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  });

  return NextResponse.json(JSON.parse(response.output_text));
}