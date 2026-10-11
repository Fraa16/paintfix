// STUB: wird in Phase 2 ersetzt.
import type { ReactNode } from "react";
import type { Locale } from "@/content/aviation";
export function AviationShell({ children }: { locale: Locale; children: ReactNode }) {
  return <div data-brand="av">{children}</div>;
}
