export default function BlogPostLoading() {
  return (
    <main style={{ padding: "88px 24px 72px" }}>
      <article style={{ maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#6f685b"
          }}
        >
          Loading article
        </p>
        <div
          style={{
            marginTop: 16,
            height: 48,
            borderRadius: 12,
            background: "#e7e0d0"
          }}
        />
        <div
          style={{
            marginTop: 14,
            height: 22,
            width: "72%",
            borderRadius: 12,
            background: "#efe8d8"
          }}
        />
        <div
          style={{
            marginTop: 28,
            padding: 24,
            borderRadius: 20,
            border: "1px solid #ddd8cb",
            background: "#fffdf8"
          }}
        >
          <div style={{ height: 18, borderRadius: 10, background: "#efe8d8" }} />
          <div
            style={{
              marginTop: 12,
              height: 18,
              width: "88%",
              borderRadius: 10,
              background: "#efe8d8"
            }}
          />
          <div
            style={{
              marginTop: 12,
              height: 18,
              width: "82%",
              borderRadius: 10,
              background: "#efe8d8"
            }}
          />
        </div>
      </article>
    </main>
  );
}
