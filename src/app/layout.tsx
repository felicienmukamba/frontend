import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Milele - Logiciel Comptable OHADA & ERP en RDC",
  description: "Simplifiez votre gestion avec Milele. Logiciel de comptabilité OHADA natif, facturation normalisée DGI RDC, et ERP complet pour les entreprises congolaises.",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.png", sizes: "32x32" },
      { url: "/icon.png", sizes: "16x16" },
    ],
    apple: "/icon.png",
  },
  keywords: [
    "Milele Software RDC",
    "Comptabilité OHADA Kinshasa",
    "DGI RDC Facturation",
    "Logiciel Comptable Congo",
    "ERP RDC",
    "Gestion Commerciale OHADA",
    "Liasse Fiscale RDC"
  ],
  authors: [
    {
      name: "Milele Systems",
      url: "https://milele.systems",
    },
  ],
  openGraph: {
    title: "Milele - Gestion Comptable & ERP en RDC",
    description: "Le leader de l'automatisation comptable SYSCOHADA en République Démocratique du Congo.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Milele Logo",
      },
    ],
    locale: "fr_CD",
    siteName: "Milele Systems",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
