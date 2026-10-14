import type { StaticImageData } from "next/image";
import type { Locale } from "./aviation";

import av14983522 from "@/assets/img/av-14983522.jpg";
import av20562278 from "@/assets/img/av-20562278.jpg";
import av20562279 from "@/assets/img/av-20562279.jpg";
import av25724429 from "@/assets/img/av-25724429.jpg";
import av28772726 from "@/assets/img/av-28772726.jpg";
import av28776071 from "@/assets/img/av-28776071.jpg";
import av32346742 from "@/assets/img/av-32346742.jpg";
import car12397895 from "@/assets/img/car-12397895.jpg";
import car14615262 from "@/assets/img/car-14615262.jpg";
import car14908957 from "@/assets/img/car-14908957.jpg";
import carHeroKeramik from "@/assets/img/car-hero-keramik.webp";
import carSmartRepair from "@/assets/img/car-smart-repair.webp";
import car29132800 from "@/assets/img/car-29132800.jpg";
import car30787396 from "@/assets/img/car-30787396.jpg";
import car31154217 from "@/assets/img/car-31154217.jpg";
import car37809563 from "@/assets/img/car-37809563.jpg";
import car6872176 from "@/assets/img/car-6872176.jpg";
import car6873023 from "@/assets/img/car-6873023.jpg";

/**
 * Bildregister. Jedes Foto der Website ist ein benannter Platz (README 12).
 *
 * Alle Fotos sind derzeit Platzhalter: Pexels-Fotos (`source: "stock"`) oder KI-Bilder
 * (`source: "ai"`, erzeugt mit ChatGPT). Sie werden durch ein eigenes Shooting ersetzt. Zum Tauschen: Datei in assets/img/ ablegen, Import hier umstellen, `source` auf
 * "client" setzen und `alt` anpassen.
 *
 * Alt-Texte beschreiben, was das Foto zeigt (nicht den Zweck des Platzes) und stellen Stock-Fotos nicht
 * als Mitarbeiter oder Halle von PaintFix dar.
 *
 * Stock- und KI-Bilder dürfen nie als eigene Arbeit von PaintFix erscheinen (UWG § 5):
 * Bildunterschriften nennen nur die Leistung, keinen bestimmten Auftrag. Der Vorher/Nachher-Regler
 * braucht vor dem Launch ein echtes Fotopaar.
 */
export type MediaSource = "stock" | "ai" | "client";

export interface Media {
  src: StaticImageData;
  /** Alternativtext. Aviation-Bilder haben DE und EN. */
  alt: { de: string; en?: string };
  source: MediaSource;
  credit?: string;
  /** Motiv, das für das eigene Shooting gebraucht wird (README 12). */
  needed: string;
}

const pexels = { source: "stock", credit: "Pexels" } as const;

export const media = {
  // ---------- Fahrzeug ----------
  carHero: {
    src: carHeroKeramik,
    alt: {
      de: "Behandschuhte Hand trägt mit einem Applikator eine Keramikversiegelung auf schwarzen Lack auf",
    },
    needed: "Fahrzeug-Hero 4:5: hochwertiges Detail, z. B. Keramikversiegelung auf schwarzem Lack",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 14.10.2026",
  },
  carHoverAussen: {
    src: car6872176,
    alt: { de: "Handwäsche eines weißen Sportwagens mit Schaum" },
    needed: "Hover-Bild Außen: Handwäsche",
    ...pexels,
  },
  carHoverInnen: {
    src: car37809563,
    alt: { de: "Maschinenpolitur an rotem Autolack" },
    needed: "Hover-Bild Innen und Leistungsseite Innen: Innenraum",
    ...pexels,
  },
  carHoverPolitur: {
    src: car14615262,
    alt: { de: "Maschinenpolitur am Lack eines dunklen Fahrzeugs" },
    needed: "Hover-Bild Politur: Maschinenpolitur",
    ...pexels,
  },
  carHoverKeramik: {
    src: car30787396,
    alt: { de: "Tiefglänzender schwarzer Lack mit Spiegelungen" },
    needed: "Hover-Bild Keramik: Abperleffekt",
    ...pexels,
  },
  carBeforeAfter: {
    src: car12397895,
    alt: { de: "Heckpartie eines grauen Mercedes-Benz C-Klasse Coupés" },
    needed: "Vorher/Nachher: echtes Fotopaar aus gleicher Perspektive",
    ...pexels,
  },
  carStandort: {
    src: car31154217,
    alt: { de: "Zwei Personen arbeiten in einer Werkstatt an einem dunklen Fahrzeug" },
    needed: "Standort: Halle von außen oder Team",
    ...pexels,
  },
  carSvcAussen: {
    src: car6873023,
    alt: { de: "Vorwäsche mit dem Hochdruckreiniger in einer Werkstatt" },
    needed: "Leistungsseite Außen: Arbeitsschritt",
    ...pexels,
  },
  carSvcPolitur: {
    src: car14908957,
    alt: { de: "Kunststoffteile werden vor der Politur abgeklebt" },
    needed: "Leistungsseite Politur: Arbeitsschritt",
    ...pexels,
  },
  carSvcKeramik: {
    src: car29132800,
    alt: { de: "Schwarzer Sportwagen mit glänzendem Lack im Studio" },
    needed: "Leistungsseite Keramik: Arbeitsschritt",
    ...pexels,
  },

  carSvcSmartRepair: {
    src: carSmartRepair,
    alt: {
      de: "Behandschuhte Hände setzen ein Ausbeulwerkzeug mit Klebepad am Dach eines schwarzen Autos an, dahinter eine Streifenleuchte",
    },
    needed: "Smart Repair: Spot-Reparatur eines Kratzers oder einer Delle",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 14.10.2026",
  },
  carSvcLeasing: {
    src: car12397895,
    alt: { de: "Heckpartie eines grauen Mercedes-Benz C-Klasse Coupés" },
    needed: "Leasingrückgabe: Begutachtung oder Übergabe eines aufbereiteten Fahrzeugs",
    ...pexels,
  },

  // ---------- Aviation ----------
  avHero: {
    src: av28772726,
    alt: {
      de: "Business Jet auf dem Vorfeld bei Sonnenuntergang",
      en: "Business jet on the apron at sunset",
    },
    needed: "Aviation-Hero: Business Jet auf dem Vorfeld",
    ...pexels,
  },
  avRamp: {
    src: av25724429,
    alt: { de: "Business Jet auf dem Vorfeld bei Nacht", en: "Business jet on the apron at night" },
    needed: "Expand: Vorfeld EDDG bei Nacht oder blauer Stunde",
    ...pexels,
  },
  avExterior: {
    src: av14983522,
    alt: { de: "Schwarzer Light Jet auf dem Vorfeld", en: "Black light jet on the apron" },
    needed: "Leistungen Außen, Berichtsfoto: Außenreinigung am Jet",
    ...pexels,
  },
  avCabin: {
    src: av20562278,
    alt: {
      de: "Kabine eines Business Jets mit Ledersitzen und Holzfurnier",
      en: "Business jet cabin with leather seats and wood veneer",
    },
    needed: "Leistungen Kabine, Berichtsfoto: Kabine",
    ...pexels,
  },
  avProtection: {
    src: av32346742,
    alt: {
      de: "Rumpf einer Beechcraft King Air mit Schriftzug",
      en: "Fuselage of a Beechcraft King Air with lettering",
    },
    needed: "Leistungen Schutz, Berichtsfoto: Versiegelung, Hangar",
    ...pexels,
  },
  avCabinQuiet: {
    src: av20562279,
    alt: {
      de: "Ruhige Kabine eines Business Jets mit Sitzgruppe und Sofa",
      en: "Quiet business jet cabin with club seats and divan",
    },
    needed: "Kabinen-Zitat: Kabine, ruhig",
    ...pexels,
  },
  avDetail: {
    src: av28776071,
    alt: {
      de: "Triebwerk und Rumpf eines Business Jets auf dem Vorfeld",
      en: "Engine and fuselage of a business jet on the apron",
    },
    needed: "Berichtsfoto: Detail",
    ...pexels,
  },
} satisfies Record<string, Media>;

export type MediaId = keyof typeof media;

/** Alternativtext in der gewünschten Sprache (Fahrzeugbilder nur Deutsch). */
export function altText(id: MediaId, locale: Locale = "de"): string {
  const m: Media = media[id];
  return (locale === "en" && m.alt.en) || m.alt.de;
}

const byRefPath: Record<string, MediaId> = {
  "img/car-6872176.jpg": "carHoverAussen",
  "img/car-37809563.jpg": "carHoverInnen",
  "img/car-14615262.jpg": "carHoverPolitur",
  "img/car-30787396.jpg": "carHoverKeramik",
  "img/car-12397895.jpg": "carBeforeAfter",
  "img/car-31154217.jpg": "carStandort",
  "img/car-6873023.jpg": "carSvcAussen",
  "img/car-14908957.jpg": "carSvcPolitur",
  "img/car-29132800.jpg": "carSvcKeramik",
  "img/av-28772726.jpg": "avHero",
  "img/av-25724429.jpg": "avRamp",
  "img/av-14983522.jpg": "avExterior",
  "img/av-20562278.jpg": "avCabin",
  "img/av-32346742.jpg": "avProtection",
  "img/av-20562279.jpg": "avCabinQuiet",
  "img/av-28776071.jpg": "avDetail",
};

/** Löst Bildpfade aus den Inhaltsdateien auf (z. B. `img2` in fahrzeug.json). */
export function mediaByRefPath(path: string): MediaId {
  const id = byRefPath[path];
  if (!id) throw new Error(`Kein Bild für ${path} im Register`);
  return id;
}
