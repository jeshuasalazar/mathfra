/** Eventos de conversión. Solo se envían si Umami se cargó (es decir, si hubo consentimiento de medición). */
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function track(event: string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
  } catch {
    /* sin analítica */
  }
}
