import Link from "next/link";

/**
 * Seitenkopf Leistungen (README 8.2 Punkt 1, Referenz Zeilen 265–276): Fläche --car-surface,
 * Brotkrumen „Start / Fahrzeugaufbereitung“, H1 und Einleitung.
 */
export function PageHead() {
  return (
    <section aria-labelledby="page-title" className="bg-car-surface">
      <div className="mx-auto max-w-car px-car-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(56px,7vw,96px)]">
        <nav aria-label="Brotkrumen">
          <ol className="flex flex-wrap gap-2.5 text-[13px] text-car-muted">
            <li>
              <Link href="/" className="hover:text-car-ink">
                Start
              </Link>
            </li>
            <li className="flex gap-2.5">
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-car-ink">
                Fahrzeugaufbereitung
              </span>
            </li>
          </ol>
        </nav>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-7">
          <h1
            id="page-title"
            className="text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] text-balance font-stretch-125%"
          >
            Leistungen und Preise.
          </h1>
          <p className="max-w-[520px] text-[18px] leading-[1.6] text-pretty text-car-text">
            Alle Preise inklusive Mehrwertsteuer für ein Fahrzeug in normalem Zustand. Nach einer
            kurzen Sichtung nennen wir Ihnen den Festpreis. Ohne Ihre Zustimmung wird es nicht
            teurer.
          </p>
        </div>
      </div>
    </section>
  );
}
