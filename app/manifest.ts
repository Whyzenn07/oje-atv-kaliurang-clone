import { MetadataRoute } from "next";
import { SITE_ASSETS } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wisata Merapi – Lava Tour Jeep Merapi",
    short_name: "Wisata Merapi",
    description:
      "Wisata Edukasi & Adventure Lava Tour Jeep Merapi Yogyakarta.",
    start_url: "/",
    display: "standalone",
    background_color: "#1c1c1c",
    theme_color: "#b51b41",
    icons: [
      {
        src: SITE_ASSETS.logo,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: SITE_ASSETS.logo,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
