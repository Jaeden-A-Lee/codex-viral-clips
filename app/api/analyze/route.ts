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
      "You identify the 3 most viral short-form clips from a podcast transcript. Return strictly valid JSON only. Use ONLY timestamps explicitly present in the provided transcript segments. Each clip must correspond to the exact segment where the quoted hook appears. Never estimate, interpolate, or shift timestamps earlier or later. If uncertain, choose the closest exact transcript segment timestamp. Prioritize timestamp precision over clip quality.",
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