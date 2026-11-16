"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AvButton } from "@/components/aviation/Button";
import { Honeypot, useSpamFields } from "@/components/shared/FormGuard";
import type { AviationCopy, Locale } from "@/content/aviation";
import { cx } from "@/lib/cx";
import { sendDocsRequest } from "@/lib/forms/actions";
import { docsRequestErrors, hasErrors, type FormResult } from "@/lib/forms/rules";
import { fieldFocus, fieldNoOutline } from "./form-styles";

const labelClass = "block text-[10px] tracking-[0.26em] text-av-on-navy-muted uppercase";
const inputClass = cx(
  // Platzhalter auf Navy in --av-on-navy-muted (8,8:1), das --av-muted der Aviation-Seite wäre zu dunkel.
  "h-12 w-full border-0 border-b bg-transparent p-0 text-[17px] text-av-cream placeholder:text-av-on-navy-muted",
  fieldNoOutline,
);
/** Linie rgba(244,239,230,.35), Fokus Creme; bei Fehler bleibt sie auch im Fokus --av-error. */
const lineOk = "border-av-cream/35 focus:border-av-cream";

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
  | "docsNote"
  | "docsSendErr"
>;

/**
 * Lieferantenunterlagen anfordern (README 10.3, Referenz Zeilen 944–968). Die Referenz startet einen
 * Download; solange es die Datei nicht gibt, geht die Anforderung per Server Action an PaintFix
 * (sendDocsRequest), und PaintFix schickt die Unterlagen per E-Mail. Der Erfolgszustand erscheint
 * erst nach erfolgreichem Versand.
 */
export function DocsForm({ locale, copy: t }: { locale: Locale; copy: DocsCopy }) {
  const id = useId();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [sent, setSent] = useState(false);
  const spamFields = useSpamFields();
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  /** Fokus nur nach einem Wechsel zwischen Formular und Erfolg setzen, nicht beim Laden. */
  const switched = useRef(false);

  useEffect(() => {
    if (!switched.current) return;
    // Erfolgsmeldung nach dem Absenden, erstes Feld nach „Neue Anforderung“.
    if (sent) doneRef.current?.focus();
    else companyRef.current?.focus();
  }, [sent]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = { locale, company, email };
    setSendError(false);
    if (hasErrors(docsRequestErrors(data))) {
      setError(true);
      emailRef.current?.focus();
      return;
    }
    setError(false);
    setSending(true);
    const result: FormResult = await sendDocsRequest(data, spamFields(form)).catch(() => ({
      ok: false,
    }));
    setSending(false);
    if (result.ok) {
      switched.current = true;
      setSent(true);
    } else if (result.errors?.email) {
      setError(true);
      emailRef.current?.focus();
    } else {
      setSendError(true);
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
        <p className="mt-6 border-t border-av-line-on-navy pt-4 text-[14px] leading-[1.6] wrap-anywhere text-av-on-navy">
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
          maxLength={120}
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
          maxLength={200}
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
        {sendError ? <p className="mt-4 text-[13px] text-av-error">{t.docsSendErr}</p> : null}
      </div>
      <Honeypot />
      <AvButton
        type="submit"
        variant="cream"
        aria-disabled={sending || undefined}
        className="mt-7 w-full"
      >
        {t.docsBtn}
      </AvButton>
      <p className="mt-3.5 text-[12px] leading-[1.6] text-av-on-navy-muted">{t.docsNote}</p>
    </form>
  );
}
