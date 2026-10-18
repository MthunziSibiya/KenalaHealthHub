"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Phone, MessageCircle, Clock, MapPin, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenBooking?: () => void;
}

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm transition-all duration-200">
      {/* Top Banner (Hours & Location notice) */}
      <div className="bg-[#111111] text-white text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-zinc-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#B81D24]" />
              Mon – Sat: 08:00 – 17:00 | Sun: By appointment
            </span>
            <span className="text-zinc-500">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-[#B81D24] flex-shrink-0" />
              Corner Love drive & Alwyn str, ext 4, Nellmapius
            </span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span>Nellmapius • Pretoria East</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center focus:outline-none">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Sister In Charge: Sr Grace
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <a
                  href="tel:0795597208"
                  className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 hover:text-[#B81D24] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B81D24]" />
                  079 559 7208
                </a>
                <span className="text-zinc-300">|</span>
                <a
                  href="https://wa.me/27790118464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  079 011 8464
                </a>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm text-white bg-[#B81D24] hover:bg-[#941319] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3.5 py-2 rounded-full font-bold text-xs text-white bg-[#B81D24] hover:bg-[#941319] transition-all"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-900 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
            <span className="text-xs font-semibold text-zinc-500 uppercase">Direct Contact:</span>
            <a
              href="tel:0795597208"
              className="flex items-center gap-2 text-sm font-bold text-zinc-800"
            >
              <Phone className="w-4 h-4 text-[#B81D24]" />
              Call: 079 559 7208
            </a>
            <a
              href="https://wa.me/27790118464"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-emerald-600"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: 079 011 8464
            </a>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#B81D24] flex-shrink-0" />
              Corner Love drive & Alwyn str, ext 4, Nellmapius
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <Clock className="w-3.5 h-3.5 text-[#B81D24] flex-shrink-0" />
              Mon – Sat: 08:00 – 17:00
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
