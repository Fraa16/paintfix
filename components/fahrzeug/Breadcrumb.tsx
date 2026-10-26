import Link from "next/link";

/** Brotkrumen „Start / {current}“ im Seitenkopf (README 8.2 und 8.3, Referenz Zeilen 266 und 371). */
export function CarBreadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Brotkrümelnavigation">
      <ol className="flex flex-wrap gap-2.5 text-[13px] text-car-muted">
        <li className="flex gap-2.5">
          <Link href="/" className="transition-colors hover:text-car-ink">
            Start
          </Link>
          <span aria-hidden="true">/</span>
        </li>
        <li aria-current="page" className="text-car-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}
