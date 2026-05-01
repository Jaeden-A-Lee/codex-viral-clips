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

  function extractVideoId(input: string) {
    const match = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || input;
  }

  function formatTime(input: any) {
    const seconds =
      typeof input === "number"
        ? input
        : parseFloat(String(input).replace(/[^0-9.]/g, ""));

    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  async function handleGenerate() {
    if (!url.trim()) {
      setError("Please paste a YouTube URL");
      return;
    }

    setLoading(true);
    setLoadingText("Fetching transcript...");
    setError("");
    setClips([]);

    const transcriptRes = await fetch("/api/transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ videoId: extractVideoId(url) })
    });

    const transcriptData = await transcriptRes.json();

    if (!transcriptRes.ok || !Array.isArray(transcriptData.segments)) {
      setError("Could not fetch transcript for this video");
      setLoading(false);
      setLoadingText("");
      return;
    }

    setLoadingText("Finding viral moments...");

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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        backgroundImage: "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 40%)",
        color: "white",
        padding: "50px 20px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto"
        }}
      >
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            marginBottom: 10,
            letterSpacing: "-1.5px",
            background: "linear-gradient(90deg, #ffffff, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Viral Clip Finder 🚀
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: 30
          }}
        >
          Paste a YouTube podcast link and instantly surface the most viral
          short-form moments.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10
          }}
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              fontSize: 16,
              outline: "none",
              boxShadow: "0 0 0 1px rgba(96,165,250,0.08)"
            }}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: "16px 28px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
              transition: "all 0.2s ease"
            }}
          >
            {loading ? loadingText : "Generate"}
          </button>
        </div>

        {error && (
          <p
            style={{
              color: "#f87171",
              marginTop: 15
            }}
          >
            {error}
          </p>
        )}

        {clips.length > 0 && (
          <div
            style={{
              marginTop: 40,
              display: "grid",
              gap: 20
            }}
          >
            {clips.map((clip, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(30,41,59,0.8)",
                  padding: 24,
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.15)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
                }}
              >
                <div
                  style={{
                    color: "#60a5fa",
                    fontWeight: "bold",
                    marginBottom: 10
                  }}
                >
                  {formatTime(clip.start)} → {formatTime(clip.end)}
                </div>

                <h3
                  style={{
                    marginBottom: 12,
                    fontSize: 20
                  }}
                >
                  {clip.hook}
                </h3>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.6
                  }}
                >
                  {clip.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}