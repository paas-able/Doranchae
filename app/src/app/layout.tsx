import type { Metadata } from "next";
import "./globals.css";

import LayoutWrapper from "@components/LayoutWrapper";
import BottomNav from "@components/NavBar";
import Header from "@components/Header";

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
        <Header/>
        <div className={"pt-[60px]"}>
            {children}
        </div>
        <BottomNav/>
      </body>
    </html>
  );
}