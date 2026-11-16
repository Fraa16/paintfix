/**
 * Formularfelder Aviation (README 8.0): Label 10px Versalien 0.26em, Feld 48px, nur Unterkante 1px.
 *
 * Fokus: Die Unterkante wird voll deckend (Referenz). Zusätzlich zeigt das ganze Feld (Label + Linie)
 * die 1px-Fokuslinie in --focus (README 13). Sie sitzt am Label statt am Eingabefeld, weil ein Outline
 * mit 3px Abstand um das Eingabefeld die Labelzeile direkt darüber durchschneiden würde. Abstände über
 * dem Feld deshalb als margin, nicht als padding, damit der Rahmen eng am Label liegt.
 */
export const fieldFocus =
  "has-focus-visible:outline has-focus-visible:outline-offset-3 has-focus-visible:outline-(--focus)";

/** Eingabefeld ohne eigenes Outline (das trägt das umgebende Label, siehe fieldFocus). */
export const fieldNoOutline = "focus-visible:outline-none";
