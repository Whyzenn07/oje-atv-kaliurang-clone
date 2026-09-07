"use client";

import { Phone, MessageCircle, MapPin } from "lucide-react";
import { TiktokIcon, InstagramIcon } from "./SocialIcons";
import { CONTACT, WA_LINK } from "@/lib/constants";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Harga", href: "#harga" },
  { label: "Gallery", href: "#gallery" },
  { label: "Kontak", href: "#kontak" },
];

export default function FooterSection() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="kontak" className="bg-[#2d2d2d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Logo + description + social */}
          <div>
            <div className="mb-5">
              <img
                src="/images/logos.png"
                alt="OJE ATV Kaliurang Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              <p className="font-extrabold text-xl tracking-wide uppercase text-white mt-3">
                OJE ATV KALIURANG
              </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga,
              teman, atau orang terkasih Anda.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="https://www.tiktok.com/@oje_atvkaliurang"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok OJE ATV Kaliurang"
                className="w-10 h-10 bg-black/60 hover:bg-black rounded-full flex items-center justify-center border border-white/20 transition-transform hover:scale-110 shadow"
              >
                <TiktokIcon className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/oje_atvkaliurang/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram OJE ATV Kaliurang"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center border border-white/20 transition-transform hover:scale-110 shadow"
              >
                <InstagramIcon className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Links Menu */}
          <div>
            <h3 className="font-black text-xl mb-6 text-white tracking-wide">
              Links Menu
            </h3>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-amber-400 text-sm font-semibold transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-[#b51b41] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Informasi (address + contact) */}
          <div>
            <h3 className="font-black text-xl mb-6 text-white tracking-wide">
              INFORMASI
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <p className="text-gray-300 text-sm leading-relaxed">
                Kaliurang Timur, RT.05/RW15, Kaliurang, Hargobinangun, Kec.
                Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582
              </p>
            </div>

            {/* Google Map link */}
            <a
              href="https://maps.app.goo.gl/q4Kcr7RGfrGbpnJR7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 font-extrabold text-xs tracking-wider uppercase hover:underline inline-block mb-6"
            >
              ➔ LINK GOOGLE MAP
            </a>

            {/* Telpon */}
            <a
              href={`tel:${CONTACT.PHONE_HREF}`}
              className="flex items-center gap-3.5 mb-4 group"
            >
              <div className="w-10 h-10 bg-[#b51b41] group-hover:bg-[#8b1626] rounded-full flex items-center justify-center shrink-0 transition-colors shadow">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                  TELPON
                </p>
                <p className="text-white font-extrabold text-sm">
                  {CONTACT.PHONE_DISPLAY}
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 bg-green-500 group-hover:bg-green-400 rounded-full flex items-center justify-center shrink-0 transition-colors shadow">
                <MessageCircle className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                  Chat WhatsApp
                </p>
                <p className="text-white font-extrabold text-sm">
                  {CONTACT.PHONE_DISPLAY}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 bg-[#242424]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            Copyright &copy; 2023{" "}
            <span className="text-amber-400 font-extrabold">
              Oje ATV Kaliurang
            </span>{" "}
            All rights reserved By Gweb Engine
          </p>
        </div>
      </div>
    </footer>
  );
}
