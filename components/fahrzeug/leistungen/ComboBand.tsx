import { CarOverline } from "@/components/fahrzeug/Overline";
import { ComboOffer } from "./ComboOffer";
import { CarH2 } from "@/components/fahrzeug/Heading";

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
          <CarH2 id="kombi-title" className="max-w-[14ch]">
            Außen und innen an einem Termin.
          </CarH2>
        </div>
        <ComboOffer />
      </div>
    </section>
  );
}
