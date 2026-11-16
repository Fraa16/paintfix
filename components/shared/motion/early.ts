/**
 * Inline-Skript direkt nach dem Seiteninhalt (in beiden Root-Layouts, nach {children}), läuft vor der
 * Hydration.
 *
 * 1. Verzögerungen der Reveals als eigenes Stylesheet (adoptedStyleSheets, kein Inline-Style):
 *    [data-rv="360"]{--rv-d:360ms}, [data-rvs="90"]{--rv-step:90ms}, [data-rvs]>:nth-child(n){--rv-i:n−1}.
 *    window.__pfRv.add(el) ergänzt Regeln für später hinzukommende Elemente (Reveals.tsx).
 * 2. Nur in der Produktion (`early`): Elemente, die beim Laden schon im Sichtbereich liegen, bekommen
 *    sofort data-in. Ihr Reveal startet damit beim ersten Paint wie in der Referenz, nicht erst nach
 *    der Hydration (auf langsamen Handys 2–3 s später, das verzögerte LCP). Erst alle Positionen lesen,
 *    dann schreiben: Die erzwungene Stilberechnung liefert den Startzustand, der Übergang läuft.
 *    In der Entwicklung bleibt das Reveals.tsx überlassen: data-in vor der Hydration meldet React dort
 *    als Abweichung zwischen Server- und Client-Markup. Solange der Curtain deckt, wird nichts gesetzt.
 */
export function earlyRevealScript(early: boolean) {
  return `(function(){var d=document.documentElement;if(!d.hasAttribute("data-motion"))return;try{
var S=new CSSStyleSheet();document.adoptedStyleSheets=document.adoptedStyleSheets.concat([S]);
var seen={},kids=0,A=["data-rv","data-rvm","data-rvc","data-stamp"];
function q(v){return '"'+CSS.escape(v)+'"'}
function add(e){var s=e.getAttribute("data-rvs");if(s!==null){if(!seen["rvs"+s]){seen["rvs"+s]=1;S.insertRule("[data-rvs="+q(s)+"]{--rv-step:"+(parseInt(s,10)||100)+"ms}")}
for(;kids<e.children.length;kids++)S.insertRule("[data-rvs]>:nth-child("+(kids+1)+"){--rv-i:"+kids+"}");return}
for(var i=0;i<A.length;i++){var v=e.getAttribute(A[i]);if(v===null||seen[A[i]+v])continue;seen[A[i]+v]=1;S.insertRule("["+A[i]+"="+q(v)+"]{--rv-d:"+(parseInt(v,10)||0)+"ms}")}}
window.__pfRv={add:add};
var els=document.querySelectorAll("[data-rv],[data-rvs],[data-rvm],[data-rvc],[data-stamp]"),i;
for(i=0;i<els.length;i++)add(els[i]);
if(!${early}||d.hasAttribute("data-curtain-hold"))return;
var vh=innerHeight,show=[];
for(i=0;i<els.length;i++){var e=els[i],r=(e.hasAttribute("data-rvm")&&e.parentElement||e).getBoundingClientRect();if(r.width&&r.top<vh*.92&&r.bottom>-60)show.push(e)}
for(i=0;i<show.length;i++)show[i].setAttribute("data-in","")}catch(x){}})();`;
}
