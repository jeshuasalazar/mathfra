"use client";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { cta } from "@/content/site";

/** Llamado principal: abre WhatsApp con mensaje prellenado y la página de origen; registra la conversión. */
export function WhatsAppButton({ label = cta.label, extra, place, size = "default", block, variant = "primary", className, icon = true }: {
  label?: string; extra?: string; place: string; size?: "default" | "sm" | "lg"; block?: boolean;
  variant?: "primary" | "secondary"; className?: string; icon?: boolean;
}) {
  const path = usePathname() || "/";
  return (
    <a
      className={cn(buttonVariants({ variant, size, block }), className)}
      href={whatsappUrl({ path, extra })}
      target="_blank"
      rel="noopener"
      data-cta="whatsapp"
      onClick={() => track("cta_whatsapp", { lugar: place, pagina: path })}
    >
      {icon && <Icon name="whatsapp" />}
      {label}
      <span className="mf-sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
