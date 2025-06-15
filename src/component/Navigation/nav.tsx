"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Throttled scroll handler to prevent excessive re-renders
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest("nav")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: "/", label: "Guriga", labelEn: "Home", type: "route" },
    { href: "/menu", label: "Menu", labelEn: "Menu", type: "route" },
    {
      href: "/aboutus",
      label: "Ku saabsan",
      labelEn: "about us",
      type: "route",
    },
    {
      href: "/contactus",
      label: "Xiriir",
      labelEn: "Contact",
      type: "route",
    },
  ];

  const handleNavigation = async (item: { href: string; type: string }) => {
    if (isNavigating) return;

    setIsNavigating(true);

    try {
      // Close mobile menu first
      setIsMobileMenuOpen(false);

      if (item.type === "route") {
        // Handle page navigation
        window.location.href = item.href;
      } else if (item.type === "section") {
        // Handle section scrolling
        const element = document.querySelector(item.href);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }, 100);
        } else {
          console.warn(`Section ${item.href} not found on page`);
        }
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap");

        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .font-sans {
          font-family: "Inter", sans-serif;
        }

        .nav-enter {
          animation: navSlideDown 0.6s ease-out;
        }

        .hover-scale {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }

        .hover-lift {
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }

        @keyframes navSlideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .mobile-menu-enter {
          animation: mobileMenuSlide 0.3s ease-out;
        }

        @keyframes mobileMenuSlide {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 400px;
          }
        }

        .pulsing-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .underline-effect {
          position: relative;
        }

        .underline-effect::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: currentColor;
          transition: width 0.3s ease;
        }

        .underline-effect:hover::after {
          width: 100%;
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out nav-enter ${
          isScrolled
            ? isDark
              ? "bg-neutral-950/95 backdrop-blur-md shadow-2xl border-b border-amber-400/20"
              : "bg-stone-50/95 backdrop-blur-md shadow-2xl border-b border-amber-600/30"
            : isDark
            ? "bg-transparent"
            : "bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4 hover-scale">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="relative focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full"
                aria-label="Go to homepage"
              >
                <div
                  className={`w-14 h-14 rounded-full shadow-lg overflow-hidden border-2 transition-all duration-500 hover-scale ${
                    isDark ? "border-amber-400/40" : "border-amber-600/50"
                  }`}
                >
                  <img
                    src="/logo.jpeg"
                    alt="KCC Restaurant Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full pulsing-dot" />
              </button>
              <div className="flex flex-col">
                <span
                  className={`font-serif font-light text-xl tracking-wide transition-all duration-500 ${
                    isScrolled
                      ? isDark
                        ? "text-stone-100"
                        : "text-stone-900"
                      : isDark
                      ? "text-white"
                      : "text-stone-100"
                  }`}
                >
                  KCC Cafe, Restaurant and Hotel
                </span>
                <span
                  className={`font-sans text-xs font-light italic transition-all duration-500 ${
                    isScrolled
                      ? isDark
                        ? "text-stone-300/80"
                        : "text-stone-700/80"
                      : isDark
                      ? "text-amber-200/90"
                      : "text-stone-400"
                  }`}
                >
                  Qahwo & Cunto Soomaali
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item)}
                    disabled={isNavigating}
                    className={`relative px-4 py-2 text-sm font-light tracking-wide transition-all duration-500 group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg disabled:opacity-50 hover-lift ${
                      isScrolled
                        ? isDark
                          ? "text-stone-300 hover:text-amber-400"
                          : "text-stone-700 hover:text-amber-600"
                        : isDark
                        ? "text-white hover:text-amber-200"
                        : "text-stone-200 hover:text-amber-700"
                    }`}
                    aria-label={`Navigate to ${item.labelEn}`}
                  >
                    <span className="relative z-10 font-serif underline-effect">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs opacity-70 block italic transition-all duration-500 font-sans ${
                        isScrolled
                          ? isDark
                            ? "text-stone-400"
                            : "text-stone-600"
                          : isDark
                          ? "text-amber-100/80"
                          : "text-stone-400"
                      }`}
                    >
                      {item.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-400 hover-scale ${
                  isDark
                    ? "bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 shadow-lg"
                    : isScrolled
                    ? "bg-amber-600/20 text-amber-700 hover:bg-amber-600/30 shadow-lg"
                    : "bg-stone-800/20 text-stone-100 hover:bg-stone-800/30 shadow-md"
                }`}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                <div className="relative w-5 h-5">
                  {isDark ? (
                    <Sun className="w-5 h-5 transition-all duration-500 hover:rotate-180" />
                  ) : (
                    <Moon className="w-5 h-5 transition-all duration-500 hover:rotate-12" />
                  )}
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-3 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-400 hover-scale ${
                  isDark
                    ? "text-amber-400 hover:bg-amber-400/20"
                    : isScrolled
                    ? "text-amber-600 hover:bg-amber-600/20"
                    : "text-stone-800 hover:bg-stone-800/20"
                }`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-6 h-6">
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 transition-all duration-300 hover:rotate-90" />
                  ) : (
                    <Menu className="w-6 h-6 transition-all duration-300" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div
              className={`lg:hidden border-t overflow-hidden backdrop-blur-md mobile-menu-enter transition-all duration-500 ${
                isDark
                  ? "border-amber-400/20 bg-neutral-950/95"
                  : "border-amber-600/30 bg-stone-50/95"
              }`}
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item)}
                    disabled={isNavigating}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-light tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 hover-scale ${
                      isDark
                        ? "text-stone-300 hover:text-amber-400 hover:bg-amber-400/10"
                        : "text-stone-700 hover:text-amber-600 hover:bg-amber-600/10"
                    }`}
                    aria-label={`Navigate to ${item.labelEn}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif">{item.label}</span>
                      <span
                        className={`text-sm opacity-70 italic transition-all duration-500 font-sans ${
                          isDark ? "text-stone-400" : "text-stone-600"
                        }`}
                      >
                        {item.labelEn}
                      </span>
                    </div>
                  </button>
                ))}

                {/* Mobile Reserve Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full mt-6 px-6 py-3 rounded-full font-sans font-medium transition-all duration-500 hover-scale shadow-lg ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-stone-900 text-white hover:bg-amber-600"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-serif">Dalbo</span>
                    <span className="text-sm opacity-90 font-sans">
                      Reserve
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
