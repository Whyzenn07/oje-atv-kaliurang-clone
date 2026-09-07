"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { CONTACT, WA_ORDER_LINK } from "@/lib/constants";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Profil", href: "#profil" },
  { label: "Harga", href: "#harga" },
  { label: "Gallery", href: "#gallery" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "profil", "harga", "gallery", "kontak"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on ESC or window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: href === "#hero" ? 0 : offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[#1c1c1c]/95 backdrop-blur-md shadow-xl py-2.5 sm:py-3"
          : "bg-transparent py-3 sm:py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2 sm:gap-3 shrink-0 text-left focus:outline-none"
        >
          <img
            src="/images/logos.png"
            alt="OJE ATV Kaliurang"
            className="h-9 sm:h-12 md:h-14 w-auto object-contain drop-shadow"
          />
        </button>

        {/* Center: Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive =
              (link.href === "#hero" && activeSection === "hero") ||
              link.href === `#${activeSection}`;

            return (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className={`text-sm lg:text-base font-bold transition-colors duration-200 drop-shadow ${
                    isActive
                      ? "text-[#f6a440]"
                      : "text-white hover:text-[#f6a440]"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right: Desktop Call Us Button */}
        <div className="hidden md:flex items-center gap-3 group">
          <a
            href={`tel:${CONTACT.PHONE_HREF}`}
            className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#f6a440] hover:bg-[#e0912f] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 shrink-0 call-pulse phone-ring-hover"
            aria-label="Telepon OJE ATV Kaliurang"
          >
            <Phone className="w-5 h-5 fill-white text-white transition-transform group-hover:rotate-12" />
          </a>
          <div className="text-left text-white drop-shadow">
            <div className="text-[10px] lg:text-[11px] font-medium text-white/90 leading-tight">
              Call us now:
            </div>
            <a
              href={`tel:${CONTACT.PHONE_HREF}`}
              className="font-extrabold text-sm lg:text-base tracking-wide hover:text-[#f6a440] transition-colors"
            >
              {CONTACT.PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* Mobile Right: Phone Button + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={`tel:${CONTACT.PHONE_HREF}`}
            className="w-10 h-10 rounded-full bg-[#f6a440] active:scale-95 text-white flex items-center justify-center shadow call-pulse phone-ring-hover"
            aria-label="Telepon"
          >
            <Phone className="w-4 h-4 fill-white" />
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/20 text-white flex items-center justify-center focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown with smooth accordion */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100 mt-2 border-t border-white/10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-[#1c1c1c]/98 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive =
              (link.href === "#hero" && activeSection === "hero") ||
              link.href === `#${activeSection}`;

            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`w-full text-left font-bold text-base py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-white/10 text-[#f6a440]"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#f6a440]" />}
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 mt-2">
            <a
              href={WA_ORDER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#b51b41] active:bg-[#8b1626] text-white font-extrabold rounded-xl text-sm shadow-md"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
