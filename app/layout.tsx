import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import localFont from "next/font/local";
import ThemeInitializer from "@/app/components/ThemeInitializer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const google = localFont({
  src: [
    {
      path: "/fonts/Product Sans Regular.ttf",
    },
    {
      path: "/fonts/Product Sans Italic.ttf",
      style: "italic",
    },
    {
      path: "/fonts/Product Sans Bold.ttf",
      weight: "bold",
    },
    {
      path: "/fonts/Product Sans Bold Italic.ttf",
      weight: "bold",
      style: "italic",
    },
  ],
  variable: "--font-google",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aptinova.tech"),
  title: "Aptinova | AI-Powered HR Software & Recruitment Platform",
  description:
    "Aptinova is an AI-powered hiring platform that streamlines recruitment, automates candidate screening, and finds the best talent faster. Save time and resources with our advanced HR software solution.",
  keywords: [
    "HR software",
    "recruitment platform",
    "hiring solution",
    "AI recruiting",
    "talent acquisition",
    "applicant tracking system",
    "HR technology",
    "candidate screening",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Aptinova" }],
  category: "HR Technology",
  openGraph: {
    title: "Aptinova | AI-Powered HR Software & Recruitment Platform",
    description:
      "Revolutionize your hiring process with AI-powered recruitment technology. Find better candidates faster.",
    url: "https://aptinova.tech",
    siteName: "Aptinova",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://aptinova.tech/screenshots/desktop1.png",
        width: 1200,
        height: 630,
        alt: "Aptinova HR Software Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aptinova | AI-Powered HR Software & Recruitment Platform",
    description:
      "Revolutionize your hiring process with AI-powered recruitment technology. Find better candidates faster.",
    images: ["https://aptinova.tech/screenshots/desktop1.png"],
    creator: "@aptinova",
  },
  verification: {
    google: "uPS9KjtBJL1lZf4vNbDtNbQh9s25rL7cFVLbjruBYXY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Aptinova",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "AI-powered hiring platform that simplifies recruitment and finds the best candidates in less time.",
            }),
          }}
        />
      </head>
      <Analytics />
      <SpeedInsights />
      <body
        className={`${geistSans.variable}  ${geistMono.variable} font-google ${google.variable} antialiased`}
      >
        <ThemeInitializer />

        {children}
      </body>
    </html>
  );
}
