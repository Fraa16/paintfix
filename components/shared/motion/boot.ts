/**
 * Inline-Skript vor dem ersten Paint (<script> am Anfang von <body>, in beiden Root-Layouts).
 *
 * 1. html[data-motion]: nur ohne reduzierte Bewegung. Erst dann setzt globals.css die Startzustände
 *    der Reveals (unsichtbar, versetzt). Ohne JavaScript bleibt alles sichtbar (README 9.1).
 *    Sicherheitsnetz: meldet sich der Reveal-Controller nicht innerhalb von 4s (window.__pfMotion),
 *    wird data-motion wieder entfernt, damit Inhalte nie dauerhaft verborgen bleiben.
 * 2. html[data-curtain-in="av|car"]: Markenwechsel über eine Root-Layout-Grenze (/en/aviation ↔
 *    Fahrzeug) lädt die Seite neu. Die alte Seite legt das Ziel in sessionStorage („pf-curtain“);
 *    die neue Seite startet damit verdeckt und deckt auf (components/shared/curtain).
 *    Sicherheitsnetz: Übernimmt der Curtain-Controller nicht innerhalb von 6s (er entfernt
 *    data-curtain-in beim Start), deckt das Skript selbst auf und gibt die Reveals frei.
 */
export const bootScript = `(function(){try{var d=document.documentElement;
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-motion","");
setTimeout(function(){if(!window.__pfMotion)d.removeAttribute("data-motion")},4000);
var c=sessionStorage.getItem("pf-curtain");if(c==="av"||c==="car"){d.setAttribute("data-curtain-in",c);d.setAttribute("data-curtain-hold","");
setTimeout(function(){if(d.hasAttribute("data-curtain-in")){d.removeAttribute("data-curtain-in");d.removeAttribute("data-curtain-hold");dispatchEvent(new Event("pf:curtain-release"))}},6000)}}
sessionStorage.removeItem("pf-curtain")}catch(e){}})();`;
