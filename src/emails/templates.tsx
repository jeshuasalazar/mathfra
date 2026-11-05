import { Link, Text } from "@react-email/components";
import { EmailLayout, buttonStyle, textStyle } from "./layout";

export function ContactoNegocio(p: { nombre: string; email: string; telefono?: string; interes: string; mensaje: string; pagina?: string; publicidad: boolean }) {
  return (
    <EmailLayout preview={`Nuevo mensaje de ${p.nombre}`}>
      <Text style={textStyle}><strong>Nuevo mensaje desde el sitio</strong></Text>
      <Text style={textStyle}>Nombre: {p.nombre}<br />Correo: {p.email}<br />Teléfono: {p.telefono || "—"}<br />Interés: {p.interes}<br />Página: {p.pagina || "—"}<br />Acepta publicidad: {p.publicidad ? "sí" : "no"}</Text>
      <Text style={{ ...textStyle, whiteSpace: "pre-wrap" }}>{p.mensaje}</Text>
    </EmailLayout>
  );
}

export function ContactoAcuse(p: { nombre: string; whatsappUrl: string }) {
  return (
    <EmailLayout preview="Recibimos tu mensaje">
      <Text style={textStyle}>Hola, {p.nombre}:</Text>
      <Text style={textStyle}>Recibimos tu mensaje. Te respondemos hoy mismo con fechas, precio y horarios. Si quieres ir más rápido, escríbenos por WhatsApp.</Text>
      <Link href={p.whatsappUrl} style={buttonStyle}>Escríbenos por WhatsApp</Link>
    </EmailLayout>
  );
}

export function BoletinConfirmar(p: { confirmUrl: string; unsubscribeUrl: string }) {
  return (
    <EmailLayout
      preview="Confirma tu suscripción al boletín de Mathfra"
      footer={<Text style={{ fontSize: 12, color: "#46536B" }}>¿No lo pediste? Ignora este correo o <Link href={p.unsubscribeUrl}>date de baja</Link>.</Text>}
    >
      <Text style={textStyle}>Falta un paso: confirma que quieres recibir el boletín de Mathfra (fechas del ECOEMS y un ejercicio resuelto al mes).</Text>
      <Link href={p.confirmUrl} style={buttonStyle}>Confirmar suscripción</Link>
    </EmailLayout>
  );
}

export function BoletinBienvenida(p: { unsubscribeUrl: string }) {
  return (
    <EmailLayout
      preview="Ya estás en el boletín de Mathfra"
      footer={<Text style={{ fontSize: 12, color: "#46536B" }}><Link href={p.unsubscribeUrl}>Darme de baja</Link></Text>}
    >
      <Text style={textStyle}>Listo, ya estás suscrito. Te escribimos cuando haya fechas del ECOEMS y una vez al mes con un reactivo difícil resuelto paso a paso.</Text>
    </EmailLayout>
  );
}

export function Recibo(p: { nombre: string; plan: string; totalMXN: number; ivaMXN: number; folio: string; metodo: string }) {
  const f = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  return (
    <EmailLayout preview={`Recibo de pago ${p.folio}`}>
      <Text style={textStyle}>Hola{p.nombre ? `, ${p.nombre}` : ""}: confirmamos tu pago.</Text>
      <Text style={textStyle}>Curso: {p.plan}<br />Folio: {p.folio}<br />Método: {p.metodo}<br />Subtotal: {f(p.totalMXN - p.ivaMXN)}<br />IVA (16 %): {f(p.ivaMXN)}<br /><strong>Total: {f(p.totalMXN)} MXN</strong></Text>
      <Text style={textStyle}>Tienes 5 días hábiles para cancelar sin costo. Te escribimos por WhatsApp con tu grupo y fecha de inicio.</Text>
      <Text style={{ fontSize: 12, color: "#46536B" }}>Este recibo no es un comprobante fiscal (CFDI). [COMPLETAR: cómo solicitar factura]</Text>
    </EmailLayout>
  );
}
