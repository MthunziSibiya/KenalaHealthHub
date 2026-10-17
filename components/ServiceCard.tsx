"use client";

import React from "react";
import {
  Syringe,
  Users,
  Baby,
  Briefcase,
  ShieldCheck,
  Droplet,
  Stethoscope,
  Activity,
  HeartPulse,
  Heart,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  retainerPercentage: number;
  durationMinutes: number;
  icon: string;
  prepInstructions?: string | null;
  isActive: boolean;
}

interface ServiceCardProps {
  service: ServiceItem;
  onOpenDetails: (service: ServiceItem) => void;
  onSelectForBooking: (service: ServiceItem) => void;
}

export function ServiceCard({
  service,
  onOpenDetails,
  onSelectForBooking,
}: ServiceCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "syringe":
        return <Syringe className="w-6 h-6" />;
      case "users":
        return <Users className="w-6 h-6" />;
      case "baby":
        return <Baby className="w-6 h-6" />;
      case "briefcase":
        return <Briefcase className="w-6 h-6" />;
      case "shield-check":
        return <ShieldCheck className="w-6 h-6" />;
      case "droplet":
        return <Droplet className="w-6 h-6" />;
      case "activity":
        return <Activity className="w-6 h-6" />;
      case "heart-pulse":
        return <HeartPulse className="w-6 h-6" />;
      case "heart":
        return <Heart className="w-6 h-6" />;
      default:
        return <Stethoscope className="w-6 h-6" />;
    }
  };

  const retainerAmount = Math.round(service.price * (service.retainerPercentage / 100));

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300">
      <div>
        {/* Category & Duration */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700">
            {service.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            {service.durationMinutes} mins
          </span>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#B81D24] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B81D24] group-hover:text-white transition-colors duration-300">
            {getIcon(service.icon)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900 group-hover:text-[#B81D24] transition-colors leading-snug">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mb-5">
          {service.shortDescription}
        </p>
      </div>

      {/* Pricing & CTA Actions */}
      <div className="pt-4 border-t border-zinc-100">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-zinc-500 block">Full Treatment</span>
            <span className="text-xl font-extrabold text-zinc-900">
              R{service.price.toFixed(0)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-[#B81D24] uppercase tracking-wider block">
              30% Deposit to Book
            </span>
            <span className="text-sm font-extrabold text-[#B81D24]">
              R{retainerAmount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenDetails(service)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            Details
          </button>

          <button
            onClick={() => onSelectForBooking(service)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#B81D24] hover:bg-[#941319] transition-colors shadow-sm"
          >
            Book Slot
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
