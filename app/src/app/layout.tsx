import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@components/NavBar";

export const metadata: Metadata = {
  title: "도란채",
  description: "도란도란 이야기를 나누는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNav/>
      </body>
    </html>
  );
}
