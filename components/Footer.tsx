import React from "react";
import Link from "next/link";
import { BrandLogo, EcgPulseLine } from "./BrandLogo";
import { Phone, MessageCircle, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-6 pb-3 sm:pt-7 sm:pb-4 border-t-4 border-[#007C89]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="space-y-2">
            <BrandLogo size="md" isDark />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Bringing high-standard, compassionate mobile and in-clinic primary healthcare,
              antenatal care, family planning, and immunisations to Nellmapius, Moreleta Park, and Pretoria East.
            </p>
            <div className="pt-0.5">
              <EcgPulseLine isDark />
            </div>
          </div>

          {/* Quick Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00A3AD]">
              Direct Contact
            </h4>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <p className="font-bold text-white uppercase tracking-wider">SR GRACE</p>
              <a
                href="tel:0790118464"
                className="flex items-center gap-2 hover:text-white transition-colors"
                title="Call Sr Grace"
              >
                <Phone className="w-3.5 h-3.5 text-[#00A3AD]" />
                079 011 8464 (Calls)
              </a>
              <a
                href="https://wa.me/27790118464"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                title="WhatsApp Sr Grace"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                079 011 8464 (WhatsApp)
              </a>
              <div className="flex items-start gap-2 pt-0.5 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-[#00A3AD] flex-shrink-0 mt-0.5" />
                <span>Nellmapius & Moreleta Park, Pretoria</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00A3AD]">
              Clinic Hours
            </h4>
            <div className="space-y-1 text-xs text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800 pb-0.5">
                <span>Monday – Friday:</span>
                <span className="font-bold text-white">08:00 – 17:00</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-0.5">
                <span>Saturday:</span>
                <span className="font-bold text-white">08:00 – 17:00</span>
              </div>
              <div className="flex justify-between text-[#00A3AD]">
                <span>Sunday & Holidays:</span>
                <span className="font-bold">By appointment</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 pt-0.5">
              Mobile home visits available across Pretoria East by reservation.
            </p>
          </div>

          {/* Key Services & Areas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00A3AD]">
              Coverage Areas
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/50">Nellmapius</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/50">Moreleta Park</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/50">Equestria</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/50">Silverlakes</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/50">Garsfontein</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/50">Faerie Glen</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Centered Copyright with Discreet 'admin' Letter Link */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <div className="w-12 hidden sm:block" /> {/* Balance spacer for true center */}
          <p className="text-center text-[11px] sm:text-xs">
            Copyright © 2024 Kenala Health Hub (Pty) Ltd. All rights reserved.
          </p>
          <div className="mt-1.5 sm:mt-0">
            <Link
              href="/admin/login"
              className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors lowercase tracking-wider select-none font-mono"
              title="Staff Access"
            >
              admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
