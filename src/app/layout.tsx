import "@/scss/main.scss";
import React from "react";
import { Roboto } from "next/font/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next-pizza Dashboard",
  description: "A sample Next.js application with custom layout",
  icons: {
    icon: "/favicon.ico",
  },
};

const roboto = Roboto({
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin", "cyrillic"],
  style: "normal",
  variable: "--font-roboto",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
