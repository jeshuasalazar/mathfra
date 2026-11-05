import { Txt } from "@/components/ui/txt";
import { legalDisclaimer, type Block, type LegalDoc } from "@/content/legal";

function B({ b }: { b: Block }) {
  if (typeof b === "string") return <p><Txt>{b}</Txt></p>;
  if ("list" in b) return <ul>{b.list.map((i) => <li key={i}><Txt>{i}</Txt></li>)}</ul>;
  return (
    <div className="mf-table-wrap">
      <table>
        <thead><tr>{b.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{b.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  const fecha = new Date(doc.updatedAt + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  return (
    <section className="mf-section" aria-label="Documento">
      <div className="mf-container">
        <article className="mf-prose" style={{ maxWidth: 800 }}>
          <p className="mf-badge">Última actualización: <time dateTime={doc.updatedAt}>{fecha}</time></p>
          <p>{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.title} aria-label={s.title} className="mf-prose">
              <h2>{s.title}</h2>
              {s.blocks.map((b, i) => <B key={i} b={b} />)}
            </section>
          ))}
          <p className="mf-legal-note">{legalDisclaimer}</p>
        </article>
      </div>
    </section>
  );
}
