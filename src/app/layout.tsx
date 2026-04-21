import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panton x Vitra - Local Rebuild",
  description: "Independent static Next.js rebuild of the Panton Vitra Framer site.",
  metadataBase: new URL("https://panton.local")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0c607e] text-[#ebf9fa]">{children}</body>
    </html>
  );
}
