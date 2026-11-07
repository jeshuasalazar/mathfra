/** Reintentos con espera exponencial y fetch con tiempo límite. */

export const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class ErrorHttp extends Error {
  status: number;
  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.status = status;
  }
}

/** Reintenta en 429, 5xx y errores de red. No reintenta 4xx (son errores de configuración). */
export async function conReintentos<T>(fn: () => Promise<T>, intentos = 3, baseMs = 1000): Promise<T> {
  let ultimo: unknown;
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimo = e;
      const status = e instanceof ErrorHttp ? e.status : 0;
      if (status >= 400 && status < 500 && status !== 429) throw e;
      if (i < intentos - 1) await esperar(baseMs * 2 ** i + Math.random() * 250);
    }
  }
  throw ultimo;
}

export async function pedirJson<T>(url: string, init: RequestInit = {}, timeoutMs = 20000): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new ErrorHttp(res.status, `${new URL(url).host} respondió ${res.status}`);
  return (await res.json()) as T;
}
