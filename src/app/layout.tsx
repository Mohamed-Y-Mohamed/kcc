import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE } from "@/lib/site";

// Self-hosted by next/font — the old build pulled these from the Google CDN
// inside a styled-jsx block on every single page, which blocked render.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Set NEXT_PUBLIC_SITE_URL once you have a domain, so Open Graph images
// resolve to absolute URLs instead of localhost.
// `||` not `??` — an unset variable in .env arrives as "", not undefined.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.fullName} — Golol, Somalia`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Traditional Somali coffee, a kitchen serving bariis, hilib ari and fresh sambuus, and hotel rooms to book — on Argo Street in Golol.",
  keywords: [
    "Somali coffee",
    "Golol restaurant",
    "Somalia hotel",
    "KCC",
    "qaxwo",
    "bariis iskukaris",
  ],
  applicationName: SITE.fullName,
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: `${SITE.fullName} — Golol, Somalia`,
    description:
      "Somali coffee, Somali cooking, and a room for the night. Book a table or a room at KCC.",
    siteName: SITE.fullName,
    locale: "en_GB",
    type: "website",
    images: [{ url: "/logo.jpeg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#17110c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Sets the theme class before first paint so reloads don't flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
