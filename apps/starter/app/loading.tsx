export default function LoadingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f6f6f2",
        color: "#101010"
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          padding: 28,
          borderRadius: 24,
          border: "1px solid #ddd8cb",
          background: "#fffdf8"
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6f685b"
          }}
        >
          Loading
        </p>
        <h1
          style={{
            margin: "12px 0 10px",
            fontSize: 32,
            lineHeight: 1.05,
            letterSpacing: "-0.04em"
          }}
        >
          Preparing the starter content.
        </h1>
        <p style={{ margin: 0, color: "#4f4a3f", lineHeight: 1.6 }}>
          The app is resolving local sample content or fetching data from
          Supabase, depending on the current runtime configuration.
        </p>
      </div>
    </main>
  );
}
