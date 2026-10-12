"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AvButton } from "@/components/aviation/Button";
import type { AviationCopy } from "@/content/aviation";
import { cx } from "@/lib/cx";
import { fieldFocus, fieldNoOutline } from "./form-styles";

/** Prüfung wie in der Referenz (README 10.3). */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const labelClass = "block text-[10px] tracking-[0.26em] text-av-on-navy-muted uppercase";
const inputClass = cx(
  // Platzhalter auf Navy in --av-on-navy-muted (8,8:1), das --av-muted der Aviation-Seite wäre zu dunkel.
  "h-12 w-full border-0 border-b bg-transparent p-0 text-[17px] text-av-cream placeholder:text-av-on-navy-muted",
  fieldNoOutline,
);
/** Linie rgba(244,239,230,.35), Fokus Creme; bei Fehler bleibt sie auch im Fokus --av-error. */
const lineOk = "border-av-cream/35 focus:border-av-cream";

/**
 * Lieferantenunterlagen anfordern (README 10.3, Referenz Zeilen 944–968). Phase 2: nur Oberfläche.
 * Der Erfolgszustand erscheint nur außerhalb der Produktion, damit keine Vorschau einen Versand vortäuscht.
 */
/** Texte des Unterlagen-Formulars in der aktuellen Sprache (von Terms.tsx). */
export type DocsCopy = Pick<
  AviationCopy,
  | "docsAgain"
  | "docsBtn"
  | "docsCompany"
  | "docsDone"
  | "docsDoneSub"
  | "docsEmail"
  | "docsErr"
  | "docsFile"
  | "docsMeta"
  | "docsNote"
>;

export function DocsForm({ copy: t }: { copy: DocsCopy }) {
  const id = useId();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  /** Fokus nur nach einem Wechsel zwischen Formular und Erfolg setzen, nicht beim Laden. */
  const switched = useRef(false);

  useEffect(() => {
    if (!switched.current) return;
    // Erfolgsmeldung nach dem Absenden, erstes Feld nach „Erneut herunterladen“.
    if (sent) doneRef.current?.focus();
    else companyRef.current?.focus();
  }, [sent]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError(true);
      emailRef.current?.focus();
      return;
    }
    setError(false);
    // Phase 3: Versand
    if (process.env.NODE_ENV !== "production") {
      switched.current = true;
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div role="status">
        <p
          ref={doneRef}
          tabIndex={-1}
          className="font-cinzel text-[clamp(22.4px,2.08vw,30.4px)] leading-[1.1] font-normal"
        >
          {t.docsDone}
        </p>
        <p className="mt-6 flex justify-between gap-4 border-y border-av-line-on-navy py-4 text-[13px]">
          <span className="wrap-anywhere">{t.docsFile}</span>
          <span className="flex-none text-av-on-navy-muted">{t.docsMeta}</span>
        </p>
        <p className="mt-4 text-[14px] leading-[1.6] wrap-anywhere text-av-on-navy">
          {t.docsDoneSub} {email.trim()}.
        </p>
        <AvButton
          variant="ghostCream"
          size="docs"
          onClick={() => {
            switched.current = true;
            setSent(false);
          }}
          className="mt-6 w-full"
        >
          {t.docsAgain}
        </AvButton>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit}>
      <label className={cx("block", fieldFocus)}>
        <span className={labelClass}>{t.docsCompany}</span>
        <input
          ref={companyRef}
          name="company"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={cx(inputClass, lineOk)}
        />
      </label>
      <label className={cx("mt-4 block", fieldFocus)}>
        <span className={labelClass}>{t.docsEmail}</span>
        <input
          ref={emailRef}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@operator.aero"
          value={email}
          aria-invalid={error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          className={cx(inputClass, error ? "border-av-error" : lineOk)}
        />
      </label>
      <div aria-live="polite">
        {error ? (
          <p id={`${id}-err`} className="mt-2 text-[13px] text-av-error">
            {t.docsErr}
          </p>
        ) : null}
      </div>
      <AvButton type="submit" variant="cream" className="mt-7 w-full">
        {t.docsBtn}
      </AvButton>
      <p className="mt-3.5 text-[12px] leading-[1.6] text-av-on-navy-muted">{t.docsNote}</p>
    </form>
  );
}
