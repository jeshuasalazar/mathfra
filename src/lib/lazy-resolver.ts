"use client";
import type { FieldValues, Resolver } from "react-hook-form";

/** Resolver de Zod que descarga Zod solo al enviar (mejora el rendimiento de carga). */
export function lazyZodResolver<T extends FieldValues>(pick: (m: typeof import("./validation")) => import("zod").ZodType<T>): Resolver<T> {
  return async (values, ctx, opts) => {
    const [{ zodResolver }, schemas] = await Promise.all([import("@hookform/resolvers/zod"), import("./validation")]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (zodResolver as any)(pick(schemas))(values, ctx, opts);
  };
}
