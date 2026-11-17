import { avServiceRoute } from "@/components/aviation/service/AvServicePage";

/** Aviation-Bereich Schutz (Englisch); Texte in content/aviation-pages.ts (Auftrag 04.11.2026). */
const route = avServiceRoute("protection", "en");

export const metadata = route.metadata;
export default route.Page;
