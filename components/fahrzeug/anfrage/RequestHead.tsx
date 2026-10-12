import Link from "next/link";

/**
 * Kopf der Anfrageseite (README 8.3 Punkt 1, Referenz Zeilen 370–381): Brotkrumen, H1, Text und
 * Link zu Paintfix Aviation (Navy und Cinzel sind hier als Link zu Aviation erlaubt).
 */
export function RequestHead() {
  return (
    <>
      <nav aria-label="Brotkrümelnavigation">
        <ol className="flex gap-2.5 text-[13px] text-car-muted">
          <li className="flex gap-2.5">
            <Link href="/" className="transition-colors hover:text-car-ink">
              Start
            </Link>
            <span aria-hidden="true">/</span>
          </li>
          <li aria-current="page" className="text-car-ink">
            Termin anfragen
          </li>
        </ol>
      </nav>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-6">
        <h1 className="text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] font-stretch-125%">
          Termin anfragen.
        </h1>
        <div className="flex flex-col gap-4">
          <p className="max-w-[500px] text-[18px] leading-[1.6] text-car-text">
            Sie erhalten innerhalb eines Werktags einen Festpreis und Terminvorschläge. Die Anfrage
            ist unverbindlich.
          </p>
          <Link
            href="/aviation"
            className="flex w-fit items-baseline gap-2 text-[14px] text-av-navy transition-colors hover:text-car-red"
          >
            Anfrage für ein Flugzeug?
            <span className="font-cinzel text-[12.8px] font-normal">Zu Paintfix Aviation</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </>
  );
}
