import Image from "next/image";
import { CarButton, CarTextLink } from "@/components/fahrzeug/Button";
import {
  INSPECT_PRICE,
  inspectServices,
  serviceById,
  type InspectId,
  type ServiceId,
} from "@/content/fahrzeug";
import { focusHref } from "@/content/leistungen";
import { altText, media, mediaByRefPath, type MediaId } from "@/content/media";
import { cx } from "@/lib/cx";
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

export interface ServiceEntryData {
  id: ServiceId | InspectId;
  name: string;
  dur: string;
  desc: string;
  incl: string[];
  img: MediaId;
  /** Preis je Fahrzeugklasse (ServicePrice) oder „nach Begutachtung“. */
  priced: boolean;
}

/** Umfang, Bild und Preisart einer Leistung aus fahrzeug.json (services oder inspect). */
export function serviceEntry(id: ServiceId | InspectId): ServiceEntryData {
  const inspect = inspectServices.find((x) => x.id === id);
  if (inspect) return { ...inspect, img: inspect.media, priced: false };
  const s = serviceById(id as ServiceId);
  return { ...s, img: mediaByRefPath(s.img2), priced: true };
}

const entries = ORDER.map(serviceEntry);

/** Reihenfolge und Daten der Leistungen auf /leistungen (auch für das Verzeichnis im Seitenkopf). */
export const overviewEntries: ReadonlyArray<ServiceEntryData> = entries;
const total = String(entries.length).padStart(2, "0");

/**
 * Die Leistungen #svc-{id} (README 8.2 Punkt 3). Nur die Preiszeile ist Client-Komponente. Smart Repair
 * und Leasingrückgabe haben keinen Klassenpreis, sondern „Preis nach Begutachtung“.
 * KONZEPT: editoriale Zeilen, Bild abwechselnd links und rechts (7 von 12 Spalten).
 */
export function Services() {
  return (
    <section aria-label="Leistungen" className="bg-car-bg pb-[clamp(64px,8vw,112px)]">
      <div className="mx-auto max-w-car px-car-gutter">
        {entries.map((s, i) => (
          <ServiceEntry
            key={s.id}
            entry={s}
            anchor={`svc-${s.id}`}
            counter={`${String(i + 1).padStart(2, "0")} / ${total}`}
            eager={i === 0}
            more={focusHref(s.id)}
            flip={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

const mono = "font-mono text-[11px] leading-[1.4] tracking-[0.06em] uppercase";

/**
 * Eine Leistung als Artikel. Auch auf den Seiten je Leistung (/leistungen/…), dort optional mit
 * eigener Überschrift (`title`, z. B. „Umfang und Preis“, wenn der Name schon die H1 ist).
 * `more` verlinkt die eigene Seite der Leistung, sofern es sie gibt; `flip` setzt das Bild nach rechts.
 * Anker (#svc-… auf /leistungen) am unverschobenen Wrapper: Das Reveal (translate 32px) würde das
 * Sprungziel sonst um 32px unter die Klassenleiste schieben, sobald es abläuft. Sie landen über
 * scroll-padding unter Header und Klassenleiste (siehe ClassBar).
 */
export function ServiceEntry({
  entry: s,
  anchor,
  counter,
  title,
  eager = false,
  more,
  caption,
  flip = false,
}: {
  entry: ServiceEntryData;
  anchor: string;
  counter?: string;
  title?: string;
  eager?: boolean;
  more?: string;
  /** Bildunterschrift, z. B. „Symbolbild, KI-generiert“ (UWG § 5). */
  caption?: string;
  flip?: boolean;
}) {
  const img = s.img;
  const titleId = `${anchor}-title`;
  // Nur Links auf eine eigene Seite (/leistungen/…), nicht auf Anker dieser Seite.
  const showMore = more?.startsWith("/leistungen/");
  return (
    <div id={anchor}>
      <article
        data-rv="0"
        aria-labelledby={titleId}
        className="grid gap-x-[clamp(32px,5vw,96px)] gap-y-8 border-t border-car-ink py-[clamp(48px,6vw,96px)] wide:grid-cols-12"
      >
        <figure className={cx("flex flex-col gap-3 wide:col-span-7", flip && "wide:order-2")}>
          <div className="relative aspect-[4/3] overflow-hidden bg-car-ba-bg">
            <Image
              src={media[img].src}
              alt={altText(img)}
              fill
              sizes="(min-width: 980px) min(54vw, 760px), 92vw"
              loading={eager ? "eager" : undefined}
              className="object-cover"
            />
          </div>
          {caption && <figcaption className={cx(mono, "text-car-muted")}>{caption}</figcaption>}
        </figure>
        <div className="flex flex-col wide:col-span-5">
          <p className={cx(mono, "flex justify-between gap-4 text-car-muted")}>
            <span>{counter}</span>
            <span>Dauer {s.dur}</span>
          </p>
          <h2
            id={titleId}
            data-rv="0"
            className="mt-6 text-[clamp(32px,3.6vw,58px)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance"
          >
            {title ?? s.name}
          </h2>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.6] text-pretty text-car-text">
            {s.desc}
          </p>
          <h3 className={cx(mono, "mt-8 text-car-muted")}>Im Preis enthalten</h3>
          <ul className="mt-3 border-t border-car-line">
            {s.incl.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-3 border-b border-car-line-soft py-2.5 text-[15px]"
              >
                <span
                  aria-hidden="true"
                  className="block size-1.5 flex-none -translate-y-0.5 bg-car-ink"
                />
                {item}
              </li>
            ))}
          </ul>
          {more && showMore && (
            <CarTextLink href={more} className="mt-7">
              Mehr erfahren<span className="sr-only">: {s.name}</span>
            </CarTextLink>
          )}
          {s.priced ? (
            <ServicePrice id={s.id as ServiceId} />
          ) : (
            <InspectPrice id={s.id} name={s.name} />
          )}
        </div>
      </article>
    </div>
  );
}

/** Preiszeile ohne Klassenpreis: „Preis nach Begutachtung“ und Anfrage mit dieser Leistung. */
function InspectPrice({ id, name }: { id: string; name: string }) {
  return (
    <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-10">
      <div>
        <p className="text-[clamp(26px,2.4vw,36px)] leading-none font-semibold tracking-[-0.03em]">
          Preis {INSPECT_PRICE}
        </p>
        <p className={cx(mono, "mt-3 text-car-muted")}>Festpreis vor Beginn der Arbeiten</p>
      </div>
      <CarButton href={`/anfrage?leistungen=${id}`} size="combo" arrow className="leading-[normal]">
        Anfragen<span className="sr-only">: {name}</span>
      </CarButton>
    </div>
  );
}
