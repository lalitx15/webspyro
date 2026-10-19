import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Webspyra - Premium Web Development",
    short_name: "Webspyra",
    description: "Award-winning web development agency creating fast, animated, and modern business websites.",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF2F7",
    theme_color: "#EEF2F7",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
