import type { Metadata } from "next";
import { AviationPage } from "@/components/aviation/AviationPage";
import { JsonLd } from "@/components/shared/JsonLd";
import { aviation } from "@/content/aviation";
import { aviationBusiness } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "PaintFix Aviation | Aircraft detailing for business aviation" },
  description: aviation.en.sub,
  alternates: {
    canonical: "/en/aviation",
    languages: { de: "/aviation", en: "/en/aviation", "x-default": "/aviation" },
  },
};

export default function Page() {
  return (
    <>
      <AviationPage locale="en" />
      <JsonLd data={aviationBusiness("en")} />
    </>
  );
}
