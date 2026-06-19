import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "forkitt",
  description:
    "A curated database of VC-backed startups with vertical niche fork ideas for solo founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
