import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#b51b41",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "O.J.E – Atv Kaliurang Merapi | Petualangan Wisata ATV Jogja",
  description:
    "Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga, teman, atau orang terkasih Anda. ATV Single 300K, Boncengan +50K. Hubungi 081338330330.",
  keywords: [
    "OJE ATV Kaliurang",
    "ATV Kaliurang Merapi",
    "Tour ATV Kaliurang",
    "Wisata ATV Merapi",
    "Sewa ATV Kaliurang",
    "ATV Jogja",
    "Harga ATV Kaliurang",
  ],
  icons: {
    icon: "/images/logos.png",
    apple: "/images/logos.png",
  },
  metadataBase: new URL("https://ojeatvkaliurang.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "O.J.E – Atv Kaliurang Merapi",
    description:
      "Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga, teman, atau orang terkasih Anda. Paket mulai 300K.",
    type: "website",
    url: "https://ojeatvkaliurang.com/",
    images: [
      {
        url: "/images/ATV-KALIURANG-1.jpeg",
        width: 1200,
        height: 630,
        alt: "ATV Kaliurang Merapi",
      },
    ],
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "OJE ATV Kaliurang Merapi",
  description:
    "Penyewaan dan tur petualangan ATV di Kaliurang Merapi Yogyakarta melintasi rute hutan, sungai, dan trek offroad menantang.",
  url: "https://ojeatvkaliurang.com",
  telephone: "+6281338330330",
  priceRange: "Rp 300.000 - Rp 350.000",
  image: "https://ojeatvkaliurang.com/images/ATV-KALIURANG-1.jpeg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kaliurang Timur, RT.05/RW15, Kaliurang, Hargobinangun",
    addressLocality: "Pakem",
    addressRegion: "Kabupaten Sleman, Daerah Istimewa Yogyakarta",
    postalCode: "55582",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-7.59972",
    longitude: "110.42861",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [
    "https://www.tiktok.com/@oje_atvkaliurang",
    "https://www.instagram.com/oje_atvkaliurang/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900 font-sans">{children}</body>
    </html>
  );
}
