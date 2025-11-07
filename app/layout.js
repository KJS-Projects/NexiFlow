import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MyStore",
  description: "Your Second Hand MarketPlace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header2 />
        <main>{children}</main>
        <Footer2 />
      </body>
    </html>
  );
}
