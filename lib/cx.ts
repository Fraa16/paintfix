/** Verbindet Klassen und lässt leere Werte weg. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
