import { CarServicePageView, carServiceMetadata } from "@/components/fahrzeug/service/ServicePage";
import { requireCarServicePage } from "@/content/leistungen";

/** Seite je Schwerpunkt; Inhalte in content/leistungen.ts (Auftrag 04.11.2026). */
const page = requireCarServicePage("lackkorrektur");

export const metadata = carServiceMetadata(page);

export default function Page() {
  return <CarServicePageView page={page} />;
}
