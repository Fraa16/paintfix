import Image from "next/image";
import { AvOverline } from "@/components/aviation/Overline";
import { aviation, type Locale } from "@/content/aviation";
import { altText, media, type MediaId } from "@/content/media";
import { HorizontalScene } from "./Scenes";

/**
 * Leistungen als Horizontal-Scroll (README 8.4 Punkt 4, Referenz Zeilen 647–688), nur ab 980px mit
 * Bewegung (ServicesSwitch). Intro-Panel clamp(440px,38vw,640px) mit Hinweis „Weiter scrollen“, dann
 * drei Kategorie-Panels min(1160px,84vw): Bild mit großer Ziffer, Kategorie, „0i / 03“, Liste.
 */
export function ServicesHorizontal({ locale, images }: { locale: Locale; images: MediaId[] }) {
  const av = aviation[locale];
  const count = String(av.tabs.length).padStart(2, "0");
  return (
    <HorizontalScene id="av-services" className="relative min-h-screen bg-av-sand">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div data-hs-track="" className="absolute top-0 left-0 flex h-full w-max">
          <div className="flex h-full w-[clamp(440px,38vw,640px)] flex-none flex-col justify-between pt-[calc(var(--av-header-h)+9vh)] pr-[clamp(32px,4vw,72px)] pb-[9vh] pl-av-gutter">
            <div>
              <div data-rv="0">
                <AvOverline>{av.svcLabel}</AvOverline>
              </div>
              <h2
                data-rv="80"
                className="mt-7 font-cinzel text-av-h2-services leading-none font-normal tracking-[0.015em]"
              >
                {av.svcTitle}
              </h2>
              <p data-rv="160" className="mt-7 max-w-[380px] text-base leading-[1.7] text-av-muted">
                {av.svcNote}
              </p>
            </div>
            <p className="flex items-center gap-4 text-[10px] tracking-[0.32em] text-av-muted uppercase">
              <span>{av.hsHint}</span>
              <span aria-hidden="true" className="block h-px w-[72px] bg-av-gold-line" />
              <span aria-hidden="true">→</span>
            </p>
          </div>

          {av.tabs.map((label, i) => {
            const no = String(i + 1).padStart(2, "0");
            const img = media[images[i]].src;
            return (
              <div
                key={label}
                className="grid h-full w-[min(1160px,84vw)] flex-none grid-cols-2 gap-[clamp(28px,3.5vw,64px)] border-l border-av-line px-[clamp(28px,3.5vw,64px)] pt-[calc(var(--av-header-h)+6vh)] pb-[6vh]"
              >
                <div className="relative overflow-hidden bg-av-image-bg">
                  <Image
                    src={img}
                    alt={altText(images[i], locale)}
                    fill
                    // Spalte ca. 36vw breit (max. 505px), Höhe 88vh − 84px, Bild füllt per cover.
                    sizes={`max(min(37vw, 505px), calc((88vh - 84px) * ${(img.width / img.height).toFixed(2)}))`}
                    className="object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 left-6 font-cinzel text-[clamp(57.6px,5.6vw,102.4px)] leading-none font-normal text-av-cream [text-shadow:0_2px_24px_color-mix(in_srgb,var(--av-navy)_35%,transparent)]"
                  >
                    {no}
                  </span>
                </div>
                <div className="flex min-h-0 flex-col justify-between">
                  <div className="flex items-baseline justify-between gap-4 border-b border-av-navy pb-5">
                    <h3 className="font-cinzel text-av-cat-title leading-none font-normal">
                      {label}
                    </h3>
                    <span className="text-[10px] tracking-[0.3em] text-av-muted tabular-nums">
                      {no} / {count}
                    </span>
                  </div>
                  <ul>
                    {av.svc[i].map((x, j) => (
                      <li
                        key={x.t}
                        className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-av-navy/16 py-[clamp(12px,2vh,22px)]"
                      >
                        <span className="pt-1.5 font-cinzel text-[11.2px] font-normal text-av-gold-text">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="font-cinzel text-av-item-title leading-[1.2] font-normal">
                            {x.t}
                          </h4>
                          <p className="mt-1.5 max-w-[440px] text-sm leading-[1.6] text-av-muted">
                            {x.d}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          <div aria-hidden="true" className="w-[clamp(24px,4vw,64px)] flex-none" />
        </div>
      </div>
    </HorizontalScene>
  );
}
