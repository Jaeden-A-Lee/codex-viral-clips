import { NextResponse } from "next/server";

const keywordGroups = {
  motivational: ["discipline", "consistency", "focus", "sacrifice"],
  business: ["revenue", "strategy", "market", "growth"],
  controversial: ["wrong", "disagree", "debate", "problem"],
  sports: ["game", "athlete", "season", "championship"]
};

const clipGroups = {
  motivational: [
    {
      start: "00:42",
      end: "01:18",
      reason: "Punchy discipline moment with a clear personal challenge",
      hook: "Discipline starts before you feel ready."
    },
    {
      start: "03:06",
      end: "03:51",
      reason: "Strong sacrifice theme that can drive emotional engagement",
      hook: "The life you want has a price."
    }
  ],
  business: [
    {
      start: "01:10",
      end: "01:58",
      reason: "Clear strategy insight tied to revenue and customer focus",
      hook: "Growth got easier when they stopped chasing everyone."
    },
    {
      start: "04:22",
      end: "05:05",
      reason: "Actionable market lesson with founder-style credibility",
      hook: "This is the mistake that quietly kills startups."
    }
  ],
  controversial: [
    {
      start: "00:55",
      end: "01:40",
      reason: "Direct disagreement creates tension and comment potential",
      hook: "He says everyone is blaming the wrong thing."
    },
    {
      start: "02:44",
      end: "03:29",
      reason: "Debate-style exchange with a sharp but balanced takeaway",
      hook: "This argument changes when you hear the second half."
    }
  ],
  sports: [
    {
      start: "01:32",
      end: "02:14",
      reason: "High-energy game moment with pressure and payoff",
      hook: "This is the exact moment the game flipped."
    },
    {
      start: "04:08",
      end: "04:52",
      reason: "Athlete mindset segment with championship stakes",
      hook: "Pressure does not create stars. It reveals them."
    }
  ],
  general: [
    {
      start: "01:05",
      end: "01:47",
      reason: "Personal turning point with broad audience appeal",
      hook: "Nobody saw the choice that changed everything."
    },
    {
      start: "03:18",
      end: "03:59",
      reason: "Reflective insight that makes a clean standalone clip",
      hook: "The signal was not comfort. It was clarity."
    }
  ]
};

function transcriptIncludes(transcript: string, keywords: string[]) {
  return keywords.some((keyword) => transcript.includes(keyword));
}

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

  const normalizedTranscript = transcript.toLowerCase();
  let clips = clipGroups.general;

  if (transcriptIncludes(normalizedTranscript, keywordGroups.business)) {
    clips = clipGroups.business;
  } else if (transcriptIncludes(normalizedTranscript, keywordGroups.controversial)) {
    clips = clipGroups.controversial;
  } else if (transcriptIncludes(normalizedTranscript, keywordGroups.sports)) {
    clips = clipGroups.sports;
  } else if (transcriptIncludes(normalizedTranscript, keywordGroups.motivational)) {
    clips = clipGroups.motivational;
  }

  return NextResponse.json({ url, clips });
}
