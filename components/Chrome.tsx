"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PikoChat from "@/components/PikoChat";
export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = ["/login", "/signup", "/onboarding", "/welcome"].includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar />
      <PikoChat />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
