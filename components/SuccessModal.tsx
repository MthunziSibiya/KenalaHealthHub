"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Download,
  Copy,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export function SuccessModal({ isOpen, onClose, booking }: SuccessModalProps) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst with FNB Blue & Emerald
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#007C89", "#111111", "#00A3AD", "#10B981"],
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const copyRefCode = () => {
    if (booking.referenceCode) {
      navigator.clipboard.writeText(booking.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCalendarFile = () => {
    const title = `Appointment with Sr Grace (${booking.service?.name || "Consultation"})`;
    const description = `Kenala Health Hub Appointment. Reference: ${booking.referenceCode}. Address: ${booking.patientAddress || "Nellmapius Clinic Hub"}. Contact: 079 011 8464.`;
    const location = booking.patientAddress || "Nellmapius Clinic Hub, Pretoria";

    // Format iCalendar date
    const dateStr = booking.appointmentDate?.replace(/-/g, "") || "20261021";
    const startTime = "T080000";
    const endTime = "T090000";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kenala Health Hub//Booking//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${dateStr}${startTime}`,
      `DTEND:${dateStr}${endTime}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Appointment-${booking.referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappUrl = `https://wa.me/27790118464?text=${encodeURIComponent(
    `Hello Sr Grace, I have confirmed booking ${booking.referenceCode} for ${booking.service?.name || "healthcare appointment"} on ${booking.appointmentDate} at ${booking.timeSlot}. Looking forward to the appointment!`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Celebration Header (FNB Blue Accent) */}
        <div className="bg-[#111111] text-white p-6 sm:p-8 text-center border-b-4 border-[#007C89] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Green Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 fill-emerald-500/20" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-zinc-300 mt-1">
            Your appointment has been successfully reserved with Sr Grace.
          </p>

          {/* Reference Code Pill */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-zinc-800/90 border border-zinc-700 text-xs">
            <span className="text-zinc-400 font-medium">Booking Ref:</span>
            <span className="font-extrabold text-[#00A3AD] tracking-wider text-sm">
              {booking.referenceCode}
            </span>
            <button
              onClick={copyRefCode}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="Copy Reference"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Dispatch Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Direct WhatsApp Alert Dispatched to Sr Grace (079 011 8464)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#007C89]" />
              <span>Confirmation Email Sent to {booking.patientEmail || "Patient"}</span>
            </div>
          </div>

          {/* Summary Details */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60">
              <span className="text-zinc-500 font-medium">Clinical Service:</span>
              <strong className="text-zinc-900">{booking.service?.name || "Consultation"}</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60">
              <span className="text-zinc-500 font-medium">Date & Time:</span>
              <strong className="text-zinc-900">{booking.appointmentDate} at {booking.timeSlot}</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60">
              <span className="text-zinc-500 font-medium">Patient:</span>
              <strong className="text-zinc-900">{booking.patientName} ({booking.patientPhone})</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60">
              <span className="text-zinc-500 font-medium">Location:</span>
              <strong className="text-zinc-900">{booking.patientAddress || "Clinic Hub, Nellmapius"}</strong>
            </div>
            <div className="flex justify-between items-center pt-1 font-bold">
              <span className="text-emerald-700">Amount Paid via PayFast:</span>
              <span className="text-emerald-700 text-sm">R{booking.amountPaid?.toFixed(2) || "0.00"}</span>
            </div>
            {booking.balanceDue > 0 && (
              <div className="flex justify-between items-center text-[#007C89] font-bold">
                <span>Remaining Balance (on visit):</span>
                <span>R{booking.balanceDue?.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={downloadCalendarFile}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <Download className="w-4 h-4 text-[#007C89]" />
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
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-xs font-bold text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            Close & Return to Home
          </button>
        </div>

      </div>
    </div>
  );
}
