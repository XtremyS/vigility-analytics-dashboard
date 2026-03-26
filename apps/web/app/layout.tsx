import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vigility Analytics Dashboard",
  description: "Interactive product analytics dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
