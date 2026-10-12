import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { altText, media, type MediaId } from "@/content/media";
import { avUi } from "../shell/ui";
import { ServiceTabs, type ServiceTab } from "./ServiceTabs";

/** Bild je Bereich in der Reihenfolge von tabs (Referenz CATIMG). */
const TAB_IMAGES: MediaId[] = ["avExterior", "avCabin", "avProtection"];

/**
 * Leistungen (#av-services, README 8.4 Punkt 4, Referenz Zeilen 689–726) in der Tab-Version auf
 * allen Breiten. Der Horizontal-Scroll ab 980px folgt in Phase 4.
 */
export function Services({ locale }: { locale: Locale }) {
  const av = aviation[locale];
  const tabs: ServiceTab[] = av.tabs.map((label, i) => ({
    label,
    items: av.svc[i],
    image: { src: media[TAB_IMAGES[i]].src, alt: altText(TAB_IMAGES[i], locale) },
  }));
  return (
    <section id="av-services" className="bg-av-sand py-av-section">
      <div className="mx-auto max-w-av px-av-gutter">
        <ServiceTabs
          tabsLabel={avUi[locale].serviceTabs}
          tabs={tabs}
          note={av.svcNote}
          heading={
            <div>
              <AvOverline>{av.svcLabel}</AvOverline>
              <h2 className="mt-7 font-cinzel text-av-h2-services-tabs leading-none font-normal tracking-[0.015em]">
                {av.svcTitle}
              </h2>
            </div>
          }
        />
      </div>
    </section>
  );
}
