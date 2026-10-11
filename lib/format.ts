/** „1.290 €“ mit geschütztem Leerzeichen vor dem Euro-Zeichen (CLAUDE.md, Regel 6). */
export function eur(n: number): string {
  return n.toLocaleString("de-DE") + " €";
}

/** „ab 89 €“ */
export function fromPrice(n: number): string {
  return "ab " + eur(n);
}
