import Link from "next/link";
import { overviewEntries } from "@/components/fahrzeug/leistungen/Services";
import { INSPECT_PRICE, serviceById, type ServiceId } from "@/content/fahrzeug";
import { site } from "@/content/site";
import { eur } from "@/lib/format";
import { Mono, PageStage } from "./ui";

/**
 * Seitenkopf /leistungen auf Schwarz. Links die Einleitung (README 8.2 Punkt 1), rechts ein
 * Verzeichnis aller Leistungen mit Kleinwagenpreis, als Sprungmarken zu #svc-{id}.
 */
export function LeistungenStage() {
  return (
    <PageStage
      current="Leistungen und Preise"
      title="Leistungen und Preise."
      aside={
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-x-[clamp(40px,6vw,120px)] gap-y-10">
          <div className="max-w-[520px]">
            <p className="text-[17px] leading-[1.6] text-pretty text-car-on-ink-soft">
              Umfang und Endpreis jeder Leistung, nach Fahrzeugklasse. Den verbindlichen Festpreis
              für Ihr Fahrzeug nennen wir nach einer kostenlosen Begutachtung, bevor wir anfangen.
            </p>
            {/* Pflichthinweis Kleinunternehmer (Regel 6) als Fußnote, nicht im Fließtext. */}
            <p className="mt-6 text-[13px] leading-[1.5] text-car-on-ink-muted">{site.vatNote}</p>
          </div>
          <nav aria-label="Leistungen auf dieser Seite">
            <ol className="border-t border-car-ink-line">
              {overviewEntries.map((e, i) => (
                <li key={e.id}>
                  <Link
                    href={`#svc-${e.id}`}
                    className="group flex items-baseline gap-5 border-b border-car-ink-line py-3.5 transition-colors hover:text-car-on-ink"
                  >
                    <Mono className="w-6 text-car-on-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </Mono>
                    <span className="flex-1 text-[18px] font-semibold tracking-[-0.015em]">
                      {e.name}
                    </span>
                    <Mono className="text-car-on-ink-muted group-hover:text-car-on-ink">
                      {e.priced ? `ab ${eur(serviceById(e.id as ServiceId).p[0])}` : INSPECT_PRICE}
                    </Mono>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      }
    />
  );
}
