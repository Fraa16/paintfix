"use client";

import { LiveDot, useOpenStatus } from "@/components/shared/OpeningStatus";

/**
 * Punkt + Öffnungsstatus als zwei Flex-Kinder, damit sie in der Statuszeile des Hero einzeln
 * umbrechen wie in der Referenz. Bis zum ersten Effekt steht ein unsichtbarer Platzhalter da.
 */
export function HeroOpenStatus() {
  const status = useOpenStatus();
  return (
    <>
      <LiveDot open={status?.open ?? false} />
      <span className={status ? undefined : "invisible"}>
        {status?.text ?? "Heute geöffnet bis 18 Uhr"}
      </span>
    </>
  );
}
