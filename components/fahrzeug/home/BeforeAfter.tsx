import { CarOverline } from "@/components/fahrzeug/Overline";
import { serviceById } from "@/content/fahrzeug";
import { fromPrice } from "@/lib/format";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { CarH2 } from "@/components/fahrzeug/Heading";

/**
 * Vorher/Nachher (README 8.1 Punkt 4, Referenz Zeilen 163–187). Reveals wie in der Referenz:
 * Overline 0, H2 80, Text 160, Regler 120 (data-rv im Regler selbst).
 */
export function BeforeAfter() {
  const politur = serviceById("politur");
  return (
    <section className="bg-car-bg py-car-section leading-[normal]">
      <div className="mx-auto max-w-car px-car-gutter">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-6">
          <div>
            <CarOverline rv={0} className="leading-[normal]">
              {politur.name}, vorher und nachher
            </CarOverline>
            <CarH2 rv={80}>Derselbe Lack, einen Tag später.</CarH2>
          </div>
          <p
            data-rv="160"
            className="max-w-[520px] text-[17px] leading-[1.6] text-pretty text-car-text"
          >
            Waschanlagen hinterlassen feine Kratzer, in denen sich das Licht kreisförmig bricht. Die
            Maschinenpolitur trägt sie ab und gibt dem Lack seine Tiefe zurück. Ziehen Sie den
            Regler.
          </p>
        </div>
        <BeforeAfterSlider />
        <div className="mt-[18px] flex flex-wrap justify-between gap-x-8 gap-y-2.5 text-[13px] text-car-muted">
          {/* KI-Fotopaar, siehe media.ts: als Symbolbild gekennzeichnet (UWG § 5, KI-Verordnung Art. 50). */}
          <span>
            {politur.name}, {politur.dur}. Symbolbild, KI-generiert.
          </span>
          <span>
            {politur.name} {fromPrice(politur.p[0])}
          </span>
        </div>
      </div>
    </section>
  );
}
