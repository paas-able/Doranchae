"use client";

import { usePathname } from 'next/navigation';
import BottomNav from "@components/NavBar";
import Header from "@components/Header";
import React from "react";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = usePathname();

  const hideOnPaths = [
    '/login',
    '/signup',
  ];

  const shouldHideNav = hideOnPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {!shouldHideNav && <Header/>}
      
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      
      {!shouldHideNav && <BottomNav/>}
    </>
  );
}