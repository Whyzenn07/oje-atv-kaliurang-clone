"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Harga", href: "#harga" },
  { label: "Booking", href: "#booking" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("#hero")}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shadow-md group-hover:bg-amber-400 transition-colors">
            <Zap className="w-5 h-5 text-gray-900 fill-current" />
          </div>
          <div className="leading-tight text-left">
            <span className="block text-white font-black text-sm tracking-wide">
              O.J.E ATV
            </span>
            <span className="block text-amber-400 font-semibold text-[10px] tracking-widest uppercase">
              Kaliurang
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://wa.me/6281226983990"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-amber-500/30"
            >
              Hubungi Kami
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-gray-900/98 backdrop-blur-md border-t border-white/10 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li className="pt-2 pb-1">
            <a
              href="https://wa.me/6281226983990"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl transition-colors"
            >
              Hubungi Kami via WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
