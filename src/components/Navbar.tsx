"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Rooms", href: "/#rooms" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Location", href: "/#location" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200"
            : "bg-white/80 backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            <Link
              href="/"
              onClick={closeMenu}
              className="flex flex-col leading-tight group"
              aria-label="Evergreen Ridge Resort — home"
            >
              <span
                className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--color-forest-500)" }}
              >
                U-Go Mountain Resort
              </span>
              <span
                className="text-xl font-bold tracking-tight transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-forest-900)",
                }}
              >
                Home &amp; Retreat
              </span>
            </Link>

            <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md group"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  <span
                    className="absolute bottom-0 left-3 right-3 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    style={{ backgroundColor: "var(--color-forest-500)" }}
                  />
                  <span
                    className="group-hover:text-inherit transition-colors duration-200"
                    style={
                      {
                        "--tw-hover-color": "var(--color-forest-700)",
                      } as React.CSSProperties
                    }
                  >
                    {label}
                  </span>
                </Link>
              ))}

              <a
                href="/#booking"
                className="ml-4 inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-800))",
                  boxShadow: "0 1px 3px 0 rgba(26,48,32,0.35)",
                  ["--tw-ring-color" as any]: "var(--color-forest-500)",
                }}
              >
                Book Now
              </a>
            </nav>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={toggleMenu}
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-md transition-colors duration-150 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2"
              style={
                {
                  ["--tw-ring-color" as any]: "var(--color-forest-500)",
                } as React.CSSProperties
              }
            >

              <span
                className={[
                  "block w-5 h-0.5 rounded-full transition-all duration-300",
                  menuOpen ? "translate-y-1.5 rotate-45" : "",
                ].join(" ")}
                style={{ backgroundColor: "var(--color-forest-900)" }}
              />
              <span
                className={[
                  "block w-5 h-0.5 rounded-full my-1 transition-all duration-300",
                  menuOpen ? "opacity-0 scale-x-0" : "",
                ].join(" ")}
                style={{ backgroundColor: "var(--color-forest-900)" }}
              />
              <span
                className={[
                  "block w-5 h-0.5 rounded-full transition-all duration-300",
                  menuOpen ? "-translate-y-1.5 -rotate-45" : "",
                ].join(" ")}
                style={{ backgroundColor: "var(--color-forest-900)" }}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={[
          "fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-300",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />

        <div
          className={[
            "relative mt-16 mx-4 rounded-xl border shadow-xl transition-all duration-300",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
          ].join(" ")}
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={closeMenu}
                className="px-5 py-4 text-sm font-medium transition-colors duration-150 hover:bg-stone-50 first:rounded-t-xl"
                style={{ color: "var(--color-stone-800)" }}
              >
                {label}
              </Link>
            ))}

            <div className="p-4 rounded-b-xl">
              <a
                href="/#booking"
                onClick={closeMenu}
                className="flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-800))",
                }}
              >
                Book Now
              </a>
            </div>
          </nav>
        </div>
      </div>
      <div className="h-16 lg:h-18" aria-hidden="true" />
    </>
  );
}
