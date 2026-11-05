import { PageHeader } from "@/components/layout/page-header";
import { LegalDocument } from "@/components/legal-doc";
import { politicaCookies } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("politica-de-cookies");
export default function Page() {
  return <><PageHeader page="politica-de-cookies" /><LegalDocument doc={politicaCookies} /></>;
}
