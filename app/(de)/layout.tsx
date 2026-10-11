import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { cinzel, mona } from "../fonts";
import { siteUrl } from "@/lib/site-url";

/** Root-Layout für alle deutschen Seiten (Fahrzeug und /aviation). */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Paintfix · Fahrzeugaufbereitung in Telgte", template: "%s · Paintfix" },
};

export default function GermanRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${mona.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
