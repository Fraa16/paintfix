"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CarButton } from "@/components/fahrzeug/Button";
import {
  INSPECT_PRICE,
  inspectServices,
  services,
  vehicleClasses,
  type InspectId,
  type ServiceId,
  type VehicleClassIndex,
} from "@/content/fahrzeug";
import { cx } from "@/lib/cx";
import { fromPrice } from "@/lib/format";
import { estimatePrice } from "@/lib/pricing";
import {
  CheckMark,
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

/** Abgabe-Zeitfenster (Referenz `times`), Standard: Flexibel. */
const TIMES = ["Vormittag", "Nachmittag", "Flexibel"] as const;
type TimeIndex = 0 | 1 | 2;

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
 * Phase 2: vollständige Oberfläche ohne Versand. Der Danke-Zustand erscheint nur in der
 * Entwicklung, damit eine Vorschau nie einen erfolgreichen Versand vortäuscht.
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

  const estimate = estimatePrice(selected, vehicleClass);
  const classLabel = vehicleClasses[vehicleClass].label;

  const field = (key: FieldKey) => ({
    value: fields[key],
    onChange: (e: { target: { value: string } }) =>
      setFields((f) => ({ ...f, [key]: e.target.value })),
  });

  const toggleService = (id: ServiceId) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const toggleInspect = (id: InspectId) => setInspect((s) => ({ ...s, [id]: !s[id] }));
  /** Gewählte Leistungen mit Preis nach Begutachtung (Smart Repair, Leasingrückgabe). */
  const inspectNames = pending
    ? []
    : inspectServices.filter((s) => inspect[s.id]).map((s) => s.name);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Phase 3: Versand
    if (process.env.NODE_ENV !== "production") {
      switched.current = true;
      setSubmitted(true);
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
            {services.map((s) => {
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
            {...field("car")}
          />
        </Step>

        <Step>
          <StepHeading no="03" id="anfrage-termin">
            Wunschtermin
          </StepHeading>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
            <TextField label="Datum" type="date" name="datum" {...field("date")} />
            <div>
              <LabelText id="anfrage-abgabe">Abgabe</LabelText>
              <Segment
                name="abgabe"
                value={time}
                onChange={setTime}
                labelledBy="anfrage-abgabe"
                optionClassName="flex h-[54px] items-center px-1.5 text-[14px] font-semibold"
                options={TIMES.map((label, i) => ({
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
              {...field("name")}
            />
            <TextField
              label="Telefon"
              type="tel"
              name="telefon"
              autoComplete="tel"
              placeholder="Für Rückfragen"
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
              onChange={() => setConsent((c) => !c)}
            />
            <CheckMark checked={consent} />
            Ich bin einverstanden, dass Paintfix meine Angaben zur Bearbeitung der Anfrage
            verwendet.
          </label>
          <CarButton type="submit" size="submit" arrow className="mt-8">
            Anfrage senden
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
