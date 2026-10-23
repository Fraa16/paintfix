/**
 * Strukturierte Daten als <script type="application/ld+json"> (Next-Doku, Leitfaden JSON-LD).
 * `<` wird maskiert, damit kein Wert das Skript-Element beenden kann.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
