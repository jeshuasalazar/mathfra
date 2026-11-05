import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/** Titular con UN fragmento en marcatexto (DESIGN.md §2). */
export function MarkedTitle({ as: Tag = "h2", before, mark, after, className, id, sweep }: {
  as?: ElementType; before: string; mark: string; after?: string; className?: string; id?: string; sweep?: boolean;
}) {
  return (
    <Tag id={id} className={cn(className)}>
      {before}
      <span className={cn("mf-mark", sweep && "mf-mark--sweep")} data-mark={sweep ? "" : undefined}>{mark}</span>
      {after}
    </Tag>
  );
}
