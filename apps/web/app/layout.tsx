import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vigility Analytics Dashboard",
  description: "Interactive product analytics dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}