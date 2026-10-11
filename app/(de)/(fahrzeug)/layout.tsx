import type { ReactNode } from "react";
import { CarHeader } from "@/components/fahrzeug/CarHeader";
import { CarFooter } from "@/components/fahrzeug/CarFooter";
import { CarActionBar } from "@/components/fahrzeug/CarActionBar";

/** Layout Fahrzeug: Header, Footer und mobile Aktionsleiste (README 8.0, 8.5, 9.10). */
export default function CarLayout({ children }: { children: ReactNode }) {
  return (
    <div data-brand="car" className="min-h-screen bg-car-bg font-sans font-normal text-car-ink">
      <CarHeader />
      {children}
      <CarFooter />
      <CarActionBar />
    </div>
  );
}
