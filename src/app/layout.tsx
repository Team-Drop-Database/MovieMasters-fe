import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import {AuthProvider} from "@/contexts/AuthContext";

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
      <main>
        <div className="absolute inset-0 w-full h-screen bg-gradient-to-b from-background_primary via-slate-600 to-background_primary -z-40"></div>
        <div className="main-container">
          {children}
        </div>
        {/* Note: Do not take footer out of the <main> element. While it might not
         look logical, it is necessary to prevent visual bugs. */}
        <footer className="bg-background_secondary h-28 w-full flex justify-center items-center">
          <span className="font-inter opacity-40">© 2024 Movie Masters. All Rights Reserved.</span>
        </footer>
      </main>
    </AuthProvider>
    </body>
    </html>
  );
}
