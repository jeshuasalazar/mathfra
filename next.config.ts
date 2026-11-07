import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const umami = process.env.NEXT_PUBLIC_UMAMI_SRC ? new URL(process.env.NEXT_PUBLIC_UMAMI_SRC).origin : "";
const chat = process.env.NEXT_PUBLIC_CHAT_WIDGET_SRC ? new URL(process.env.NEXT_PUBLIC_CHAT_WIDGET_SRC).origin : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://challenges.cloudflare.com ${umami} ${chat}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${supabase} ${supabase.replace("https://", "wss://")} ${umami} https://api-gateway.umami.dev https://challenges.cloudflare.com ${chat} ${isDev ? "ws:" : ""}`,
  `frame-src https://challenges.cloudflare.com ${chat}`,
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].map((d) => d.replace(/\s+/g, " ").trim()).join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: { formats: ["image/avif", "image/webp"] },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // El brief de prospección cita /privacidad: lo llevamos al aviso integral.
    return [{ source: "/privacidad", destination: "/aviso-de-privacidad", permanent: true }];
  },
  async rewrites() {
    return [
      { source: "/index.md", destination: "/md/index" },
      { source: "/:slug.md", destination: "/md/:slug" },
    ];
  },
};

export default nextConfig;
