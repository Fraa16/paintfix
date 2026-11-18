import Link from "next/link";
import { cx } from "@/lib/cx";

export type Crumb = { href: string; label: string };

/**
 * Brotkrumen „Start / … / {current}“ im Seitenkopf (README 8.2 und 8.3, Referenz Zeilen 266 und 371).
 * `trail` sind die Ebenen zwischen Start und der aktuellen Seite (z. B. Leistungen).
 * KONZEPT: in Geist Mono; `tone="onInk"` auf den dunklen Seitenköpfen.
 */
export function CarBreadcrumb({
  current,
  trail = [],
  tone = "light",
}: {
  current: string;
  trail?: ReadonlyArray<Crumb>;
  tone?: "light" | "onInk";
}) {
  const links: Crumb[] = [{ href: "/", label: "Start" }, ...trail];
  const ink = tone === "onInk";
  return (
    <nav aria-label="Brotkrümelnavigation">
      <ol
        className={cx(
          "flex flex-wrap gap-2.5 font-mono text-[11px] leading-[1.4] tracking-[0.06em] uppercase",
          ink ? "text-car-on-ink-muted" : "text-car-muted",
        )}
      >
        {links.map((c) => (
          <li key={c.href} className="flex gap-2.5">
            <Link
              href={c.href}
              className={cx(
                "transition-colors",
                ink ? "hover:text-car-on-ink" : "hover:text-car-ink",
              )}
            >
              {c.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className={ink ? "text-car-on-ink" : "text-car-ink"}>
          {current}
        </li>
      </ol>
    </nav>
  );
}
