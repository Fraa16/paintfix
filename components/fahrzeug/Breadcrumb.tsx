import Link from "next/link";

export type Crumb = { href: string; label: string };

/**
 * Brotkrumen „Start / … / {current}“ im Seitenkopf (README 8.2 und 8.3, Referenz Zeilen 266 und 371).
 * `trail` sind die Ebenen zwischen Start und der aktuellen Seite (z. B. Leistungen).
 */
export function CarBreadcrumb({
  current,
  trail = [],
}: {
  current: string;
  trail?: ReadonlyArray<Crumb>;
}) {
  const links: Crumb[] = [{ href: "/", label: "Start" }, ...trail];
  return (
    <nav aria-label="Brotkrümelnavigation">
      <ol className="flex flex-wrap gap-2.5 text-[13px] text-car-muted">
        {links.map((c) => (
          <li key={c.href} className="flex gap-2.5">
            <Link href={c.href} className="transition-colors hover:text-car-ink">
              {c.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-car-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}
