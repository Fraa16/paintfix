import type { Metadata } from "next";
import { AviationPage } from "@/components/aviation/AviationPage";

export const metadata: Metadata = {
  title: { absolute: "Paintfix Aviation · Flugzeugaufbereitung für Business Aviation" },
  alternates: { canonical: "/aviation", languages: { de: "/aviation", en: "/en/aviation" } },
};

export default function Page() {
  return <AviationPage locale="de" />;
}
