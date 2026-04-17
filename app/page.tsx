export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Viral Clip Finder 🚀</h1>

      <p>Paste a YouTube URL to generate viral timestamps</p>

      <input
        placeholder="https://youtube.com/..."
        style={{ padding: 10, width: 400, marginTop: 20 }}
      />

      <button style={{ display: "block", marginTop: 10, padding: 10 }}>
        Generate Clips
      </button>
    </main>
  );
}