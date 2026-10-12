"use client";

import { useEffect, useState } from "react";
import { openStatus, openStatusPlaceholder, type OpenStatus } from "@/lib/opening-hours";
import { cx } from "@/lib/cx";

/** Live-Status-Punkt: grün und pulsierend, wenn geöffnet (README 9.9). */
export function LiveDot({ open, className }: { open: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "block size-2 flex-none rounded-full",
        open
          ? "bg-car-open motion-safe:animate-[pf-dot_2.4s_ease-in-out_infinite]"
          : "bg-car-closed",
        className,
      )}
    />
  );
}

/** Aktueller Status in Europe/Berlin, minütlich aktualisiert. Vor dem Laden unsichtbarer Platzhalter. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(openStatus(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
}

/**
 * Punkt + Text, z. B. „Heute geöffnet bis 18 Uhr“, als zwei Geschwister ohne eigenen Wrapper, damit sie
 * in der umgebenden Zeile einzeln umbrechen können (Hero-Statuszeile wie in der Referenz).
 */
export function OpeningStatus() {
  const status = useOpenStatus();
  return (
    <>
      <LiveDot open={status?.open ?? false} className={status ? undefined : "invisible"} />
      <span className={status ? undefined : "invisible"}>
        {status?.text ?? openStatusPlaceholder}
      </span>
    </>
  );
}
