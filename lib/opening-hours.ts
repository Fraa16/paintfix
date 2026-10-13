import { openingHours } from "@/content/site";

export interface OpenStatus {
  open: boolean;
  text: string;
}

const DAY_SHORT = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const berlin = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Berlin",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Wochentag und Uhrzeit in Europe/Berlin, unabhängig von der Zeitzone des Geräts. */
function berlinTime(date: Date): { day: number; hours: number } {
  const parts = Object.fromEntries(berlin.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    day: WEEKDAY_INDEX[parts.weekday],
    hours: Number(parts.hour) + Number(parts.minute) / 60,
  };
}

/** Live-Öffnungsstatus wie in README 9.9. */
export function openStatus(date: Date): OpenStatus {
  const { day, hours } = berlinTime(date);
  const today = openingHours[day];
  if (today && hours >= today[0] && hours < today[1]) {
    return { open: true, text: `Heute geöffnet bis ${today[1]} Uhr` };
  }
  if (today && hours < today[0]) {
    return { open: false, text: `Öffnet heute um ${today[0]} Uhr` };
  }
  for (let k = 1; k <= 7; k++) {
    const next = (day + k) % 7;
    const h = openingHours[next];
    if (h) {
      return {
        open: false,
        text: `Geschlossen, öffnet ${k === 1 ? "morgen" : DAY_SHORT[next]} um ${h[0]} Uhr`,
      };
    }
  }
  return { open: false, text: "" };
}

/**
 * Unsichtbarer Platzhalter vor dem ersten Client-Render, ungefähr so breit wie der echte Status
 * (z. B. „Heute geöffnet bis 18 Uhr“), damit die Zeile beim Laden nicht springt.
 */
export const openStatusPlaceholder = (() => {
  const weekday = openingHours.find((h) => h !== null);
  return weekday ? `Heute geöffnet bis ${weekday[1]} Uhr` : "";
})();
