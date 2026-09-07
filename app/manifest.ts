import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "O.J.E – ATV Kaliurang Merapi",
    short_name: "OJE ATV Kaliurang",
    description:
      "Tour & Petualangan ATV Kaliurang Merapi Yogyakarta. Sensasi jelajah hutan dan sungai.",
    start_url: "/",
    display: "standalone",
    background_color: "#1c1c1c",
    theme_color: "#b51b41",
    icons: [
      {
        src: "/images/logos.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logos.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
