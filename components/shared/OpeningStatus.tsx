"use client";

import { useEffect, useState } from "react";
import { openStatus, type OpenStatus } from "@/lib/opening-hours";
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

/** Punkt + Text, z. B. „Heute geöffnet bis 18 Uhr“. */
export function OpeningStatus({ className }: { className?: string }) {
  const status = useOpenStatus();
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LiveDot open={status?.open ?? false} />
      {/* Platzhalter mit ähnlicher Breite, damit die Zeile beim Laden nicht springt. */}
      <span className={status ? undefined : "invisible"}>
        {status?.text ?? "Heute geöffnet bis 18 Uhr"}
      </span>
    </span>
  );
}
