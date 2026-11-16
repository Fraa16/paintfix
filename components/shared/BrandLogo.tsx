import { cx } from "@/lib/cx";

/**
 * Einheitliches PaintFix-Logo für alle Bereiche (Entscheidung 14.10.2026): das Logo der
 * Fahrzeug-Startseite als Basis. Quadrat mit Akzent-Eck, „PAINTFIX“ in Mona Sans 700 mit Breite
 * 125 %, dünne Trennlinie und der Bereich (Automotive, Aviation; später Marine).
 *
 * Quadrat, Wortmarke und Bereich nehmen die Textfarbe (currentColor): schwarz auf Weiß, hell auf
 * Schwarz, Navy auf Creme, Creme auf Navy. Nur das Eck trägt die Bereichsfarbe: Signalrot für
 * Automotive, Gold für Aviation (CLAUDE.md, Regel 5: kein Rot auf Aviation-Seiten).
 *
 * Alle Maße in em, `size` setzt nur die Schriftgröße der Wortmarke:
 *   xs 9px (Arbeitsbericht, Dokument-Cover) · md 14–17px (Header, Footer, Bänder) · lg 17–24px
 *   (Curtain) · xl 30–96px (Abschluss im Aviation-Footer). md, lg und xl werden unter ca. 425px
 *   kleiner, damit Logo und Menü-Button ab 360px nebeneinander passen.
 * `stacked`: Bereich unter der Wortmarke statt daneben (für xl).
 */
export type Division = "automotive" | "aviation";

const DIVISION: Record<Division, { name: string; accent: string }> = {
  automotive: { name: "Automotive", accent: "bg-car-red" },
  aviation: { name: "Aviation", accent: "bg-av-gold" },
};

const SIZE = {
  xs: "text-[9px]",
  md: "text-[clamp(14px,4vw,17px)]",
  lg: "text-[clamp(17px,4.6vw,24px)]",
  xl: "text-[clamp(30px,6vw,96px)]",
} as const;

export function BrandLogo({
  division,
  size = "md",
  stacked = false,
  className,
}: {
  division: Division;
  size?: keyof typeof SIZE;
  stacked?: boolean;
  className?: string;
}) {
  const { name, accent } = DIVISION[division];
  const wordmark = (
    <span className="font-sans font-bold tracking-[0.07em] font-stretch-125%">PAINTFIX</span>
  );

  return (
    <span
      className={cx(
        "inline-flex items-center gap-[0.7em] leading-none whitespace-nowrap",
        SIZE[size],
        className,
      )}
    >
      <span aria-hidden="true" className="relative block size-[1.3em] flex-none bg-current">
        <span className={cx("absolute right-0 bottom-0 size-[0.53em]", accent)} />
      </span>
      {stacked ? (
        <span className="flex flex-col gap-[0.32em]">
          {wordmark}
          <span className="text-[clamp(11px,1vw,14px)] font-medium tracking-[0.62em] uppercase">
            {name}
          </span>
        </span>
      ) : (
        <>
          {wordmark}
          <span
            aria-hidden="true"
            className="block h-[0.95em] w-px flex-none bg-current opacity-35"
          />
          <span className="text-[0.59em] font-medium tracking-[0.3em] uppercase">{name}</span>
        </>
      )}
    </span>
  );
}
