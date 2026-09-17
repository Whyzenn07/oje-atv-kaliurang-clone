"use client";

import { Phone, ArrowRight } from "lucide-react";
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
    <footer id="kontak" className="relative bg-[#2c282b] text-white pt-14 sm:pt-20 pb-8 border-t border-white/5">
      {/* Subtle top overlay vignette matching original site */}
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pb-12">
          {/* Column 1: Logo + description + social */}
          <div className="flex flex-col items-start">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#hero");
              }}
              className="inline-block mb-4 transition-transform hover:opacity-90"
              aria-label="OJE ATV Kaliurang Home"
            >
              <img
                src="/images/logos.png"
                alt="O.J.E ATV KALIURANG"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </a>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
              Jelajahi Hutan, Sungai mengunakan ATV Kaliurang bersama keluarga,
              teman, atau orang terkasih Anda.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@oje_atvkaliurang"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TIKTOK OJE ATV Kaliurang"
                className="w-10 h-10 rounded-full bg-[#171717] hover:bg-black border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow"
              >
                <TiktokIcon className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/oje_atvkaliurang/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram OJE ATV Kaliurang"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center border border-white/10 transition-all hover:scale-110 shadow-md"
              >
                <InstagramIcon className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Links Menu */}
          <div>
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-6 tracking-tight">
              Links Menu
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-[#e3851b] text-sm font-medium transition-colors group cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#e3851b] group-hover:translate-x-1 transition-all shrink-0" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: INFORMASI */}
          <div>
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-6 uppercase tracking-tight">
              INFORMASI
            </h3>

            {/* Address */}
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Kaliurang Timur, RT.05/RW15, Kaliurang, Hargobinangun, Kec.
              Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582
            </p>

            {/* Google Map link */}
            <a
              href="https://maps.app.goo.gl/q4Kcr7RGfrGbpnJR7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e3851b] hover:text-[#f59e0b] font-extrabold text-xs sm:text-sm tracking-wider uppercase inline-block mb-6 transition-colors hover:underline"
            >
              LINK GOOGLE MAP
            </a>

            {/* Contact Items Stack */}
            <div className="space-y-4">
              {/* Telpon */}
              <a
                href={`tel:${CONTACT.PHONE_HREF}`}
                className="flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 bg-[#e3851b] group-hover:bg-[#f59e0b] rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                    TELPON
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    {CONTACT.PHONE_DISPLAY}
                  </p>
                </div>
              </a>

              {/* Chat WhatsApp */}
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 bg-[#25D366] group-hover:bg-[#20ba59] rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-md">
                  <svg
                    className="w-5 h-5 text-white fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                    Chat WhatsApp
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    {CONTACT.PHONE_DISPLAY}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with divider */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://ojeatvkaliurang.com/"
              className="text-[#e3851b] font-bold hover:underline"
            >
              Oje ATV Kaliurang
            </a>{" "}
            All rights reserved By Gweb Engine
          </p>
        </div>
      </div>
    </footer>
  );
}
