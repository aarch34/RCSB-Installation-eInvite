import type { MetadataRoute } from "next";
import { EVENT, META } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${EVENT.title} — ${EVENT.fullTitle}`,
    short_name: EVENT.title,
    description: META.description,
    start_url: "/",
    display: "standalone",
    background_color: "#231815", // Matches page dark background
    theme_color: "#F5EFC8",      // Matches the signature gold/cream
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
