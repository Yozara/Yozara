"use client";
import PikoChat from "@/components/PikoChat";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = ["/login", "/signup", "/onboarding"].includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
<PikoChat />
<main className="flex-grow">{children}</main>
    </>
  );
}
