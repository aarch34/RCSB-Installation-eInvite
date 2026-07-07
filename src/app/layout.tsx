import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { META, EVENT, HOST_CLUBS, GUESTS } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: META.title,
    template: "%s | UGAMA AARAMBHA 2K26",
  },
  description: META.description,
  metadataBase: new URL(META.url),
  keywords: META.keywords ? [...META.keywords] : undefined,
  authors: [{ name: "Rotaract Swarna Bengaluru & Rotaract Bengaluru Nava Chaitanya", url: META.url }],
  creator: "Rotaract Club of Swarna Bengaluru",
  publisher: "Rotaract Club of Swarna Bengaluru",
  category: "Event",
  classification: "Event eInvite",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: META.title,
    description: META.description,
    url: META.url,
    siteName: "UGAMA AARAMBHA",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: META.ogImage,
        width: 1200,
        height: 630,
        alt: `UGAMA AARAMBHA — ${EVENT.fullTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
    images: [META.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${EVENT.title} — ${EVENT.fullTitle}`,
    "description": META.description,
    "startDate": `${EVENT.dateISO}T18:00:00+05:30`,
    "endDate": `${EVENT.dateISO}T21:30:00+05:30`,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": EVENT.venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rotary House of Friendship, Lavelle Road",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560001",
        "addressCountry": "IN",
      },
    },
    "image": [
      `${META.url}${META.ogImage}`,
    ],
    "organizer": [
      {
        "@type": "Organization",
        "name": HOST_CLUBS[0],
        "url": META.url,
      },
      {
        "@type": "Organization",
        "name": HOST_CLUBS[1],
        "url": META.url,
      },
    ],
    "performer": GUESTS.map((guest) => ({
      "@type": "Person",
      "name": guest.name,
      "jobTitle": guest.role,
    })),
    "offers": {
      "@type": "Offer",
      "url": META.url,
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-07-01",
    },
  };

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={`${inter.variable} ${playfair.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

