import type { Metadata } from "next";
import { Lexend, Playfair_Display } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Date Invitation",
  description: "A yellow-themed date invitation with nyota star background.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
