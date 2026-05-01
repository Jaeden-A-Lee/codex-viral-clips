# Viral Clip Finder 🚀

An AI-powered tool that analyzes YouTube podcast transcripts and finds the most viral short-form clip opportunities for TikTok, YouTube Shorts, and Instagram Reels.

Built for creators who want to turn long-form content into high-performing short clips instantly.

---

## What It Does

Paste a YouTube video URL and Viral Clip Finder will:

- Fetch the video transcript
- Preserve real transcript timestamps
- Analyze the conversation using OpenAI
- Identify the **3 strongest viral clip moments**
- Return:
  - Accurate timestamps
  - A compelling hook
  - Why the moment is likely to perform well

---

## Why I Built It

Content creators spend hours manually watching podcasts and interviews to find short-form clips worth posting.

Viral Clip Finder automates that process by using AI to identify moments with:

- Strong emotional hooks
- Debate / controversy
- Storytelling tension
- Motivational insight
- High engagement potential

---

## Tech Stack

- **Next.js 16**
- **React**
- **TypeScript**
- **OpenAI API**
- **youtube-transcript**
- **Turbopack**

---

## How It Works

### 1. Transcript Extraction
The app fetches transcript segments directly from YouTube.

### 2. Timestamp Preservation
Each transcript segment keeps its real timestamp.

### 3. AI Analysis
Timestamped transcript data is sent to OpenAI for analysis.

### 4. Viral Clip Selection
The model identifies the top 3 short-form moments based on virality potential.

### 5. Output
Users receive:

- Start / end timestamp
- Viral hook
- Reasoning

---

## Running Locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Example Use Cases

- Podcast clipping
- Creator repurposing
- Shorts generation
- Social media content strategy
- Highlight extraction

---

## Future Improvements

- Direct clip export
- More than 3 generated clips
- Virality scoring
- Downloadable timestamps
- Auto-caption generation
- TikTok / Shorts optimization suggestions

---

## Demo

Paste a YouTube podcast URL → Generate clips → Instantly get timestamped viral moments.

---

## Built By

Jaeden Lee

Built for the Codex Creator Challenge