import Link from "next/link";

export default function NotFoundPage() {
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
          width: "min(640px, 100%)",
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
          404
        </p>
        <h1
          style={{
            margin: "12px 0 10px",
            fontSize: 34,
            lineHeight: 1.05,
            letterSpacing: "-0.04em"
          }}
        >
          The requested post was not found.
        </h1>
        <p style={{ margin: "0 0 18px", color: "#4f4a3f", lineHeight: 1.6 }}>
          This usually means the slug does not exist in the current local
          sample data or in the configured Supabase dataset.
        </p>
        <Link
          href="/"
          style={{ color: "#101010", fontWeight: 700, textDecoration: "none" }}
        >
          Return to the starter homepage
        </Link>
      </div>
    </main>
  );
}
