import type { ReactNode } from "react";
import { AviationShell } from "@/components/aviation/AviationShell";

export default function AviationLayoutEn({ children }: { children: ReactNode }) {
  return <AviationShell locale="en">{children}</AviationShell>;
}
