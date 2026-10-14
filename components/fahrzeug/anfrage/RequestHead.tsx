import { CarAviationLink } from "@/components/fahrzeug/AviationLink";
import { CarBreadcrumb } from "@/components/fahrzeug/Breadcrumb";

/**
 * Kopf der Anfrageseite (README 8.3 Punkt 1, Referenz Zeilen 370–381): Brotkrumen, H1, Text und
 * Link zu PaintFix Aviation (Navy und Cinzel sind hier als Link zu Aviation erlaubt). Reveal: H1 (60).
 */
export function RequestHead() {
  return (
    <>
      <CarBreadcrumb current="Termin anfragen" />
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-16 gap-y-6">
        <h1
          data-rv="60"
          className="text-car-h1 leading-[0.94] font-bold tracking-[-0.0175em] font-stretch-125%"
        >
          Termin anfragen.
        </h1>
        <div className="flex flex-col gap-4">
          <p className="max-w-[500px] text-[18px] leading-[1.6] text-car-text">
            Sie erhalten innerhalb eines Werktags einen Festpreis und Terminvorschläge. Die Anfrage
            ist unverbindlich.
          </p>
          <CarAviationLink
            prefix="Anfrage für ein Flugzeug?"
            label="Zu PaintFix Aviation"
            className="text-[14px]"
          />
        </div>
      </div>
    </>
  );
}
