import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CodingAssistantButton from '@/components/CodingAssistantButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeX",
  description: "A code editor and AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#1e1e1e] text-gray-200`}>
        <div className="flex h-screen">
          <main className="flex-1 overflow-auto">
            {children}
            <CodingAssistantButton />
          </main>
        </div>
      </body>
    </html>
  );
}
