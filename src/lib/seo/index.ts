import type { Metadata } from "next";
import { paginas, type PageKey } from "@/content/paginas";
import { site } from "@/content/site";
import { faq } from "@/content/faq";

export function pageMetadata(key: PageKey): Metadata {
  const p = paginas[key];
  const title = key === "inicio" ? { absolute: `${site.name} · ${p.title}` } : p.title;
  return {
    title,
    description: p.description,
    alternates: {
      canonical: p.path,
      types: { "text/markdown": `${p.path === "/" ? "/index" : p.path}.md` },
    },
    openGraph: { title: key === "inicio" ? `${site.name} · ${p.title}` : `${p.title} · ${site.name}`, description: p.description, url: p.path },
  };
}

const address = {
  "@type": "PostalAddress",
  addressLocality: site.address.city,
  addressRegion: site.address.region,
};

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organizacion`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  logo: `${site.url}/icon.png`,
  contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", email: site.email, telephone: site.whatsappDisplay.replace(/\s/g, ""), availableLanguage: "es-MX" }],
};

export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  "@id": `${site.url}/#negocio`,
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.whatsappDisplay.replace(/\s/g, ""),
  address,
  areaServed: site.address.city,
  parentOrganization: { "@id": `${site.url}/#organizacion` },
  priceRange: "$$",
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

const clean = (s: string) => s.replace(/\s*\[COMPLETAR[^\]]*\]/g, "").trim();

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.filter((f) => clean(f.a)).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: clean(f.a) } })),
  };
}
