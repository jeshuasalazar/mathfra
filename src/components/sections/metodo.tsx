import { metodo } from "@/content/home";

export function MetodoSteps() {
  return (
    <ol className="mf-steps">
      {metodo.steps.map((s, i) => (
        <li key={s.title} className={`mf-card mf-step${s.key ? " mf-step--key" : ""}`}>
          <span className="mf-step__n" aria-hidden="true">{i + 1}</span>
          <div className="mf-stack" style={{ gap: 8 }}>
            <h3 className="mf-h3">{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
