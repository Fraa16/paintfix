import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Bausteine des Anfrageformulars (README 8.0 „Inputs Fahrzeug“, „Segment-Steuerung Fahrzeug“,
 * Referenz Zeilen 383–466). Checkboxen und Radios sind echte <input>-Elemente, nur visuell versteckt;
 * das umschließende <label> zeigt ihren Fokus.
 */

/** Fokusrahmen am <label>, wenn das versteckte Eingabeelement den Tastaturfokus hat. */
export const FOCUS_WITHIN =
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-car-ink";

/** Kopf eines Schritts: Nummer 13px + H2 20.6px (Mona Sans 700, Breite 125 %), H2 mit Reveal (0). */
export function StepHeading({ no, id, children }: { no: string; id: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-3.5">
      <span aria-hidden="true" className="text-[13px] text-car-muted">
        {no}
      </span>
      <h2
        id={id}
        data-rv="0"
        className="text-car-step-title font-bold tracking-[-0.005em] font-stretch-125%"
      >
        {children}
      </h2>
    </div>
  );
}

/** Ein Schritt der Formularkarte mit Trenner unten (außer dem letzten). */
export function Step({ last = false, children }: { last?: boolean; children: ReactNode }) {
  return (
    <div className={cx("p-[clamp(24px,3.5vw,44px)]", !last && "border-b border-car-line-soft")}>
      {children}
    </div>
  );
}

/** Feldbeschriftung 13px 600, 8px über dem Feld. */
export function LabelText({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <span id={id} className="mb-2 block text-[13px] font-semibold">
      {children}
    </span>
  );
}

const fieldClass = "w-full border bg-car-bg text-[16px] focus:border-car-ink";

/** Fehler unter dem Feld (README 10.1): 13px, Signalrot (5,3:1 auf Weiß). */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-[13px] leading-[1.4] text-car-red">
      {children}
    </p>
  );
}

/** Attribute für ein Feld mit Fehler: aria-invalid und Verweis auf die Fehlermeldung. */
export function errorProps(error: ReactNode | undefined, id: string) {
  return error ? { "aria-invalid": true, "aria-describedby": id } : {};
}

/** Textfeld 56px mit Label darüber, Fehlermeldung darunter (außerhalb des Labels). */
export function TextField({
  label,
  className,
  error,
  ...input
}: { label: ReactNode; error?: ReactNode } & ComponentPropsWithoutRef<"input">) {
  const errId = useId();
  return (
    <div className={className}>
      <label className="block">
        <LabelText>{label}</LabelText>
        <input
          {...input}
          {...errorProps(error, errId)}
          className={cx(fieldClass, "h-14 px-4", error ? "border-car-red" : "border-car-border")}
        />
      </label>
      {error ? <FieldError id={errId}>{error}</FieldError> : null}
    </div>
  );
}

/** Mehrzeiliges Feld, Höhe veränderbar. */
export function TextArea({
  label,
  className,
  ...textarea
}: { label: ReactNode } & ComponentPropsWithoutRef<"textarea">) {
  return (
    <label className={cx("block", className)}>
      <LabelText>{label}</LabelText>
      <textarea
        {...textarea}
        className={cx(fieldClass, "resize-y border-car-border p-4 leading-[1.5]")}
      />
    </label>
  );
}

/** Kästchen 22×22px, 1.5px Rahmen, gewählt schwarz mit weißem ✓. Rein visuell. */
export function CheckMark({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex size-[22px] flex-none items-center justify-center border-[1.5px] border-car-ink text-[13px] leading-none text-car-bg",
        checked ? "bg-car-ink" : "bg-car-bg",
        className,
      )}
    >
      {checked && "✓"}
    </span>
  );
}

/** Versteckte, aber fokussier- und ansagbare Checkbox bzw. Radio. */
export function HiddenInput(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className="sr-only" />;
}

/**
 * Segment-Steuerung als Radiogruppe: Gruppe mit 1px Rahmen --car-border, gewähltes Segment
 * --car-ink mit weißem Text. Pfeiltasten wechseln die Auswahl (natives Radio-Verhalten).
 */
export function Segment<T extends string | number>({
  name,
  value,
  options,
  onChange,
  labelledBy,
  className,
  optionClassName,
}: {
  name: string;
  value: T;
  options: ReadonlyArray<{ value: T; content: ReactNode }>;
  onChange: (value: T) => void;
  labelledBy: string;
  className?: string;
  optionClassName?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className={cx("grid grid-cols-3 border border-car-border", className)}
    >
      {options.map((option) => {
        const on = option.value === value;
        return (
          <label
            key={option.value}
            className={cx(
              "relative cursor-pointer has-focus-visible:z-10",
              FOCUS_WITHIN,
              on ? "bg-car-ink text-car-bg" : "bg-transparent text-car-ink",
              optionClassName,
            )}
          >
            <HiddenInput
              type="radio"
              name={name}
              value={option.value}
              checked={on}
              onChange={() => onChange(option.value)}
            />
            {option.content}
          </label>
        );
      })}
    </div>
  );
}
