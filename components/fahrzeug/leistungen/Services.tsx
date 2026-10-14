import Image from "next/image";
import { CarButton } from "@/components/fahrzeug/Button";
import {
  INSPECT_PRICE,
  inspectServices,
  serviceById,
  type InspectId,
  type ServiceId,
} from "@/content/fahrzeug";
import { altText, media, mediaByRefPath, type MediaId } from "@/content/media";
import { ServicePrice } from "./ServicePrice";

/** Reihenfolge der Seite: Schwerpunkte zuerst (Kundenwunsch 14.10.2026), dann die übrigen Leistungen. */
const ORDER: ReadonlyArray<ServiceId | InspectId> = [
  "smart-repair",
  "politur",
  "leasing",
  "aussen",
  "innen",
  "keramik",
];

interface Entry {
  id: ServiceId | InspectId;
  name: string;
  dur: string;
  desc: string;
  incl: string[];
  img: MediaId;
  /** Preis je Fahrzeugklasse (ServicePrice) oder „nach Begutachtung“. */
  priced: boolean;
}

const entries: Entry[] = ORDER.map((id) => {
  const inspect = inspectServices.find((x) => x.id === id);
  if (inspect) return { ...inspect, img: inspect.media, priced: false };
  const s = serviceById(id as ServiceId);
  return { ...s, img: mediaByRefPath(s.img2), priced: true };
});

const total = String(entries.length).padStart(2, "0");

/**
 * Die Leistungen #svc-{id} (README 8.2 Punkt 3, Referenz Zeilen 294–328): Bild links, Text
 * rechts, unter ca. 1010px untereinander. Nur die Preiszeile ist Client-Komponente. Smart Repair und
 * Leasingrückgabe haben keinen Klassenpreis, sondern „Preis nach Begutachtung“.
 * Anker #svc-… (am Wrapper ohne Reveal) landen über scroll-padding unter Header und Klassenleiste
 * (siehe ClassBar).
 * Reveals wie in der Referenz: jede Leistung und ihre H2 mit Fade-up (0).
 */
export function Services() {
  return (
    <section aria-label="Leistungen" className="bg-car-bg pb-[clamp(64px,8vw,112px)]">
      <div className="mx-auto max-w-car px-car-gutter">
        {entries.map((s, i) => {
          const img = s.img;
          return (
            // Anker am unverschobenen Wrapper: Das Reveal (translate 32px) würde das Sprungziel sonst um
            // 32px unter die Klassenleiste schieben, sobald es abläuft.
            <div key={s.id} id={`svc-${s.id}`}>
              <article
                data-rv="0"
                aria-labelledby={`svc-${s.id}-title`}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-x-[clamp(32px,5vw,88px)] gap-y-8 border-b border-car-line py-[clamp(48px,6vw,88px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-car-image-bg">
                  <Image
                    src={media[img].src}
                    alt={altText(img)}
                    fill
                    sizes="(min-width: 1012px) min(44vw, 590px), 92vw"
                    loading={i === 0 ? "eager" : undefined}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="flex justify-between gap-4 text-[13px] text-car-muted">
                    <span>
                      {String(i + 1).padStart(2, "0")} / {total}
                    </span>
                    <span>Dauer {s.dur}</span>
                  </p>
                  <h2
                    id={`svc-${s.id}-title`}
                    data-rv="0"
                    className="mt-[18px] text-car-h2-service leading-[1.02] font-bold tracking-[-0.015em] font-stretch-125%"
                  >
                    {s.name}
                  </h2>
                  <p className="mt-[18px] max-w-[560px] text-[17px] leading-[1.6] text-pretty text-car-text">
                    {s.desc}
                  </p>
                  <h3 className="mt-7 text-[12px] font-semibold tracking-[0.14em] text-car-muted uppercase">
                    Im Preis enthalten
                  </h3>
                  <ul className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-6">
                    {s.incl.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 border-b border-car-line-soft py-2.5 text-[15px]"
                      >
                        <span
                          aria-hidden="true"
                          className="block h-[1.5px] w-2.5 flex-none -translate-y-1 bg-car-red"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.priced ? (
                    <ServicePrice id={s.id as ServiceId} />
                  ) : (
                    <InspectPrice id={s.id} name={s.name} />
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Preiszeile ohne Klassenpreis: „Preis nach Begutachtung“ und Anfrage mit dieser Leistung. */
function InspectPrice({ id, name }: { id: string; name: string }) {
  return (
    <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-9">
      <div>
        <p className="text-[clamp(26px,2.4vw,34px)] leading-none font-medium tracking-[-0.02em]">
          Preis {INSPECT_PRICE}
        </p>
        <p className="mt-2 text-[13px] text-car-muted">Festpreis vor Beginn der Arbeiten</p>
      </div>
      <CarButton href={`/anfrage?leistungen=${id}`} size="combo" arrow className="leading-[normal]">
        Anfragen<span className="sr-only">: {name}</span>
      </CarButton>
    </div>
  );
}
