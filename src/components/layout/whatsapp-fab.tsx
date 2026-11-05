"use client";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

/** Botón flotante. Se oculta con CSS mientras el aviso de cookies, el modal o el menú están abiertos. */
export function WhatsAppFab() {
  const path = usePathname() || "/";
  return (
    <a
      className="mf-fab mf-fab--compact"
      href={whatsappUrl({ path })}
      target="_blank"
      rel="noopener"
      data-cta="whatsapp"
      data-fab=""
      onClick={() => track("cta_whatsapp", { lugar: "flotante", pagina: path })}
    >
      <Icon name="whatsapp" />
      <span className="mf-fab__label">Escríbenos por WhatsApp</span>
    </a>
  );
}
