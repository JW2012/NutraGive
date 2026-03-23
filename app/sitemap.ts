import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

const BASE_URL = "https://nutra-give.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: requests } = await supabaseAdmin
    .from("requests")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  const requestUrls: MetadataRoute.Sitemap = (requests ?? []).map((r) => ({
    url: `${BASE_URL}/request/${r.id}`,
    lastModified: new Date(r.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...requestUrls,
  ];
}
