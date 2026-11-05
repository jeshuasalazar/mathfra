import { PageHeader } from "@/components/layout/page-header";
import { LegalDocument } from "@/components/legal-doc";
import { avisoPrivacidad } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("aviso-de-privacidad");
export default function Page() {
  return <><PageHeader page="aviso-de-privacidad" /><LegalDocument doc={avisoPrivacidad} /></>;
}
