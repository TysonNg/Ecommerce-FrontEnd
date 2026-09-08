"use client";
import { Navbar } from "./navbar";
import { SearchBar } from "./search/ui";
import { RightTopHeader } from "./RightTopHeader";
import { Supports } from "./support";
import { useEffect, useState } from "react";
import Link from "next/link";

export const Header = () => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("cartQuantity");
      setQuantity(value ? Number(value) : 0);
    }

    const handleStorageChange = () => {
      const updatedQuantity = Number(localStorage.getItem("cartQuantity") || 0);
      setQuantity(updatedQuantity);
    };

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 40);
      }
    };

    window.addEventListener("cartQuantityStorage", handleStorageChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("cartQuantityStorage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-shadow duration-300 ${
        isScrolled ? "shadow-lg shadow-black/15" : ""
      }`}
    >
      {/* Top utility bar - visible on tablet and desktop (md:block), hidden on mobile (< 768px) */}
      <div
        className={`bg-[#0769da] w-full transition-all duration-300 overflow-hidden hidden md:block ${
          isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white">
          <Supports />
          <RightTopHeader />
        </div>
      </div>

      {/* Main Header (Logo, Search, Navigation) */}
      <div className="w-full">
        <div
          className={`bg-[#0573f0] w-full transition-all duration-300 ${
            isScrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-6"
          }`}
        >
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6 text-white">
            <div className="shrink-0">
              <Link href={"/"} className="inline-block">
                <span
                  className={`font-bold tracking-tight text-white whitespace-nowrap select-none transition-all duration-300 ${
                    isScrolled ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                  }`}
                >
                  E-Shop
                </span>
              </Link>
            </div>
            <div className="flex-1 min-w-0 max-w-[480px] flex justify-end">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="text-white border-t border-[#4068d3] bg-[#0573f0] w-full">
          <Navbar cart={quantity} />
        </div>
      </div>
    </header>
  );
};
