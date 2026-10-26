"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CarButton } from "@/components/fahrzeug/Button";
import { focusFirstError, Honeypot, useSpamFields } from "@/components/shared/FormGuard";
import {
  INSPECT_PRICE,
  inspectServices,
  services,
  vehicleClasses,
  type InspectId,
  type ServiceId,
  type VehicleClassIndex,
} from "@/content/fahrzeug";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { sendCarRequest } from "@/lib/forms/actions";
import {
  REQUEST_TIMES,
  carRequestErrors,
  hasErrors,
  type CarRequest,
  type CarRequestField,
  type ErrorCode,
  type FieldErrors,
  type FormResult,
  type TimeIndex,
} from "@/lib/forms/rules";
import { fromPrice } from "@/lib/format";
import { estimatePrice } from "@/lib/pricing";
import {
  CheckMark,
  errorProps,
  FieldError,
  FOCUS_WITHIN,
  HiddenInput,
  LabelText,
  Segment,
  Step,
  StepHeading,
  TextArea,
  TextField,
} from "./controls";
import { defaultPrefill, type RequestPrefill } from "./query";
import { RequestSummary } from "./RequestSummary";
import { RequestThanks } from "./RequestThanks";

/** Fehlertexte je Code (README 10.1: unter dem Feld, Fokus aufs erste fehlerhafte Feld). */
const ERROR_TEXT: Partial<Record<ErrorCode, string>> & { invalid: string } = {
  services: "Bitte wählen Sie mindestens eine Leistung.",
  past: "Bitte wählen Sie ein Datum ab heute.",
  required: "Bitte geben Sie Ihren Namen an.",
  contact: "Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.",
  email: "Bitte prüfen Sie die E-Mail-Adresse.",
  consent: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
  invalid: "Bitte prüfen Sie diese Angabe.",
};

/** Felder mit eigener Fehlermeldung; andere Serverfehler erscheinen als allgemeiner Hinweis. */
const ERROR_FIELDS: readonly CarRequestField[] = [
  "services",
  "date",
  "name",
  "phone",
  "email",
  "consent",
];

/** Fehler eines Felds zurücksetzen, sobald es geändert wird. E-Mail erfüllt auch „Telefon oder E-Mail“. */
const CLEARS: Record<FieldKey, CarRequestField[]> = {
  car: [],
  date: ["date"],
  name: ["name"],
  phone: ["phone"],
  email: ["email", "phone"],
  msg: [],
};

type FieldKey = "car" | "date" | "name" | "phone" | "email" | "msg";
const EMPTY_FIELDS: Record<FieldKey, string> = {
  car: "",
  date: "",
  name: "",
  phone: "",
  email: "",
  msg: "",
};

/**
 * Formular „Termin anfragen“ mit Live-Zusammenfassung und Danke-Zustand (README 8.3, 10.1;
 * Referenz Zeilen 380–493, Logik 1340–1353 und 1442–1522).
 *
 * Versand über die Server Action sendCarRequest (lib/forms/actions.ts). Der Browser prüft vorher
 * dieselben Regeln (lib/forms/rules.ts). Der Danke-Zustand erscheint erst nach erfolgreichem Versand;
 * scheitert er, steht über dem Button ein Hinweis mit Telefonnummer.
 *
 * `pending`: Platzhalter, solange die Vorbelegung aus der URL noch nicht gelesen ist (Suspense-
 * Fallback vor der Hydration). Keine Auswahl markiert, Preise unsichtbar, gleiches Layout. So steht
 * bei einem Link wie /anfrage?leistungen=keramik&klasse=2 nie kurz ein falscher Preis da.
 */
export function RequestForm({
  prefill = defaultPrefill(),
  pending = false,
}: {
  prefill?: RequestPrefill;
  pending?: boolean;
}) {
  const [selected, setSelected] = useState(prefill.services);
  const [inspect, setInspect] = useState(prefill.inspect);
  const [vehicleClass, setVehicleClass] = useState<VehicleClassIndex>(prefill.vehicleClass);
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [time, setTime] = useState<TimeIndex>(2);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<CarRequestField>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const spamFields = useSpamFields();
  const errId = useId();
  /** Nach dem Setzen neuer Fehler das erste fehlerhafte Feld fokussieren (nach dem Rendern). */
  const focusErrors = useRef(false);

  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  /** Erst nach einem Wechsel zwischen Formular und Danke-Zustand Fokus und Scrollposition setzen. */
  const switched = useRef(false);

  useEffect(() => {
    if (!switched.current) return;
    if (submitted) {
      // Ohne `behavior` gilt scroll-behavior aus globals.css: sanft nur ohne reduzierte Bewegung.
      window.scrollTo({ top: 0 });
      thanksRef.current?.focus({ preventScroll: true });
    } else {
      formRef.current?.focus({ preventScroll: true });
    }
  }, [submitted]);

  useEffect(() => {
    if (!focusErrors.current || !formRef.current) return;
    focusErrors.current = false;
    focusFirstError(formRef.current, Object.keys(errors));
  }, [errors]);

  const clearErrors = (...keys: CarRequestField[]) =>
    setErrors((e) => {
      if (!keys.some((k) => e[k])) return e;
      const next = { ...e };
      for (const k of keys) delete next[k];
      return next;
    });
  const errorText = (key: CarRequestField) => {
    const code = errors[key];
    return code ? (ERROR_TEXT[code] ?? ERROR_TEXT.invalid) : undefined;
  };

  const estimate = estimatePrice(selected, vehicleClass);
  const classLabel = vehicleClasses[vehicleClass].label;

  const field = (key: FieldKey) => ({
    value: fields[key],
    onChange: (e: { target: { value: string } }) => {
      setFields((f) => ({ ...f, [key]: e.target.value }));
      clearErrors(...CLEARS[key]);
    },
  });

  const toggleService = (id: ServiceId) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    clearErrors("services");
  };
  const toggleInspect = (id: InspectId) => {
    setInspect((s) => ({ ...s, [id]: !s[id] }));
    clearErrors("services");
  };
  /** Gewählte Leistungen mit Preis nach Begutachtung (Smart Repair, Leasingrückgabe). */
  const inspectNames = pending
    ? []
    : inspectServices.filter((s) => inspect[s.id]).map((s) => s.name);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending || sending) return;
    const form = e.currentTarget;
    const data: CarRequest = {
      services: services.filter((s) => selected[s.id]).map((s) => s.id),
      inspect: inspectServices.filter((s) => inspect[s.id]).map((s) => s.id),
      vehicleClass,
      car: fields.car,
      date: fields.date,
      time,
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      message: fields.msg,
      consent,
    };
    setSendError(false);
    const found = carRequestErrors(data);
    if (hasErrors(found)) {
      focusErrors.current = true;
      setErrors(found);
      return;
    }

    setSending(true);
    const result: FormResult = await sendCarRequest(data, spamFields(form)).catch(() => ({
      ok: false,
    }));
    setSending(false);
    if (result.ok) {
      setErrors({});
      switched.current = true;
      setSubmitted(true);
      return;
    }
    const known = Object.fromEntries(
      Object.entries(result.errors ?? {}).filter(([k]) =>
        ERROR_FIELDS.includes(k as CarRequestField),
      ),
    ) as FieldErrors<CarRequestField>;
    if (hasErrors(known)) {
      focusErrors.current = true;
      setErrors(known);
    } else {
      setSendError(true);
    }
  };

  const onEdit = () => {
    switched.current = true;
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <RequestThanks
        firstName={fields.name.trim().split(/\s+/)[0]}
        estimate={estimate}
        inspect={inspectNames}
        classLabel={classLabel}
        onEdit={onEdit}
        headingRef={thanksRef}
      />
    );
  }

  return (
    <div className="mt-[clamp(48px,6vw,72px)] flex flex-wrap items-start gap-8">
      <form
        ref={formRef}
        tabIndex={-1}
        noValidate
        onSubmit={onSubmit}
        aria-label="Termin anfragen"
        className="min-w-0 flex-[1_1_560px] border border-car-line bg-car-bg focus:outline-none"
      >
        <Step>
          <StepHeading no="01" id="anfrage-leistungen">
            Leistungen
          </StepHeading>
          <div
            role="group"
            aria-labelledby="anfrage-leistungen"
            className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-3"
          >
            {services.map((s, i) => {
              const on = !pending && selected[s.id];
              return (
                <label
                  key={s.id}
                  className={cx(
                    "relative flex cursor-pointer items-start gap-3.5 border-[1.5px] bg-car-bg p-[18px] text-left hover:border-car-ink",
                    on ? "border-car-ink" : "border-car-line",
                    FOCUS_WITHIN,
                  )}
                >
                  <HiddenInput
                    type="checkbox"
                    name="leistungen"
                    value={s.id}
                    checked={on}
                    onChange={() => toggleService(s.id)}
                    data-field={i === 0 ? "services" : undefined}
                    {...errorProps(errors.services, `${errId}-services`)}
                  />
                  <CheckMark checked={on} className="mt-px" />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-[16px] font-semibold">{s.name}</span>
                    <span className="text-[13px] text-car-muted">{s.dur}</span>
                  </span>
                  <span
                    className={cx(
                      "text-[15px] font-semibold whitespace-nowrap tabular-nums",
                      pending && "invisible",
                    )}
                  >
                    {fromPrice(s.p[vehicleClass])}
                  </span>
                </label>
              );
            })}
            {inspectServices.map((s) => {
              const on = !pending && inspect[s.id];
              return (
                <label
                  key={s.id}
                  className={cx(
                    "relative flex cursor-pointer items-start gap-3.5 border-[1.5px] bg-car-bg p-[18px] text-left hover:border-car-ink",
                    on ? "border-car-ink" : "border-car-line",
                    FOCUS_WITHIN,
                  )}
                >
                  <HiddenInput
                    type="checkbox"
                    name="leistungen"
                    value={s.id}
                    checked={on}
                    onChange={() => toggleInspect(s.id)}
                    {...errorProps(errors.services, `${errId}-services`)}
                  />
                  <CheckMark checked={on} className="mt-px" />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-[16px] font-semibold">{s.name}</span>
                    <span className="text-[13px] text-car-muted">Preis {INSPECT_PRICE}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.services ? (
            <FieldError id={`${errId}-services`}>{errorText("services")}</FieldError>
          ) : null}
        </Step>

        <Step>
          <StepHeading no="02" id="anfrage-fahrzeug">
            Fahrzeug
          </StepHeading>
          <Segment
            name="klasse"
            value={(pending ? -1 : vehicleClass) as VehicleClassIndex}
            onChange={setVehicleClass}
            labelledBy="anfrage-fahrzeug"
            className="mt-6"
            optionClassName="flex flex-col items-start gap-0.5 px-4 py-3.5 text-left"
            options={vehicleClasses.map((c, i) => ({
              value: i as VehicleClassIndex,
              content: (
                <>
                  <span className="text-[15px] font-semibold">{c.label}</span>
                  <span className="text-[12px] opacity-75">{c.ex}</span>
                </>
              ),
            }))}
          />
          <TextField
            label="Marke und Modell"
            className="mt-5"
            name="fahrzeug"
            placeholder="z. B. VW Golf Variant, 2021"
            maxLength={120}
            {...field("car")}
          />
        </Step>

        <Step>
          <StepHeading no="03" id="anfrage-termin">
            Wunschtermin
          </StepHeading>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
            <TextField
              label="Datum"
              type="date"
              name="datum"
              data-field="date"
              error={errorText("date")}
              {...field("date")}
            />
            <div>
              <LabelText id="anfrage-abgabe">Abgabe</LabelText>
              <Segment
                name="abgabe"
                value={time}
                onChange={setTime}
                labelledBy="anfrage-abgabe"
                optionClassName="flex h-[54px] items-center px-1.5 text-[14px] font-semibold"
                options={REQUEST_TIMES.map((label, i) => ({
                  value: i as TimeIndex,
                  // Zentriert wie ein Button: zu langer Text läuft nach rechts über, nicht zu beiden Seiten.
                  content: <span className="w-full text-center">{label}</span>,
                }))}
              />
            </div>
          </div>
        </Step>

        <Step last>
          <StepHeading no="04" id="anfrage-kontakt">
            Kontakt
          </StepHeading>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
            <TextField
              label="Name"
              name="name"
              autoComplete="name"
              placeholder="Vor- und Nachname"
              maxLength={100}
              data-field="name"
              error={errorText("name")}
              {...field("name")}
            />
            <TextField
              label="Telefon"
              type="tel"
              name="telefon"
              autoComplete="tel"
              placeholder="Für Rückfragen"
              maxLength={40}
              data-field="phone"
              error={errorText("phone")}
              {...field("phone")}
            />
          </div>
          <TextField
            label="E-Mail"
            className="mt-4"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@beispiel.de"
            maxLength={200}
            data-field="email"
            error={errorText("email")}
            {...field("email")}
          />
          <TextArea
            label={
              <>
                Nachricht <span className="font-normal text-car-muted">(optional)</span>
              </>
            }
            className="mt-4"
            name="nachricht"
            rows={4}
            placeholder="Besonderheiten, z. B. Tierhaare oder Kratzer an der Fahrertür"
            maxLength={3000}
            {...field("msg")}
          />
          <label
            className={cx(
              "relative mt-6 flex w-fit cursor-pointer items-start gap-3.5 text-left text-[14px] leading-[1.5] text-car-text",
              FOCUS_WITHIN,
            )}
          >
            <HiddenInput
              type="checkbox"
              name="einwilligung"
              checked={consent}
              onChange={() => {
                setConsent((c) => !c);
                clearErrors("consent");
              }}
              data-field="consent"
              {...errorProps(errors.consent, `${errId}-consent`)}
            />
            <CheckMark checked={consent} />
            Ich bin einverstanden, dass PaintFix meine Angaben zur Bearbeitung der Anfrage
            verwendet.
          </label>
          {errors.consent ? (
            <FieldError id={`${errId}-consent`}>{errorText("consent")}</FieldError>
          ) : null}
          <Honeypot />
          <div aria-live="polite">
            {sendError ? (
              <p className="mt-6 max-w-[520px] text-[14px] leading-[1.5] text-car-red">
                Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es noch einmal
                oder rufen Sie uns an:{" "}
                <a href={site.phoneHref} className="font-semibold whitespace-nowrap underline">
                  {site.phoneDisplay}
                </a>
              </p>
            ) : null}
          </div>
          <CarButton
            type="submit"
            size="submit"
            arrow={!sending}
            aria-disabled={sending || undefined}
            className="mt-8"
          >
            {sending ? "Wird gesendet …" : "Anfrage senden"}
          </CarButton>
        </Step>
      </form>

      <RequestSummary
        estimate={estimate}
        inspect={inspectNames}
        classLabel={classLabel}
        pending={pending}
      />
    </div>
  );
}
