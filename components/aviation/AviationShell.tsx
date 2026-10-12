import type { ReactNode } from "react";
import { aviation, type Locale } from "@/content/aviation";
import { AvActionBar } from "./shell/AvActionBar";
import { AvFooter } from "./shell/AvFooter";
import { AvHeader } from "./shell/AvHeader";
import { AvScrollState } from "./shell/AvScrollState";
import { AvSectionIndicator } from "./shell/AvSectionIndicator";
import { SkipLink } from "@/components/shared/SkipLink";
import { avUi, telHref } from "./shell/ui";

/**
 * Markenhülle Paintfix Aviation (README 8.4, Referenz Zeile 551): Creme, Navy-Text, Mona Sans 350,
 * Zeilenhöhe normal wie in der Referenz. Header, Seite, Footer, Abschnittsanzeige und mobile
 * Aktionsleiste mit 76px Navy-Platzhalter am Ende.
 */
export function AviationShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const av = aviation[locale];
  return (
    <div
      data-brand="av"
      className="relative bg-av-cream font-sans leading-[normal] font-[350] text-av-navy"
    >
      <SkipLink
        label={avUi[locale].skip}
        className="focus:bg-av-cream focus:text-av-navy focus:outline-av-navy"
      />
      <AvScrollState>
        <AvHeader locale={locale} nav={av.nav} cta={av.cta} />
        {children}
        <AvFooter locale={locale} />
        <div aria-hidden="true" className="h-[76px] bg-av-navy wide:hidden" />
        <AvSectionIndicator secs={av.secs} />
        <AvActionBar
          label={avUi[locale].quickContact}
          call={av.barCall}
          tel={telHref(av.opsPhone)}
          cta={av.cta}
        />
      </AvScrollState>
    </div>
  );
}
