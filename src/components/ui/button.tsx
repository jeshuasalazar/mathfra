import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Botón de shadcn/ui ajustado al sistema Mathfra: las variantes son las clases .mf-btn del sistema. */
export const buttonVariants = cva("mf-btn", {
  variants: {
    variant: { primary: "mf-btn--primary", secondary: "mf-btn--secondary" },
    size: { default: "", sm: "mf-btn--sm", lg: "mf-btn--lg" },
    block: { true: "mf-btn--block", false: "" },
  },
  defaultVariants: { variant: "primary", size: "default", block: false },
});

type V = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, block, ...props }: ComponentProps<"button"> & V) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, block, ...props }: ComponentProps<typeof Link> & V) {
  return <Link data-slot="button" className={cn(buttonVariants({ variant, size, block }), className)} {...props} />;
}
