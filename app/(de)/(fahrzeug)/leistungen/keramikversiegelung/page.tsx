import { CarServicePageView, carServiceMetadata } from "@/components/fahrzeug/service/ServicePage";
import { requireCarServicePage } from "@/content/leistungen";

/** Seite je Leistung; Inhalte in content/leistungen.ts (24.11.2026). */
const page = requireCarServicePage("keramikversiegelung");

export const metadata = carServiceMetadata(page);

export default function Page() {
  return <CarServicePageView page={page} />;
}
