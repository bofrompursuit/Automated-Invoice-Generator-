import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Automated Invoice Generator",
    short_name: "Invoices",
    description: "Create, preview, and export invoices.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#18181b",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
