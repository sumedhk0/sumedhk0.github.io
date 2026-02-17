import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: -2,
            }}
          >
            Sumedh Kothari
          </h1>
          <p
            style={{
              fontSize: 24,
              color: "#a1a1aa",
              margin: 0,
              marginTop: 16,
            }}
          >
            Engineer building intelligent systems
          </p>
          <p
            style={{
              fontSize: 16,
              color: "#71717a",
              margin: 0,
              marginTop: 8,
            }}
          >
            Georgia Tech &middot; B.S. Engineering &middot; 2028
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
