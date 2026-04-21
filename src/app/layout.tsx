import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABG Meeting - Invitation Portal",
  description: "Static native invitation experience with confirmation flow.",
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
