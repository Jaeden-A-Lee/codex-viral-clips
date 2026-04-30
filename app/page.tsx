"use client";

import { useState } from "react";

type Clip = {
  start: string;
  end: string;
  reason: string;
  hook: string;
};

function getMockTranscript(url: string) {
  if (url.includes("test1")) {
    return "Transcript A: The guest shares a surprising story about building momentum, taking risks, and finding the one clip that changes the whole conversation.";
  }

  if (url.includes("test2")) {
    return "Transcript B: The host and guest debate a controversial idea, then land on a practical insight that would make a strong short-form hook.";
  }

  return "Default transcript: This podcast episode includes a compelling opening, an emotional turning point, and several concise moments that could become viral clips.";
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setLoadingText("Fetching transcript...");

    await new Promise((resolve) => setTimeout(resolve, 300));

    const transcript = getMockTranscript(url);
    setLoadingText("Generating clips...");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, transcript })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Request failed");
      setLoading(false);
      setLoadingText("");
      return;
    }

    setClips(data.clips);
    setLoading(false);
    setLoadingText("");
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Viral Clip Finder 🚀</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste YouTube URL"
        style={{ padding: 10, width: 400, marginTop: 20 }}
      />

      <button
        onClick={handleGenerate}
        style={{ display: "block", marginTop: 10, padding: 10 }}
      >
        {loading ? loadingText : "Generate Clips"}
      </button>

      <div style={{ marginTop: 30 }}>
        {clips.map((clip, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <b>
              {clip.start} - {clip.end}
            </b>
            <p>{clip.reason}</p>
            <i>{clip.hook}</i>
          </div>
        ))}
      </div>
    </main>
  );
}
