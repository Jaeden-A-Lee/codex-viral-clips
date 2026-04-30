"use client";

import { useState } from "react";

type Clip = {
  start: string;
  end: string;
  reason: string;
  hook: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!url.trim()) {
      setError("Please paste a YouTube URL");
      return;
    }

    setLoading(true);
    setLoadingText("Fetching transcript...");
    setError("");
    setClips([]);

    // STEP 1: get transcript segments
    const transcriptRes = await fetch("/api/transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ videoId: extractVideoId(url) })
    });

    const transcriptData = await transcriptRes.json();

    if (
      !transcriptRes.ok ||
      !Array.isArray(transcriptData.segments)
    ) {
      setError("Could not fetch transcript for this video");
      setLoading(false);
      setLoadingText("");
      return;
    }

    setLoadingText("Generating clips...");

    // STEP 2: send segments to AI
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        segments: transcriptData.segments
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Request failed");
      setLoading(false);
      setLoadingText("");
      return;
    }

    setClips(data.clips);
    setLoading(false);
    setLoadingText("");
  }

  function extractVideoId(input: string) {
    const match = input.match(
      /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] || input;
  }

  function formatTime(input: any) {
    const seconds = typeof input === "number"
      ? input
      : parseFloat(String(input).replace(/[^0-9.]/g, ""));

    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Viral Clip Finder 🚀</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste YouTube URL"
        style={{
          padding: 10,
          width: 400,
          marginTop: 20
        }}
      />

      <button
        onClick={handleGenerate}
        style={{
          display: "block",
          marginTop: 10,
          padding: 10
        }}
      >
        {loading ? loadingText : "Generate Clips"}
      </button>

      {error && (
        <p style={{ color: "crimson", marginTop: 10 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 30 }}>
        {clips.map((clip, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <b>
              {formatTime(clip.start)} - {formatTime(clip.end)}
            </b>
            <p>{clip.reason}</p>
            <i>{clip.hook}</i>
          </div>
        ))}
      </div>
    </main>
  );
}