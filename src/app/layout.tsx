import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import {AuthProvider} from "@/contexts/authContext";

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
    <html lang="en">
    <body
      className={`${alatsi.variable} ${jura.variable} antialiased text-white bg-primary`}
    >
    <AuthProvider>
      <Header/>
      {children}
    </AuthProvider>
    </body>
    </html>
  );
}
