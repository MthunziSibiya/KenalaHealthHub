"use client";

import React from "react";
import { EcgPulseLine } from "./BrandLogo";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export function HeroSection({ onOpenBooking, onExploreServices }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-zinc-50 to-zinc-100 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-zinc-200">
      {/* Decorative Red & Black Ambient Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-zinc-200/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.15]">
              Compassionate Healthcare,{" "}
              <span className="text-[#B81D24] relative inline-block">
                Tailored for You.
                <svg
                  className="absolute left-0 -bottom-2 w-full h-2.5 text-[#B81D24]/30"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0 10 Q50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Slogan with ECG Line */}
            <div className="mt-4 mb-6">
              <EcgPulseLine />
            </div>

            {/* Narrative description */}
            <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
              Led by <strong>Sr Grace</strong>, Kenala Health Hub provides reliable, professional primary healthcare,
              immunisations, family planning, antenatal care, and diagnostic wellness right in Nellmapius and to your home.
            </p>

            {/* Fast Benefit Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 mb-8 w-full max-w-lg">
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-[#B81D24] flex-shrink-0" />
                <span>30% Retainer (or full fee) via PayFast</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-[#B81D24] flex-shrink-0" />
                <span>Zero wait times & verified slot booking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-[#B81D24] flex-shrink-0" />
                <span>Immediate WhatsApp & Email booking notice</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-[#B81D24] flex-shrink-0" />
                <span>Experienced Registered Nurse & Midwife</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base text-white bg-[#B81D24] hover:bg-[#941319] shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all duration-200 active:scale-95 group"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>Book Appointment Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-base text-zinc-800 bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 shadow-sm transition-all duration-200"
              >
                <span>View All Services</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Impact Clinic & Practitioner Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200">
              
              {/* Red Curved Accent Top */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#B81D24] via-[#E02830] to-[#111111] rounded-t-3xl" />

              <div className="flex items-center gap-4 pb-6 border-b border-zinc-100">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#B81D24] flex-shrink-0 shadow-inner">
                  <Heart className="w-8 h-8 fill-[#B81D24] text-[#B81D24]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B81D24]">
                    Lead Practitioner
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900">Sr Grace</h3>
                  <p className="text-xs text-zinc-500">Registered Professional Nurse & Midwife</p>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="bg-zinc-50 rounded-2xl p-4 my-5 border border-zinc-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B81D24]" /> Operating Hours
                  </span>
                  <span className="text-emerald-600 font-bold">Open This Week</span>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday – Friday</span>
                    <span className="font-bold text-zinc-900">08:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday</span>
                    <span className="font-bold text-zinc-900">08:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between text-[#B81D24]">
                    <span className="font-medium">Sunday & Public Holidays</span>
                    <span className="font-bold">By appointment</span>
                  </div>
                </div>
              </div>

              {/* Clinic Location */}
              <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100/60 mb-5">
                <MapPin className="w-5 h-5 text-[#B81D24] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-900 block">Nellmapius Clinic Hub:</span>
                  <span className="text-zinc-600">Corner Love drive & Alwyn str, ext 4, Nellmapius</span>
                </div>
              </div>

              {/* Instant Contact Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:0795597208"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#B81D24]" />
                  Call 079 559 7208
                </a>
                <a
                  href="https://wa.me/27790118464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Sr Grace
                </a>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
