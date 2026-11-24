import { aviation } from "@/content/aviation";
import { aviationPageMeta, aviationPagePath, type Locale } from "@/content/aviation-meta";
import { avPageUi, requireAviationPageCopy } from "@/content/aviation-pages";
import { telHref } from "./ui";

export interface AvMenuArea {
  /** „01“, „02“, „03“ in der Reihenfolge der Bereiche. */
  no: string;
  /** Kurzname des Bereichs („Außen“), aus `tabs`. */
  tab: string;
  /** Name der Seite („Außenpflege“). */
  name: string;
  href: string;
  /** Leistungen des Bereichs aus `svc`. */
  items: ReadonlyArray<string>;
}

export interface AvMenu {
  label: string;
  open: string;
  close: string;
  all: string;
  report: string;
  areas: ReadonlyArray<AvMenuArea>;
  base: { label: string; icao: string; name: string };
  direct: string;
  phone: string;
  tel: string;
  mail: string;
}

/**
 * Daten für Mega-Menü und mobiles Menü des Aviation-Headers in einer Sprache. Auf dem Server gebaut
 * (AviationShell) und als Props übergeben, damit der Client-Header nicht beide Sprachen ins Bundle
 * zieht (CLAUDE.md, Fallstricke).
 */
export function avMenu(locale: Locale): AvMenu {
  const av = aviation[locale];
  const home = av.bases[0];
  return {
    label: av.nav[0],
    open: av.menuOpen,
    close: av.menuClose,
    all: av.menuAll,
    report: avPageUi[locale].report,
    areas: aviationPageMeta.map((m) => ({
      no: String(m.tab + 1).padStart(2, "0"),
      tab: av.tabs[m.tab],
      name: requireAviationPageCopy(m.id, locale).name,
      href: aviationPagePath(m.id, locale),
      items: av.svc[m.tab].map((s) => s.t),
    })),
    base: { label: home.s, icao: home.i, name: home.n },
    direct: av.direct,
    phone: av.opsPhone,
    tel: telHref(av.opsPhone),
    mail: av.opsMail,
  };
}
