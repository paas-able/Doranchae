import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@components/LayoutWrapper"; 

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
      <body className="mx-auto w-full max-w-[430px] flex flex-col min-h-screen">
        
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        
      </body>
    </html>
  );
}