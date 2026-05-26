import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

import { UIPreferencesProvider } from "@/components/layout/ui-preferences-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sketch CRM",
  description: "A modern modular CRM with subtle sketch accents.",
};

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-ibm-plex-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${jetbrainsMono.variable} ${geist.variable} ${ibmPlexSans.variable}`}>
        <UIPreferencesProvider>{children}</UIPreferencesProvider>
      </body>
    </html>
  );
}
