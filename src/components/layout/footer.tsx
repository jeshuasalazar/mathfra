import Link from "next/link";
import { footerNav, legalNav, site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { CookiePrefsLink } from "@/components/privacy/cookie-prefs-link";

export function Footer() {
  return (
    <footer className="mf-footer">
      <div className="mf-container">
        <div className="mf-footer__grid">
          <div>
            <Link className="mf-brand" href="/">Mathfra<span className="mf-brand__dot" aria-hidden="true" /></Link>
            <p className="mf-on-ink-soft" style={{ marginTop: 12, maxWidth: "36ch" }}>{site.tagline}. Empezamos por lo difícil.</p>
            <ul style={{ marginTop: 16 }}>
              <li><a href={whatsappUrl({ path: "/" })} target="_blank" rel="noopener" data-cta="whatsapp">WhatsApp {site.whatsappDisplay}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            </ul>
          </div>
          {footerNav.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="mf-footer__title">{g.title}</p>
              <ul>{g.items.map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="mf-footer__legal">
          <span>© {new Date(site.updatedAt).getFullYear()} {site.legalName}</span>
          {legalNav.map((i) => <Link key={i.href} href={i.href}>{i.label}</Link>)}
          <CookiePrefsLink />
          <Link href="/entrar">Mi cuenta</Link>
        </div>
      </div>
    </footer>
  );
}
