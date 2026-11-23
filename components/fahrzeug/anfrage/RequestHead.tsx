import { CarAviationLink } from "@/components/fahrzeug/AviationLink";
import { PageStage } from "@/components/fahrzeug/design/ui";

/**
 * Kopf der Anfrageseite (README 8.3 Punkt 1) auf Schwarz wie die übrigen Seitenköpfe: Brotkrumen,
 * große H1, Einleitung und Link zu PaintFix Aviation (Aviation-Schrift ist hier als Link erlaubt).
 */
export function RequestHead() {
  return (
    <PageStage
      current="Termin anfragen"
      title="Termin anfragen."
      aside={
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-[clamp(40px,6vw,120px)] gap-y-6">
          <p className="max-w-[520px] text-[17px] leading-[1.6] text-pretty text-car-on-ink-soft">
            Wir melden uns innerhalb eines Werktags mit Terminvorschlägen. Den Festpreis nennen wir
            nach einer kostenlosen Begutachtung. Die Anfrage ist unverbindlich.
          </p>
          <CarAviationLink
            tone="onInk"
            prefix="Anfrage für ein Flugzeug?"
            label="Zu PaintFix Aviation"
            className="text-[14px] wide:justify-self-end"
          />
        </div>
      }
    />
  );
}
