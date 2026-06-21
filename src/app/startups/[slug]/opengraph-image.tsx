import { ImageResponse } from "next/og";

import { getStartupDetailBySlug } from "@/lib/supabase";

export const alt = "Startup fork ideas on forkitt";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type StartupOpenGraphImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StartupOpenGraphImage({
  params,
}: StartupOpenGraphImageProps) {
  const { slug } = await params;
  const startup = await getStartupDetailBySlug(slug);

  const name = startup?.name ?? "Startup";
  const category = startup?.category ?? "startup";
  const ideaCount = startup?.forkIdeas.length ?? 0;

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
          <div
            style={{
              display: "flex",
              color: "#d6ff4f",
              fontSize: 18,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#aaa58f", fontSize: 24 }}>
            {`${ideaCount} focused fork ${
              ideaCount === 1 ? "idea" : "ideas"
            } for`}
          </div>
          <div
            style={{
              marginTop: 18,
              maxWidth: 1020,
              fontSize: 96,
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: "-4px",
            }}
          >
            {name}
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
