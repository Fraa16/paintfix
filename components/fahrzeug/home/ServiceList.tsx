import Link from "next/link";
import { CarTextLink } from "@/components/fahrzeug/Button";
import { CarOverline } from "@/components/fahrzeug/Overline";
import { services } from "@/content/fahrzeug";
import { eur } from "@/lib/format";
import { CarH2 } from "@/components/fahrzeug/Heading";

/**
 * Leistungen (#leistungen, README 8.1 Punkt 3, Referenz Zeilen 131–162).
 *
 * Hover ab 980px mit Zeiger (README 9.3, reines CSS): die übrigen Zeilen blenden auf 0.28 ab, der
 * Name der Zeile rückt 18px nach rechts. Tastaturfokus wirkt wie in der Referenz genauso.
 * Das dem Cursor folgende Bild kommt in Phase 4; overflow-x: clip ist dafür schon gesetzt.
 */
export function ServiceList() {
  return (
    <section
      id="leistungen"
      className="overflow-x-clip border-t border-car-line-ui bg-car-bg pt-car-section pb-[clamp(72px,9vw,128px)] leading-[normal]"
    >
      <div className="mx-auto max-w-car px-car-gutter">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-6">
          <div>
            <CarOverline className="leading-[normal]">Leistungen</CarOverline>
            <CarH2>Was wir für Ihr Fahrzeug tun.</CarH2>
          </div>
          <div className="flex flex-col items-start gap-[18px]">
            <p className="max-w-[520px] text-[17px] leading-[1.6] text-pretty text-car-text">
              Vier Leistungen, einzeln oder kombiniert. Außen und innen zusammen kosten weniger als
              einzeln gebucht.
            </p>
            <CarTextLink href="/leistungen" className="leading-[normal]">
              Alle Preise und Fahrzeugklassen
            </CarTextLink>
          </div>
        </div>

        <div className="relative mt-[clamp(48px,6vw,80px)] border-t border-car-ink wide:[&:has(>a:focus-visible)>a:not(:focus-visible)]:opacity-28 wide:pointer-fine:[&:has(>a:hover)>a:not(:hover)]:opacity-28">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/leistungen#svc-${s.id}`}
              className="group/row flex w-full flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-car-line py-[clamp(24px,2.8vw,40px)] text-left text-car-ink transition-opacity duration-400 ease-[ease]"
            >
              <span className="flex-[0_0_40px] text-[13px] text-car-muted tabular-nums">
                {s.no}
              </span>
              <span className="flex-[1_1_360px] text-car-list leading-none font-bold tracking-[-0.0175em] font-stretch-125% transition-transform duration-600 ease-(--ease-out) wide:group-focus-visible/row:translate-x-[18px] wide:pointer-fine:group-hover/row:translate-x-[18px]">
                {s.name}
              </span>
              <span className="flex-[1_1_200px] text-[15px] leading-[1.5] text-car-text">
                {s.short}
              </span>
              <span className="flex-[0_0_96px] text-[14px] text-car-muted">{s.dur}</span>
              <span className="flex flex-[0_0_150px] items-baseline justify-end gap-1.5 whitespace-nowrap">
                <span className="text-[13px] text-car-muted">ab</span>
                <span className="text-[30px] font-medium tracking-[-0.02em] tabular-nums">
                  {eur(s.p[0])}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
