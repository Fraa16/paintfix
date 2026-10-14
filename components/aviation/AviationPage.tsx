import type { Locale } from "@/content/aviation";
import { Audience } from "./intro/Audience";
import { CabinQuote } from "./intro/CabinQuote";
import { Expand } from "./intro/Expand";
import { Hero } from "./intro/Hero";
import { Process } from "./intro/Process";
import { Services } from "./intro/Services";
import { Standards } from "./sections/Standards";
import { Fleet } from "./sections/Fleet";
import { Terms } from "./sections/Terms";
import { Contact } from "./sections/Contact";

/**
 * Seite PaintFix Aviation (README 8.4): Hero (sticky), darüber der Inhaltsblock (z-index 2, Creme).
 * data-av-content markiert den Block für den Header-Wechsel (AvScrollState).
 */
export function AviationPage({ locale }: { locale: Locale }) {
  return (
    <main id="inhalt" tabIndex={-1} className="focus:outline-none">
      <Hero locale={locale} />
      <div data-av-content="" className="relative z-2 bg-av-cream">
        <Audience locale={locale} />
        <Expand locale={locale} />
        <Services locale={locale} />
        <CabinQuote locale={locale} />
        <Process locale={locale} />
        <Standards locale={locale} />
        <Fleet locale={locale} />
        <Terms locale={locale} />
        <Contact locale={locale} />
      </div>
    </main>
  );
}
