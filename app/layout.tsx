import type { Metadata, Viewport } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { CONTACT, SITE_ASSETS, SITE_URL } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#b51b41",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "O.J.E – Atv Kaliurang Merapi | Petualangan Wisata ATV Jogja",
  description:
    "Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga, teman, atau orang terkasih Anda. ATV Single 300K, Boncengan +50K. Hubungi 0812-2698-3990.",
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
    icon: SITE_ASSETS.logo,
    apple: SITE_ASSETS.logo,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "O.J.E – Atv Kaliurang Merapi",
    description:
      "Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga, teman, atau orang terkasih Anda. Paket mulai 300K.",
    type: "website",
    url: `${SITE_URL}/`,
    images: [
      {
        url: SITE_ASSETS.ogImage,
        width: 1200,
        height: 630,
        alt: "ATV Kaliurang Merapi",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "O.J.E – Atv Kaliurang Merapi",
    description:
      "Jelajahi Hutan & Sungai Kaliurang Merapi bersama OJE ATV. Paket mulai 300K.",
    images: [SITE_ASSETS.ogImage],
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
  url: SITE_URL,
  telephone: "+6281226983990",
  priceRange: "Rp 300.000 - Rp 350.000",
  image: `${SITE_URL}${SITE_ASSETS.ogImage}`,
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
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "07:00",
      closes: "17:00",
    },
  ],
  sameAs: [CONTACT.TIKTOK_URL, CONTACT.INSTAGRAM_URL],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`scroll-smooth ${manrope.variable} ${montserrat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900 font-sans">{children}</body>
    </html>
  );
}
