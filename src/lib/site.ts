const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "https://forkitt.com";

export const siteConfig = {
  name: "forkitt",
  title: "Startup fork ideas for solo founders",
  description:
    "Explore proven startup patterns reworked into focused, bootstrappable business ideas for solo founders.",
  url: new URL(
    configuredSiteUrl.startsWith("http")
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`,
  ),
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

