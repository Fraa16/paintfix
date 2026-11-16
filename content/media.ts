import type { StaticImageData } from "next/image";
import type { Locale } from "./aviation";

import av20562278 from "@/assets/img/av-20562278.jpg";
import av20562279 from "@/assets/img/av-20562279.jpg";
import av28776071 from "@/assets/img/av-28776071.jpg";
import avCoatingBeading from "@/assets/img/av-coating-beading.webp";
import avHeroDusk from "@/assets/img/av-hero-dusk.jpg";
import avLeadingEdge from "@/assets/img/av-leading-edge.webp";
import avRampNight from "@/assets/img/av-ramp-night.jpg";
import car14615262 from "@/assets/img/car-14615262.jpg";
import carAussen from "@/assets/img/car-aussen.webp";
import carHeroKeramik from "@/assets/img/car-hero-keramik.webp";
import carInnen from "@/assets/img/car-innen.webp";
import carKeramik from "@/assets/img/car-keramik.webp";
import carLackkorrektur from "@/assets/img/car-lackkorrektur.webp";
import carLackNachher from "@/assets/img/car-lackkorrektur-nachher.webp";
import carLackVorher from "@/assets/img/car-lackkorrektur-vorher.webp";
import carLeasingCheck from "@/assets/img/car-leasing-check.webp";
import carSmartRepair from "@/assets/img/car-smart-repair.webp";
import car31154217 from "@/assets/img/car-31154217.jpg";

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
  carSvcInnen: {
    src: carInnen,
    alt: {
      de: "Gepflegter Innenraum mit schwarzem Lederlenkrad, Türverkleidung und perforiertem Ledersitz",
    },
    needed: "Innenaufbereitung: Innenraum, idealerweise bei der Reinigung von Leder oder Polstern",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 15.10.2026",
  },
  carHoverPolitur: {
    src: car14615262,
    alt: { de: "Maschinenpolitur am Lack eines dunklen Fahrzeugs" },
    needed: "Hover-Bild Politur: Maschinenpolitur",
    ...pexels,
  },
  // Vorher/Nachher-Regler: KI-Paar, im Regler als „Symbolbild, KI-generiert“ gekennzeichnet.
  carPaintAfter: {
    src: carLackNachher,
    alt: {
      de: "Schwarzer Metalliclack an Motorhaube und Kotflügel nach der Politur, ohne Kratzer",
    },
    needed: "Vorher/Nachher: echtes Fotopaar aus gleicher Perspektive (Nachher)",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 24.10.2026",
  },
  carPaintBefore: {
    src: carLackVorher,
    alt: {
      de: "Schwarzer Metalliclack an Motorhaube und Kotflügel mit Waschkratzern und Hologrammen",
    },
    needed: "Vorher/Nachher: echtes Fotopaar aus gleicher Perspektive (Vorher)",
    source: "ai",
    credit:
      "KI-generiert (ChatGPT), 24.10.2026, auf das Nachher-Bild ausgerichtet und leicht versetzt wie eine zweite Aufnahme",
  },
  carStandort: {
    src: car31154217,
    alt: { de: "Zwei Personen arbeiten in einer Werkstatt an einem dunklen Fahrzeug" },
    needed: "Standort: Halle von außen oder Team",
    ...pexels,
  },
  carSvcAussen: {
    src: carAussen,
    alt: {
      de: "Behandschuhte Hand wäscht die schaumbedeckte Motorhaube eines schwarzen Autos mit einem Waschhandschuh",
    },
    needed: "Außenaufbereitung: Handwäsche mit Schaum",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 14.10.2026, aus zwei Varianten zusammengesetzt",
  },
  carSvcPolitur: {
    src: carLackkorrektur,
    alt: {
      de: "Behandschuhte Hände führen eine Exzenterpoliermaschine über eine schwarze Autotür",
    },
    needed: "Lackkorrektur: Maschinenpolitur am Lack",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 14.10.2026, links beschnitten",
  },
  carSvcKeramik: {
    src: carKeramik,
    alt: { de: "Wasser perlt in runden Tropfen auf versiegeltem schwarzem Lack ab" },
    needed: "Keramikversiegelung: Abperleffekt auf versiegeltem Lack",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 15.10.2026",
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
    src: carLeasingCheck,
    alt: { de: "Behandschuhte Hand prüft schwarzen Lack mit einer kleinen LED-Prüfleuchte" },
    needed: "Leasingrückgabe: Begutachtung oder Übergabe eines aufbereiteten Fahrzeugs",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 14.10.2026",
  },

  // ---------- Aviation ----------
  avHero: {
    src: avHeroDusk,
    alt: {
      de: "Business Jet von hinten auf dem Vorfeld in der Abenddämmerung",
      en: "Business jet seen from behind on the apron at dusk",
    },
    needed: "Aviation-Hero: Business Jet auf dem Vorfeld",
    source: "stock",
    credit: "Pexels, Himmel oben verlängert, leicht abgedunkelt",
  },
  avRamp: {
    src: avRampNight,
    alt: { de: "Business Jet auf dem Vorfeld bei Nacht", en: "Business jet on the apron at night" },
    needed: "Expand: Vorfeld EDDG bei Nacht oder blauer Stunde",
    // Kennzeichen und Betreiber-Streifen retuschiert: kein bestimmtes Flugzeug, kein Betreiber als Kunde.
    source: "stock",
    credit: "Unsplash, retuschiert (Kennzeichen, Streifen in Navy, Kegel, Fahrzeug)",
  },
  avExterior: {
    src: avLeadingEdge,
    alt: {
      de: "Behandschuhte Hand poliert die blanke Eintrittskante einer Tragfläche mit einem Mikrofasertuch",
      en: "Gloved hand polishing the bare-metal leading edge of a wing with a microfibre towel",
    },
    needed: "Leistungen Außen, Berichtsfoto: Außenreinigung am Jet",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 24.10.2026",
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
    src: avCoatingBeading,
    alt: {
      de: "Wassertropfen perlen auf versiegeltem weißem Lack mit dunkelblauem Streifen ab",
      en: "Water droplets beading on coated white paint with a navy stripe",
    },
    needed: "Leistungen Schutz, Berichtsfoto: Versiegelung, Hangar",
    source: "ai",
    credit: "KI-generiert (ChatGPT), 24.10.2026",
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
  "img/car-innen.webp": "carSvcInnen",
  "img/car-14615262.jpg": "carHoverPolitur",
  "img/car-31154217.jpg": "carStandort",
  "img/car-aussen.webp": "carSvcAussen",
  "img/car-lackkorrektur.webp": "carSvcPolitur",
  "img/car-keramik.webp": "carSvcKeramik",
  "img/av-20562278.jpg": "avCabin",
  "img/av-20562279.jpg": "avCabinQuiet",
  "img/av-28776071.jpg": "avDetail",
};

/** Löst Bildpfade aus den Inhaltsdateien auf (z. B. `img2` in fahrzeug.json). */
export function mediaByRefPath(path: string): MediaId {
  const id = byRefPath[path];
  if (!id) throw new Error(`Kein Bild für ${path} im Register`);
  return id;
}
