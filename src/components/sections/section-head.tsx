import type { ReactNode } from "react";
import { MarkedTitle } from "@/components/ui/marked-title";

export function SectionHead({ id, eyebrow, title, mark, after, lead, children }: {
  id: string; eyebrow: string; title: string; mark?: string; after?: string; lead?: ReactNode; children?: ReactNode;
}) {
  return (
    <div className="mf-stack" style={{ maxWidth: 720 }}>
      <p className="mf-eyebrow">{eyebrow}</p>
      {mark ? (
        <MarkedTitle id={id} className="mf-h2" before={title} mark={mark} after={after} />
      ) : (
        <h2 id={id} className="mf-h2">{title}</h2>
      )}
      {lead && <p className="mf-lead">{lead}</p>}
      {children}
    </div>
  );
}
