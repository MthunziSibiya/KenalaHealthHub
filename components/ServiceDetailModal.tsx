"use client";

import React from "react";
import { ServiceItem } from "./ServiceCard";
import { X, Clock, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (service: ServiceItem) => void;
}

export function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onBookNow,
}: ServiceDetailModalProps) {
  if (!isOpen || !service) return null;

  const retainerAmount = Math.round(service.price * (service.retainerPercentage / 100));
  const balanceDue = service.price - retainerAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Crimson Banner */}
        <div className="bg-[#111111] text-white p-6 border-b-4 border-[#B81D24] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E02830] px-2 py-0.5 rounded bg-red-950/60 inline-block mb-2">
            {service.category}
          </span>
          <h2 className="text-2xl font-extrabold text-white pr-8">
            {service.name}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#B81D24]" />
              Estimated Duration: {service.durationMinutes} Minutes
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B81D24]" />
              Administered by Sr Grace
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Detailed Clinical Scope */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Clinical Overview & What to Expect
            </h4>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {service.fullDescription || service.shortDescription}
            </p>
          </div>

          {/* Preparation Guidelines */}
          {service.prepInstructions && (
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#B81D24] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#941319] block mb-0.5">
                  Preparation Guidelines
                </span>
                <p className="text-xs text-zinc-700 leading-normal">
                  {service.prepInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Transparent Payment & Retainer Breakdown */}
          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">
              Fee & Retainer Breakdown
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-zinc-700">
                <span>Total Consultation / Treatment Fee:</span>
                <span className="font-bold text-zinc-900">R{service.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-red-50 text-[#B81D24] font-semibold border border-red-100">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Mandatory 30% Retainer (to secure slot):
                </span>
                <span className="font-extrabold text-sm sm:text-base">R{retainerAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-zinc-500 px-1 pt-1">
                <span>Remaining Balance (payable at appointment):</span>
                <span className="font-medium text-zinc-700">R{balanceDue.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 mt-3 italic">
              * Note: You will also have the option to settle the full 100% upfront via PayFast during booking if you prefer.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onBookNow(service);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#B81D24] hover:bg-[#941319] shadow-md transition-all active:scale-95"
          >
            <span>Proceed to Book This Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
