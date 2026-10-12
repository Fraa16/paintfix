"use client";

import { AvTextLink } from "@/components/aviation/Button";
import { setAvModel } from "./model-store";

/**
 * „Anfragen“ je Modell: wählt das Modell in den Formular-Chips vor und springt zu #av-contact
 * (Referenz onAsk, Zeile 1428). Der Anker scrollt mit scroll-padding-top 84px.
 * variant="link": Textlink in der Tabelle (ab 980px); variant="button": Navy-Button in den Karten.
 */
export function TermsCta({
  index,
  label,
  modelTitle,
  variant,
}: {
  index: number;
  label: string;
  modelTitle: string;
  variant: "link" | "button";
}) {
  const props = {
    href: "#av-contact",
    "aria-label": `${label}: ${modelTitle}`,
    onClick: () => setAvModel(index),
  };

  if (variant === "link") {
    return (
      <AvTextLink {...props} className="text-av-navy">
        {label}
      </AvTextLink>
    );
  }
  return (
    <a
      {...props}
      className="inline-flex h-11 flex-none items-center bg-av-navy px-[18px] text-[11px] tracking-[0.22em] whitespace-nowrap text-av-cream uppercase transition-colors hover:bg-av-navy-button-hover"
    >
      {label}
    </a>
  );
}
