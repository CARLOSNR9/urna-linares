import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirebaseMockProvider } from "@/lib/firebase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URNA LINARES | Monitoreo en Vivo",
  description: "Sistema de Monitoreo Electoral en Tiempo Real - Alcaldía Municipal de Linares, Nariño",
  manifest: "/manifest.json",
  themeColor: "#0E3B68",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Urna Linares",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-brand-light min-h-screen pb-safe`}>
        <FirebaseMockProvider>
          {children}
        </FirebaseMockProvider>
      </body>
    </html>
  );
}
