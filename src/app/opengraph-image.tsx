import { ImageResponse } from "next/og";

export const alt = "forkitt — startup fork ideas for solo founders";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0d0a",
          color: "#f2efdf",
          padding: "68px 76px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>
            fork<span style={{ color: "#aaa58f" }}>itt</span>
          </div>
          <div style={{ color: "#d6ff4f", fontSize: 18 }}>
            for solo founders
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 980,
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-3px",
            }}
          >
            <span>Their billion-dollar idea,</span>
            <span style={{ color: "#aaa58f" }}> your vertical niche.</span>
          </div>
          <div
            style={{
              width: 160,
              height: 7,
              marginTop: 42,
              background: "#d6ff4f",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
