import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yozara",
  description: "Your gateway to the anime universe.",
  icons: {
    icon: "/icon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#0B0F19]`}>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
