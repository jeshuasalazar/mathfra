import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

/** Plantilla de correo con los tokens de Mathfra (valores literales: los clientes de correo no leen CSS variables). */
const c = { ink: "#0E1726", soft: "#46536B", bg: "#F6F8FC", surface: "#FFFFFF", primary: "#1E5EFF", accent: "#22C3A6" };

export function EmailLayout({ preview, children, footer }: { preview: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <Html lang="es-MX">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ background: c.bg, color: c.ink, fontFamily: "Archivo, Arial, sans-serif", margin: 0, padding: "24px 0" }}>
        <Container style={{ maxWidth: 560, background: c.surface, border: `2px solid ${c.ink}`, borderRadius: 16, padding: 28 }}>
          <Text style={{ fontFamily: "'Archivo Black', 'Arial Black', Arial, sans-serif", fontSize: 24, margin: "0 0 16px" }}>
            Mathfra<span style={{ display: "inline-block", width: 10, height: 10, background: c.accent, border: `2px solid ${c.ink}`, marginLeft: 3 }} />
          </Text>
          <Section>{children}</Section>
          <Hr style={{ borderColor: "#C5CEDF", borderWidth: 2, margin: "24px 0 12px" }} />
          <Text style={{ fontSize: 12, color: c.soft, margin: 0 }}>
            Mathfra SA de CV · Santa Clara · <Link href="https://mathfra.app/aviso-de-privacidad" style={{ color: c.primary }}>Aviso de privacidad</Link>
          </Text>
          {footer}
        </Container>
      </Body>
    </Html>
  );
}

export const textStyle = { fontSize: 16, lineHeight: "1.6", margin: "0 0 12px" };
export const buttonStyle = {
  display: "inline-block", background: c.primary, color: "#FFFFFF", padding: "14px 22px", borderRadius: 10,
  border: `2px solid ${c.ink}`, fontWeight: 700, textDecoration: "none",
};
