import type { NextConfig } from "next";

/**
 * Content-Security-Policy is shipped in Report-Only first, which is the safe
 * rollout order: the browser reports what it *would* have blocked without
 * breaking the site. Watch the console for a week, then rename the header to
 * `Content-Security-Policy` to enforce it.
 *
 * The allowances below are the ones this app genuinely needs: Firebase Auth and
 * Firestore over XHR/WebSocket, images from Storage, and the Google Maps embed.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  // Next.js ships an inline bootstrap and this app sets the theme class before
  // paint, so a nonce-based policy needs middleware — worth doing before you
  // switch this header to enforcing.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://*.supabase.co https://images.unsplash.com https://*.googleusercontent.com",
  "media-src 'self'",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.cloudfunctions.net",
  "frame-src https://www.google.com https://maps.google.com",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "Content-Security-Policy-Report-Only", value: CSP },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Admin-uploaded photos for menu items and rooms.
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      // Where the imported foodItems photos actually live.
      { protocol: "https", hostname: "**.supabase.co" },
      // Placeholder photography until the client supplies their own.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },

  async redirects() {
    return [
      // NOTE: do not add `/Hotel -> /hotel` here. Next.js matches `source`
      // case-insensitively, so that rule also matches `/hotel` and redirects
      // the page to itself — ERR_TOO_MANY_REDIRECTS on the whole booking flow.
      // The old `/Hotel` page was an empty file and never rendered, so there is
      // nothing to preserve.
      { source: "/landing", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
