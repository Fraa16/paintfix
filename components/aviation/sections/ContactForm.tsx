"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { AvButton } from "@/components/aviation/Button";
import { aviation, type Locale } from "@/content/aviation";
import { cx } from "@/lib/cx";
import {
  aircraftFactor,
  aircraftGroups,
  avServices,
  estimate,
  type AvService,
} from "@/lib/estimate";
import { fieldFocus, fieldNoOutline } from "./form-styles";
import { setAvModel, useAvModel } from "./model-store";

export interface ContactPrefill {
  /** Muster aus ?type=…, sonst "" */
  type: string;
  /** Leistungen, Standard nur Außen; ?svc=ec wählt Außen + Kabine. */
  services: AvService[];
}

export const defaultContactPrefill: ContactPrefill = { type: "", services: [0] };

const OTHER = "other";

type FieldKey =
  "company" | "name" | "email" | "phone" | "typeOther" | "reg" | "apt" | "window" | "notes";

const emptyFields: Record<FieldKey, string> = {
  company: "",
  name: "",
  email: "",
  phone: "",
  typeOther: "",
  reg: "",
  apt: "",
  window: "",
  notes: "",
};

const labelText = "block text-[10px] tracking-[0.26em] text-av-muted uppercase";
const lineField = cx(
  "w-full border-0 border-b border-av-line-input bg-transparent text-[17px] text-av-navy focus:border-av-navy",
  fieldNoOutline,
);

/** Feld Aviation (README 8.0): Label 10px Versalien, 48px hoch, nur Unterkante. 16px darüber als margin (Fokusrahmen, form-styles.ts). */
function Field({
  label,
  className,
  ...input
}: { label: ReactNode } & ComponentPropsWithoutRef<"input">) {
  return (
    <label className={cx("mt-4 block", fieldFocus, className)}>
      <span className={labelText}>{label}</span>
      <input {...input} className={cx(lineField, "h-12 p-0")} />
    </label>
  );
}

/** Chip Aviation (README 8.0): 44px, 1px Navy, gewählt Navy-Fläche mit Creme-Text. */
function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "h-11 border border-av-navy px-[22px] text-[11px] tracking-[0.22em] uppercase",
        pressed ? "bg-av-navy text-av-cream" : "bg-transparent text-av-navy",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Angebotsformular Aviation (README 10.2, Referenz Zeilen 984–1040). Phase 2: vollständige Oberfläche
 * mit Richtwerten aus lib/estimate.ts. Der Danke-Zustand erscheint nur außerhalb der Produktion.
 */
export function ContactForm({
  locale,
  prefill = defaultContactPrefill,
}: {
  locale: Locale;
  prefill?: ContactPrefill;
}) {
  const t = aviation[locale];
  const f = t.f;
  const est = t.est;
  const id = useId();
  const groups = aircraftGroups(locale);

  const [fields, setFields] = useState(emptyFields);
  const [typeSel, setTypeSel] = useState(prefill.type);
  const [services, setServices] = useState<AvService[]>(prefill.services);
  const [sent, setSent] = useState(false);
  const model = useAvModel();
  const thanksRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Nach dem Absenden den Fokus auf den Danke-Titel setzen.
    if (sent) thanksRef.current?.focus();
  }, [sent]);

  const bind = (key: FieldKey) => ({
    value: fields[key],
    onChange: (e: { target: { value: string } }) =>
      setFields((s) => ({ ...s, [key]: e.target.value })),
  });

  const toggleService = (i: AvService) =>
    setServices((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const result = estimate({ locale, type: typeSel, services });
  const estType = aircraftFactor(typeSel, locale) > 0 ? typeSel : "";

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Phase 3: Versand
    if (process.env.NODE_ENV !== "production") setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border border-av-navy p-[clamp(32px,4vw,56px)]">
        <h3
          ref={thanksRef}
          tabIndex={-1}
          className="font-cinzel text-[clamp(32px,3.2vw,51.2px)] leading-none font-normal"
        >
          {t.sentTitle}
        </h3>
        <p className="mt-5 max-w-[420px] text-[17px] leading-[1.7] text-av-muted">{t.sentText}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 h-[52px] border border-av-navy px-7 text-[11px] tracking-[0.24em] text-av-navy uppercase"
        >
          {t.again}
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-2">
        <Field label={f.company} name="company" autoComplete="organization" {...bind("company")} />
        <Field label={f.name} name="name" autoComplete="name" {...bind("name")} />
        <Field label={f.email} name="email" type="email" autoComplete="email" {...bind("email")} />
        <Field label={f.phone} name="phone" type="tel" autoComplete="tel" {...bind("phone")} />
        <label className={cx("mt-4 block", fieldFocus)}>
          <span className={labelText}>{f.type}</span>
          <span className="relative block">
            <select
              name="type"
              value={typeSel}
              onChange={(e) => setTypeSel(e.target.value)}
              className={cx(
                lineField,
                "h-12 cursor-pointer appearance-none rounded-none py-0 pr-7 pl-0",
              )}
            >
              <option value="">{f.typePick}</option>
              {groups.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((it) => (
                    <option key={it.name} value={it.name}>
                      {it.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={OTHER}>{f.typeOther}</option>
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-0.5 -translate-y-1/2 text-[12px]"
            >
              ▾
            </span>
          </span>
        </label>
        {typeSel === OTHER ? (
          <Field
            label={f.typeOther}
            name="typeOther"
            placeholder="Learjet 75"
            {...bind("typeOther")}
          />
        ) : null}
        <Field
          label={f.reg}
          name="reg"
          placeholder="D-B…"
          autoCapitalize="characters"
          {...bind("reg")}
        />
        <Field
          label={f.apt}
          name="apt"
          placeholder="EDDG"
          autoCapitalize="characters"
          maxLength={4}
          {...bind("apt")}
        />
        <Field
          label={f.window}
          name="window"
          placeholder="14.10., 06:00–09:00 UTC"
          {...bind("window")}
        />
      </div>

      <p id={`${id}-svc`} className={cx(labelText, "mt-8")}>
        {f.services}
      </p>
      <div role="group" aria-labelledby={`${id}-svc`} className="mt-3.5 flex flex-wrap gap-2.5">
        {avServices.map((i) => (
          <Chip key={i} pressed={services.includes(i)} onClick={() => toggleService(i)}>
            {t.tabs[i]}
          </Chip>
        ))}
      </div>

      <div aria-live="polite" className="mt-7 bg-av-sand px-[clamp(20px,2.4vw,32px)] py-6">
        <p className="flex flex-wrap justify-between gap-x-4 gap-y-2 text-[10px] tracking-[0.26em] text-av-muted uppercase">
          <span>{est.label}</span>
          {estType ? <span className="text-av-navy">{estType}</span> : null}
        </p>
        {result ? (
          <>
            <ul className="mt-3.5">
              {result.rows.map((r) => (
                <li
                  key={r.service}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-4 border-t border-av-line py-3"
                >
                  <span className="font-cinzel text-[16px] font-normal">{r.label}</span>
                  <span className="text-[14px] tabular-nums">{r.duration}</span>
                  <span className="text-[13px] text-av-muted">{r.crew}</span>
                </li>
              ))}
            </ul>
            <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-av-navy pt-[18px]">
              <span className="text-[10px] tracking-[0.26em] uppercase">{est.ground}</span>
              <span className="font-cinzel text-[clamp(24px,2.24vw,32px)] leading-none font-normal">
                {result.ground}
              </span>
            </p>
            {result.notes.map((n) => (
              <p key={n} className="mt-3 text-[13px] text-av-navy">
                {n}
              </p>
            ))}
          </>
        ) : (
          <p className="mt-3.5 max-w-[460px] text-[14px] leading-[1.6] text-av-muted">
            {est.empty}
          </p>
        )}
        <p className="mt-2 text-[12px] leading-[1.6] text-av-muted">{est.note}</p>
      </div>

      <p id={`${id}-model`} className={cx(labelText, "mt-8")}>
        {f.model}
      </p>
      <div role="group" aria-labelledby={`${id}-model`} className="mt-3.5 flex flex-wrap gap-2.5">
        {t.models.map((m, i) => (
          <Chip key={m.n} pressed={model === i} onClick={() => setAvModel(model === i ? -1 : i)}>
            {m.t}
          </Chip>
        ))}
      </div>

      <label className={cx("mt-6 block", fieldFocus)}>
        <span className={labelText}>{f.notes}</span>
        <textarea
          name="notes"
          rows={3}
          {...bind("notes")}
          className={cx(lineField, "resize-y px-0 py-3 leading-[1.5]")}
        />
      </label>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-[340px] text-[12px] leading-[1.6] text-av-muted">{f.privacy}</p>
        <AvButton type="submit" variant="navy" size="lg">
          {f.send}
        </AvButton>
      </div>
    </form>
  );
}
