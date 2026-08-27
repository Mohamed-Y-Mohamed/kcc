import React from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

/**
 * Wraps every customer-facing page. The admin dashboard sits outside this
 * group so it gets its own chrome instead of the marketing header.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
