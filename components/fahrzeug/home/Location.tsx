import Image from "next/image";
import { CarButton } from "@/components/fahrzeug/Button";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { altText, media } from "@/content/media";
import { site } from "@/content/site";
import { HomeH2 } from "./HomeH2";

const link = "transition-colors hover:text-car-red";

/** Standort (#standort, README 8.1 Punkt 7, Referenz Zeilen 238–260). */
export function Location() {
  const rows = [
    { label: "Adresse", value: `${site.street}, ${site.postalCode} ${site.city}` },
    { label: "Öffnungszeiten", value: site.hoursText },
    {
      label: "Telefon",
      value: (
        <a href={site.phoneHref} className={link}>
          {site.phoneDisplay}
        </a>
      ),
    },
    {
      label: "E-Mail",
      value: (
        <a href={`mailto:${site.email}`} className={link}>
          {site.email}
        </a>
      ),
    },
  ];

  return (
    <section id="standort" className="bg-car-bg py-car-section leading-[normal]">
      <div className="mx-auto grid max-w-car grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-[clamp(40px,6vw,96px)] gap-y-12 px-car-gutter">
        <div>
          <CarOverline className="leading-[normal]">Standort</CarOverline>
          <HomeH2>
            {site.street}, {site.city}.
          </HomeH2>
          <p className="mt-5 max-w-[460px] text-[17px] leading-[1.6] text-car-text">
            Zwischen Münster und Warendorf, mit Parkplätzen direkt an der Halle.
          </p>
          <dl className="mt-10 flex flex-col border-b border-car-border text-[15px]">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[150px_1fr] gap-4 border-t border-car-border py-4"
              >
                <dt className="text-car-muted">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-wrap gap-3">
            <CarButton className="leading-[normal]" href="/anfrage" size="combo" arrow>
              Termin anfragen
            </CarButton>
            <CarButton
              className="leading-[normal]"
              href={site.mapsUrl}
              size="combo"
              variant="secondary"
            >
              Route planen
            </CarButton>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-car-image-bg-alt">
          <Image
            src={media.carStandort.src}
            alt={altText("carStandort")}
            fill
            sizes="(min-width: 1024px) min(46vw, 600px), 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
