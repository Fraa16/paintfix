import type { ReactNode } from "react";
import { AviationShell } from "@/components/aviation/AviationShell";

export default function AviationLayoutDe({ children }: { children: ReactNode }) {
  return <AviationShell locale="de">{children}</AviationShell>;
}
