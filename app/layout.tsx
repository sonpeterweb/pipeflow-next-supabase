import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pipeflow.app";
const siteDescription =
  "PipeFlow helps plumbing businesses manage jobs, customers, quotes, and invoices.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PipeFlow",
  title: {
    default: "PipeFlow",
    template: "%s | PipeFlow",
  },
  description: siteDescription,
  keywords: [
    "PipeFlow",
    "plumbing business software",
    "job management",
    "customer management",
    "quotes",
    "invoices",
    "field service management",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "PipeFlow",
    description: siteDescription,
    url: "/",
    siteName: "PipeFlow",
    images: [
      {
        url: "/og-image.jpg",
        width: 1731,
        height: 909,
        alt: "PipeFlow dashboard for plumbing business management",
      },
    ],
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PipeFlow",
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
