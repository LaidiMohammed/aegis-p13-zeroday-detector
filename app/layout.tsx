import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "P13 / ZERO-DAY — Dossier d'analyse Traversal",
  description:
    "P13 — Détection et caractérisation du Path Traversal (CWE-22) dans Juice Shop. Laboratoire local autorisé, zéro GPU, zéro production.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
