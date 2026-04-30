"use client";

import { useState } from "react";

type Clip = {
  start: string;
  end: string;
  reason: string;
  hook: string;
};

function getMockTranscript(url: string) {
  const normalizedUrl = url.toLowerCase();

  if (normalizedUrl.includes("motivation")) {
    return "Host: What changed everything for you? Guest: I stopped negotiating with the alarm clock. Five o'clock. Feet on the floor. No speech. No drama. Host: That sounds simple, but most people fail there. Guest: They fail because they wait to feel ready. Discipline is not a feeling. It is a decision you repeat while nobody claps. Host: What about burnout? Guest: Rest is part of the plan, but excuses are not. You do the hard thing first. You train when it is raining. You make the call when your voice shakes. The breakthrough is not loud. It is quiet. It is the tenth rep. It is saying no to the easy version of your life.";
  }

  if (normalizedUrl.includes("controversial")) {
    return "Host: You said the system rewards outrage more than truth. Guest: Because it does. Look at what spreads. The calm answer gets buried. The extreme answer gets clipped. Host: That is too cynical. People still want nuance. Guest: They say they want nuance, then they share the most inflammatory ten seconds. Host: But creators have responsibility too. Guest: Absolutely. That is my point. Stop blaming only the algorithm when humans keep feeding it. Host: So what is the fix? Guest: Make disagreement useful again. Argue the idea, not the person. Host: And if the other side refuses? Guest: Then you win by being clearer, not louder.";
  }

  if (normalizedUrl.includes("business")) {
    return "Host: Walk me through the first decision that made the company work. Founder: We stopped selling features and started selling the outcome. Step one was narrowing the customer. Step two was raising prices. Step three was saying no to custom work that looked profitable but slowed the roadmap. Host: That is hard early on. Founder: It feels hard because revenue hides complexity. A bad customer can cost more than they pay. Host: What metric changed your mind? Founder: Retention. Once we focused on one painful workflow, churn dropped, referrals increased, and support tickets became product research. The strategy was not growth at all costs. It was clarity at all costs.";
  }

  if (normalizedUrl.includes("sports")) {
    return "Host: Fourth quarter, two minutes left, the whole building is shaking. Analyst: That is where stars separate themselves. You can see it in the body language. The defense is tired. The bench is standing. The crowd feels the moment before the scoreboard shows it. Host: And then the rookie takes the shot. Analyst: Huge courage. Not a perfect possession, but fearless. He comes off the screen, defender on his hip, one dribble, rises, and bang. Host: That changes a locker room. Analyst: Completely. Coaches talk about trust all season, but trust is built in moments like that. Pressure does not create character. It reveals who has been preparing.";
  }

  return "Host: The moment that stood out to me was when you described the choice nobody else understood. Guest: That was the turning point. From the outside it looked sudden, but it had been building for years. Host: What were people missing? Guest: They saw the result, not the tradeoffs. Every meaningful change has a private cost. You lose certainty before you gain momentum. Host: So how did you know to keep going? Guest: I paid attention to energy. The work was hard, but it made me more honest. That is usually the signal. When the story gets clearer, the next step gets simpler.";
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
