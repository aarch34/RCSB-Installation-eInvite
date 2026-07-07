import type { MetadataRoute } from "next";
import { META } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: ["/admin", "/api", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: `${META.url}/sitemap.xml`,
  };
}
