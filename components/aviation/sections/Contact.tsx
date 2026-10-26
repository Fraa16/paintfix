import { Suspense } from "react";
import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { ContactForm, type ContactCopy } from "./ContactForm";
import { ContactFormFromQuery } from "./ContactFormFromQuery";
import { telHref } from "../shell/ui";

/**
 * Kontakt (README 8.4 Punkt 10, Referenz Zeilen 975–1044): links Einleitung und direkter Kontakt,
 * rechts das Angebotsformular mit Richtwerten (README 10.2).
 * Reveal wie in der Referenz nur auf der H2 (0). Das Formular selbst bleibt ohne Reveal: es ist beim
 * Sprung auf #av-contact sofort da und wechselt nach der Hydration (Suspense, ?type=) nicht neu.
 */
export function Contact({ locale }: { locale: Locale }) {
  const t = aviation[locale];
  // Nur die Texte, die das Formular braucht, und nur in dieser Sprache an den Client geben.
  const copy: ContactCopy = {
    f: t.f,
    est: t.est,
    tabs: t.tabs,
    models: t.models,
    types: t.types,
    sentTitle: t.sentTitle,
    sentText: t.sentText,
    again: t.again,
    fErr: t.fErr,
    opsPhone: t.opsPhone,
  };

  return (
    <section id="av-contact" aria-labelledby="av-contact-title" className="py-av-section">
      <div className="mx-auto grid max-w-av grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-[clamp(40px,6vw,120px)] gap-y-16 px-av-gutter">
        <div>
          <AvOverline>{t.formLabel}</AvOverline>
          <h2
            id="av-contact-title"
            data-rv="0"
            className="mt-7 font-cinzel text-av-h2-form leading-none font-normal tracking-[0.015em]"
          >
            {t.formTitle}
          </h2>
          <p className="mt-7 max-w-[440px] text-[17px] leading-[1.7] text-pretty text-av-muted">
            {t.formIntro}
          </p>
          <div className="mt-12 max-w-[440px] border-t border-av-navy pt-6">
            <p className="text-[10px] tracking-[0.3em] text-av-muted uppercase">{t.direct}</p>
            <p className="mt-3.5 font-cinzel text-[19.2px] leading-[1.5] font-normal">
              <a href={telHref(t.opsPhone)} className="transition-colors hover:text-av-gold-text">
                {t.opsPhone}
              </a>
              <br />
              <a href={`mailto:${t.opsMail}`} className="transition-colors hover:text-av-gold-text">
                {t.opsMail}
              </a>
            </p>
          </div>
        </div>

        <div>
          <Suspense fallback={<ContactForm locale={locale} copy={copy} />}>
            <ContactFormFromQuery locale={locale} copy={copy} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
