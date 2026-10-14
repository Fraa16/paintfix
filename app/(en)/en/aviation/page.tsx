import type { Metadata } from "next";
import { AviationPage } from "@/components/aviation/AviationPage";

export const metadata: Metadata = {
  title: { absolute: "PaintFix Aviation | Aircraft detailing for business aviation" },
  alternates: { canonical: "/en/aviation", languages: { de: "/aviation", en: "/en/aviation" } },
};

export default function Page() {
  return <AviationPage locale="en" />;
}
