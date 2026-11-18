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
  title: "Wisata Merapi – Lava Tour Jeep Merapi Yogyakarta | Resmi & Terpercaya",
  description:
    "Layanan wisata edukasi dan adventure Lava Tour Merapi menggunakan mobil Jeep 4x4 (maks 4 penumpang). Pilihan Paket 1, 1B, 2, Sunrise, 3, & 4 mulai Rp 450.000. Hubungi 0812-2698-3990.",
  keywords: [
    "Wisata Merapi",
    "Lava Tour Merapi",
    "Jeep Merapi",
    "Sewa Jeep Merapi",
    "Paket Lava Tour Merapi",
    "Jeep Kaliurang Merapi",
    "Harga Jeep Merapi",
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
    title: "Wisata Merapi – Lava Tour Jeep Merapi Yogyakarta",
    description:
      "Nikmati serunya berpetualang di sepanjang bekas aliran lahar dingin erupsi Merapi 2010 menggunakan mobil Jeep 4x4. Paket mulai Rp 450.000/Jeep.",
    type: "website",
    url: `${SITE_URL}/`,
    images: [
      {
        url: SITE_ASSETS.ogImage,
        width: 1200,
        height: 630,
        alt: "Wisata Lava Tour Jeep Merapi",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisata Merapi – Lava Tour Jeep Merapi Yogyakarta",
    description:
      "Jelajahi Bunker Kaliadem, Petilasan Mbah Maridjan, Batu Alien, & Kali Kuning dengan Jeep 4x4.",
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
  name: "Wisata Lava Tour Merapi",
  description:
    "Layanan wisata edukasi dan adventure berkeliling kawasan Gunung Merapi yang terkena dampak erupsi 2010 menggunakan mobil Jeep kapasitas 4 penumpang.",
  url: SITE_URL,
  telephone: "+6281226983990",
  priceRange: "Rp 450.000 - Rp 750.000",
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
