import { Hero } from "@/components/sections/hero";
import { Beneficios } from "@/components/sections/beneficios";
import { Servicios } from "@/components/sections/servicios";
import { Testimonios } from "@/components/sections/testimonios";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { Boletin } from "@/components/sections/boletin";
import { Temario } from "@/components/sections/temario";
import { Equipo } from "@/components/sections/equipo";
import { Horarios } from "@/components/sections/horarios";
import { Certificaciones } from "@/components/sections/certificaciones";
import { CtaFinal } from "@/components/sections/cta-final";
import { JsonLd } from "@/components/ui/json-ld";
import { faqLd, localBusinessLd, pageMetadata } from "@/lib/seo";
import { ctaMedio } from "@/content/home";

export const metadata = pageMetadata("inicio");

export default function Home() {
  return (
    <>
      <JsonLd data={localBusinessLd} />
      <JsonLd data={faqLd()} />
      <Hero />
      <Beneficios />
      <Servicios />
      <Testimonios />
      <CtaBand title={ctaMedio.title} text={ctaMedio.text} place="tras-testimonios" />
      <Faq />
      <Boletin />
      <Temario />
      <Equipo />
      <Horarios />
      <Certificaciones />
      <CtaFinal />
    </>
  );
}
