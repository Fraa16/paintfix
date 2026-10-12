import Image from "next/image";
import { services } from "@/content/fahrzeug";
import { altText, media, mediaByRefPath } from "@/content/media";
import { ServicePrice } from "./ServicePrice";

const total = String(services.length).padStart(2, "0");

/**
 * Die vier Leistungen #svc-{id} (README 8.2 Punkt 3, Referenz Zeilen 294–328): Bild links, Text
 * rechts, unter ca. 1010px untereinander. Nur die Preiszeile ist Client-Komponente.
 *
 * scroll-margin-top = Höhe der Klassenleiste (gemessen, sonst Schätzwert), damit /leistungen#svc-…
 * unter Header (scroll-padding-top) und Klassenleiste landet.
 */
export function Services() {
  return (
    <section aria-label="Leistungen" className="bg-car-bg pb-[clamp(64px,8vw,112px)]">
      <div className="mx-auto max-w-car px-car-gutter">
        {services.map((s, i) => {
          const img = mediaByRefPath(s.img2);
          return (
            <article
              key={s.id}
              id={`svc-${s.id}`}
              aria-labelledby={`svc-${s.id}-title`}
              className="grid scroll-mt-[var(--pf-bar-h,135px)] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-x-[clamp(32px,5vw,88px)] gap-y-8 border-b border-car-line py-[clamp(48px,6vw,88px)] wide:scroll-mt-[var(--pf-bar-h,75px)]"
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
                    {s.no} / {total}
                  </span>
                  <span>Dauer {s.dur}</span>
                </p>
                <h2
                  id={`svc-${s.id}-title`}
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
                <ServicePrice id={s.id} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
