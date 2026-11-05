import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ContactForm } from "@/components/forms/contact-form";
import { Icon } from "@/components/ui/icon";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = pageMetadata("contacto");
export default function Page() {
  return (
    <>
      <PageHeader page="contacto"><WhatsAppButton place="contacto-encabezado" size="lg" /></PageHeader>
      <section className="mf-section" aria-labelledby="t-form">
        <div className="mf-container mf-split mf-split--title">
          <div className="mf-stack">
            <p className="mf-eyebrow">Formulario</p>
            <h2 id="t-form" className="mf-h2">Déjanos tus datos.</h2>
            <p className="mf-lead">Te respondemos el mismo día por correo o WhatsApp.</p>
            <ul className="mf-stack" style={{ listStyle: "none", padding: 0, margin: 0, gap: 4 }}>
              <li><a className="mf-link" href={`mailto:${site.email}`}><Icon name="mail" />{site.email}</a></li>
              <li style={{ display: "flex", gap: 6, alignItems: "center", minHeight: 44 }}><Icon name="map-pin" />{site.address.city}</li>
            </ul>
          </div>
          <div className="mf-card"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
