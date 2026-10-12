import { CarOverline } from "@/components/fahrzeug/Overline";
import { ComboOffer } from "./ComboOffer";
import { SectionH2 } from "./SectionH2";

/** Kombi-Band (README 8.2 Punkt 4, Referenz Zeilen 330–343): schwarze Fläche, Komplettpreis. */
export function ComboBand() {
  return (
    <section
      aria-labelledby="kombi-title"
      className="bg-car-ink text-car-on-ink [--focus:var(--car-on-ink)]"
    >
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-16 gap-y-10 px-car-gutter py-[clamp(64px,8vw,112px)]">
        <div>
          <CarOverline tone="onInk" className="leading-[normal]">
            Komplettaufbereitung
          </CarOverline>
          <SectionH2 id="kombi-title" className="max-w-[14ch]">
            Außen und innen an einem Termin.
          </SectionH2>
        </div>
        <ComboOffer />
      </div>
    </section>
  );
}
