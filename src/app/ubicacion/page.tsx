import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { CtaFinal } from "@/components/sections/cta-final";
import { Icon } from "@/components/ui/icon";
import { Txt } from "@/components/ui/txt";
import { JsonLd } from "@/components/ui/json-ld";
import { localBusinessLd, pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata = pageMetadata("ubicacion");
export default function Page() {
  const a = site.address;
  return (
    <>
      <JsonLd data={localBusinessLd} />
      <PageHeader page="ubicacion"><WhatsAppButton place="ubicacion" label="Pedir la ubicación por WhatsApp" size="lg" /></PageHeader>
      <section className="mf-section" aria-labelledby="t-dir">
        <div className="mf-container mf-split">
          <div className="mf-card mf-stack">
            <h2 id="t-dir" className="mf-h3" style={{ display: "flex", gap: 10, alignItems: "center" }}><Icon name="map-pin" size="lg" />Dirección</h2>
            <address style={{ fontStyle: "normal", lineHeight: 1.7 }}>
              <Txt>{a.street}</Txt><br /><Txt>{a.neighborhood}</Txt><br />{a.city}, {a.region} · CP <Txt>{a.postalCode}</Txt>
            </address>
            <p className="mf-small"><Txt>{a.note}</Txt></p>
            {a.mapsUrl ? (
              <a className="mf-link" href={a.mapsUrl} target="_blank" rel="noopener">Abrir en Google Maps<Icon name="arrow-up-right" /></a>
            ) : (
              <p className="mf-small"><Txt>[COMPLETAR: enlace de Google Maps / perfil de Google Business]</Txt></p>
            )}
          </div>
          <div className="mf-card mf-card--flat mf-stack">
            <h2 className="mf-h3" style={{ display: "flex", gap: 10, alignItems: "center" }}><Icon name="calendar" size="lg" />Horario de atención</h2>
            <p><Txt>{site.hours}</Txt></p>
            <p style={{ color: "var(--mf-color-text-soft)" }}>{site.responseNote}</p>
          </div>
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
