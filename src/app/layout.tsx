import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import {AuthProvider} from "@/contexts/AuthContext";
import { Head } from "next/document";

const alatsi = localFont({
  src: "../assets/fonts/Alatsi-Regular.ttf",
  variable: "--font-alatsi",
})
const jura = localFont({
  src: "../assets/fonts/Jura-VariableFont_wght.ttf",
  variable: "--font-jura",
})

export const metadata: Metadata = {
  title: "Movie Master",
  description: "Find movies with a smile :)",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>

        {/* Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"></link>

        {/* Open Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" ></link>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"></link>
      </head>
    <body
      className={`${alatsi.variable} ${jura.variable} antialiased text-white bg-primary`}
    >
    <AuthProvider>
      <Header/>
      <main className="bg-gradient-to-b from-background_primary via-slate-600 to-background_primary h-screen">
        <div className="main-container">
          {children}
        </div>
      </main>
    </AuthProvider>
    </body>
    </html>
  );
}
