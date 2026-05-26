import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sketch CRM",
  description: "A modern modular CRM with subtle sketch accents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
