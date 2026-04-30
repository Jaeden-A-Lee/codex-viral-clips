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
  const [transcript, setTranscript] = useState("");
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    setClips(data.clips);
    setLoading(false);
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

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste podcast transcript here..."
        rows={10}
        style={{
          display: "block",
          padding: 10,
          width: 400,
          marginTop: 10,
          resize: "vertical"
        }}
      />

      <button
        onClick={handleGenerate}
        style={{ display: "block", marginTop: 10, padding: 10 }}
      >
        {loading ? "Generating..." : "Generate Clips"}
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
