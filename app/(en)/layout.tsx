import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { cinzel, mona } from "../fonts";
import { siteUrl } from "@/lib/site-url";

/** Root-Layout für /en/aviation. Eigenes Layout, damit <html lang="en"> stimmt. */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Paintfix Aviation", template: "%s · Paintfix Aviation" },
};

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${mona.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
