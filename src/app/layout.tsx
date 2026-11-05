import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { CookieConsent } from "@/components/privacy/cookie-consent";
import { JsonLd } from "@/components/ui/json-ld";
import { organizationLd } from "@/lib/seo";
import { site } from "@/content/site";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-archivo", display: "swap" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: "website", locale: site.locale, siteName: site.name },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F8FC" },
    { media: "(prefers-color-scheme: dark)", color: "#081127" },
  ],
};

/** Aplica el tema antes de pintar (evita parpadeo): localStorage o prefers-color-scheme. */
const themeScript = `try{var t=localStorage.getItem("mathfra-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" data-theme="light" className={`${archivo.variable} ${archivoBlack.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body>
        <a className="mf-skip" href="#contenido">Saltar al contenido</a>
        <JsonLd data={organizationLd} />
        <Navbar />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Footer />
        <WhatsAppFab />
        <CookieConsent />
        {/* Espacio para el widget de chat del agente de IA: se activa con NEXT_PUBLIC_CHAT_WIDGET_SRC. */}
        <div id="chat-widget" data-enabled={process.env.NEXT_PUBLIC_CHAT_WIDGET_SRC ? "true" : "false"} hidden />
      </body>
    </html>
  );
}
