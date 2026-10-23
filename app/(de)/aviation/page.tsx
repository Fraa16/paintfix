import type { Metadata } from "next";
import { AviationPage } from "@/components/aviation/AviationPage";
import { JsonLd } from "@/components/shared/JsonLd";
import { aviation } from "@/content/aviation";
import { aviationBusiness } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "PaintFix Aviation | Flugzeugaufbereitung für Business Aviation" },
  description: aviation.de.sub,
  alternates: {
    canonical: "/aviation",
    languages: { de: "/aviation", en: "/en/aviation", "x-default": "/aviation" },
  },
};

export default function Page() {
  return (
    <>
      <AviationPage locale="de" />
      <JsonLd data={aviationBusiness("de")} />
    </>
  );
}
