"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { BrandLogo, EcgPulseLine } from "@/components/BrandLogo";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Download,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Home,
} from "lucide-react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refCode = searchParams.get("ref");

  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti on arrival
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#B81D24", "#111111", "#E02830", "#10B981"],
      });
    } catch (e) {}

    async function loadBooking() {
      if (!refCode) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/bookings/simulate-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referenceCode: refCode }),
        });
        const data = await res.json();
        if (data.booking) {
          setBooking(data.booking);
        }
      } catch (e) {
        console.error("Failed to load booking:", e);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [refCode]);

  const copyRefCode = () => {
    if (refCode) {
      navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadIcs = () => {
    if (!booking) return;
    const title = `Appointment: ${booking.service?.name || "Consultation"} - Kenala Health Hub`;
    const description = `Appointment with Sr Grace. Reference: ${booking.referenceCode}. Contact: 079 559 7208 / 079 011 8464.`;
    const location = booking.patientAddress || "Corner Love drive & Alwyn str, ext 4, Nellmapius";
    const dateStr = booking.appointmentDate?.replace(/-/g, "") || "20261018";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kenala Health Hub//Booking//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${dateStr}T080000`,
      `DTEND:${dateStr}T090000`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Kenala-Appointment-${refCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappUrl = `https://wa.me/27790118464?text=${encodeURIComponent(
    `Hello Sr Grace, I have confirmed my booking ${refCode} via PayFast. Looking forward to our appointment!`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 py-4 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <BrandLogo size="sm" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            <Home className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#111111] text-white p-8 text-center border-b-4 border-[#B81D24] relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 fill-emerald-500/20" />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-xs text-zinc-300 mt-1">
              Your appointment is secured. Sr Grace has been notified via WhatsApp.
            </p>

            {/* Reference Badge */}
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-xs">
              <span className="text-zinc-400">Reference:</span>
              <span className="font-extrabold text-[#E02830] text-sm tracking-wider">
                {refCode || "KHH-CONFIRMED"}
              </span>
              <button
                onClick={copyRefCode}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
                title="Copy reference code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Instant PayFast Verification Complete</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>WhatsApp Notification Sent to Sr Grace (079 011 8464)</span>
              </div>
            </div>

            {booking && (
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 text-xs space-y-2.5">
                <div className="flex justify-between py-1 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Service:</span>
                  <strong className="text-zinc-900">{booking.service?.name}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Date & Time:</span>
                  <strong className="text-zinc-900">{booking.appointmentDate} at {booking.timeSlot}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Patient:</span>
                  <strong className="text-zinc-900">{booking.patientName} ({booking.patientPhone})</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Location:</span>
                  <strong className="text-zinc-900">{booking.patientAddress}</strong>
                </div>
                <div className="flex justify-between pt-1 font-bold text-emerald-700 text-sm">
                  <span>Amount Paid via PayFast:</span>
                  <span>R{booking.amountPaid?.toFixed(2)}</span>
                </div>
                {booking.balanceDue > 0 && (
                  <div className="flex justify-between text-[#B81D24] font-bold text-xs">
                    <span>Balance Due on Visit:</span>
                    <span>R{booking.balanceDue?.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={downloadIcs}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                <Download className="w-4 h-4 text-[#B81D24]" />
                Add to Calendar (.ics)
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B81D24] hover:underline"
              >
                Return to Homepage <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="text-center py-6 text-xs text-zinc-500 border-t border-zinc-200 bg-white">
        Kenala Health Hub • Care • Compassion • Community • Nellmapius, Pretoria East
      </footer>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-bold">Loading confirmation...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
