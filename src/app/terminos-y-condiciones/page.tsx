import { PageHeader } from "@/components/layout/page-header";
import { LegalDocument } from "@/components/legal-doc";
import { terminos } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("terminos-y-condiciones");
export default function Page() {
  return <><PageHeader page="terminos-y-condiciones" /><LegalDocument doc={terminos} /></>;
}
