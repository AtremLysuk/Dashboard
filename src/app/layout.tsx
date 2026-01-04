import "@/scss/main.scss";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A sample Next.js application with custom layout",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
