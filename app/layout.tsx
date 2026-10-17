import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenala Health Hub | Care • Compassion • Community | Sr Grace",
  description:
    "Professional clinical healthcare and mobile nursing provider in Nellmapius and Pretoria East. Antenatal care, baby & adult immunisation, family planning, blood tests, and wound care.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[#FAFAFA] text-zinc-900">
        {children}
      </body>
    </html>
  );
}
