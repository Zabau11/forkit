import type { MetadataRoute } from "next";

import { getPublishedStartupsForSitemap } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startups = await getPublishedStartupsForSitemap();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/startups"),
      lastModified: startups[0]?.createdAt
        ? new Date(startups[0].createdAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...startups.map((startup) => ({
      url: absoluteUrl(`/startups/${startup.slug}`),
      lastModified: new Date(startup.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

