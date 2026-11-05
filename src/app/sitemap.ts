import type { MetadataRoute } from "next";
import { paginas } from "@/content/paginas";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(paginas).map((p) => ({
    url: `${site.url}${p.path}`,
    lastModified: site.updatedAt,
    changeFrequency: "monthly",
    priority: p.path === "/" ? 1 : p.path.startsWith("/aviso") || p.path.startsWith("/terminos") || p.path.startsWith("/politica") ? 0.3 : 0.7,
  }));
}
