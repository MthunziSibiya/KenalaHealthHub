import React from "react";
import Link from "next/link";
import { BrandLogo, EcgPulseLine } from "./BrandLogo";
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-14 pb-8 border-t-4 border-[#B81D24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <BrandLogo size="md" className="brightness-125" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bringing high-standard, compassionate mobile and in-clinic primary healthcare,
              antenatal care, family planning, and immunisations to Nellmapius and Pretoria East.
            </p>
            <div className="pt-2">
              <EcgPulseLine />
            </div>
          </div>

          {/* Quick Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E02830]">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <p className="font-semibold text-white">Sister In Charge: Sr Grace</p>
              <a
                href="tel:0795597208"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B81D24]" />
                079 559 7208 (Calls)
              </a>
              <a
                href="https://wa.me/27790118464"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                079 011 8464 (WhatsApp)
              </a>
              <div className="flex items-start gap-2 pt-1 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-[#B81D24] flex-shrink-0 mt-0.5" />
                <span>Corner Love drive & Alwyn str, ext 4, Nellmapius</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E02830]">
              Clinic Hours
            </h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span>Monday – Friday:</span>
                <span className="font-bold text-white">08:00 – 17:00</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span>Saturday:</span>
                <span className="font-bold text-white">08:00 – 17:00</span>
              </div>
              <div className="flex justify-between text-[#E02830]">
                <span>Sunday & Holidays:</span>
                <span className="font-bold">By appointment</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 pt-1">
              Mobile home visits available across Pretoria East by reservation.
            </p>
          </div>

          {/* Key Services & Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E02830]">
              Coverage Areas
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-400">
              <span className="px-2 py-1 rounded bg-zinc-800">Nellmapius</span>
              <span className="px-2 py-1 rounded bg-zinc-800">Equestria</span>
              <span className="px-2 py-1 rounded bg-zinc-800">Silverlakes</span>
              <span className="px-2 py-1 rounded bg-zinc-800">Garsfontein</span>
              <span className="px-2 py-1 rounded bg-zinc-800">Faerie Glen</span>
              <span className="px-2 py-1 rounded bg-zinc-800">Moreleta Park</span>
            </div>
            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#B81D24]" />
                Admin Dashboard & JWT Access
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Kenala Health Hub (Pty) Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-[#B81D24] fill-[#B81D24]" /> for South African Healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
}
