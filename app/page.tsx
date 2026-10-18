"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCard, ServiceItem } from "@/components/ServiceCard";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";
import { BookingModal } from "@/components/BookingModal";
import { SuccessModal } from "@/components/SuccessModal";
import { Footer } from "@/components/Footer";
import {
  Stethoscope,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function HomePage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isServicesExpanded, setIsServicesExpanded] = useState<boolean>(false);

  // Modals state
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch services on load
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        if (data.services) {
          setServices(data.services);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }
    loadServices();
  }, []);

  // Filter services by category
  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  // When 'All' is active, show only top 6 unless expanded
  const displayedServices =
    selectedCategory === "All" && !isServicesExpanded
      ? filteredServices.slice(0, 6)
      : filteredServices;

  const handleOpenDetailModal = (service: ServiceItem) => {
    setDetailService(service);
    setIsDetailModalOpen(true);
  };

  const handleOpenBookingModal = (service?: ServiceItem) => {
    if (service) {
      setBookingService(service);
    } else if (services.length > 0) {
      setBookingService(services[0]);
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (booking: any) => {
    setConfirmedBooking(booking);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-red-500 selection:text-white">
      {/* Navbar */}
      <Navbar onOpenBooking={() => handleOpenBookingModal()} />

      {/* Hero Section */}
      <HeroSection
        onOpenBooking={() => handleOpenBookingModal()}
        onExploreServices={() => {
          const el = document.getElementById("services-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Services Catalog Section */}
      <section id="services-section" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#B81D24] text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Our Clinical Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Comprehensive Healthcare at Your Fingertips
          </h2>
          <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
            Reserve your consultation or mobile nursing visit today. Every appointment requires only a{" "}
            <strong className="text-[#B81D24]">30% retainer deposit</strong> to lock in your slot, with the balance
            settled comfortably during your visit.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setIsServicesExpanded(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#111111] text-white shadow-md"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpenDetails={handleOpenDetailModal}
              onSelectForBooking={(s) => handleOpenBookingModal(s)}
            />
          ))}
        </div>

        {/* Expand / Collapse Button (Top 6 toggle on 'All') */}
        {selectedCategory === "All" && filteredServices.length > 6 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setIsServicesExpanded(!isServicesExpanded)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-zinc-900 bg-white border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 shadow-sm transition-all duration-200 active:scale-95 group"
            >
              <span>
                {isServicesExpanded
                  ? "Show Less"
                  : `See All (${filteredServices.length})`}
              </span>
              {isServicesExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#B81D24] transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#B81D24] transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </div>
        )}
      </section>

      {/* Feature Clinic Banner / Why Kenala Health Hub */}
      <section className="py-16 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111111] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8">
                <span className="text-xs font-extrabold tracking-widest text-[#E02830] uppercase">
                  CARE • COMPASSION • COMMUNITY
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
                  Why Families Across Pretoria East Choose Kenala Health Hub
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
                  Healthcare shouldn't feel rushed or intimidating. Sr Grace provides personalised attention,
                  rigorous clinical safety, and warm bedside manner whether you visit our Nellmapius clinic or
                  request mobile nursing in Equestria, Silverlakes, Garsfontein, and surrounding suburbs.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-[#B81D24] flex-shrink-0" />
                    <span className="text-xs font-medium text-zinc-200">Registered Professional Nurse</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-[#B81D24] flex-shrink-0" />
                    <span className="text-xs font-medium text-zinc-200">30% Retainer Slot Security</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-[#B81D24] flex-shrink-0" />
                    <span className="text-xs font-medium text-zinc-200">Instant PayFast Checkout</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-start lg:items-end">
                <button
                  onClick={() => handleOpenBookingModal()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white bg-[#B81D24] hover:bg-[#941319] shadow-lg shadow-red-600/30 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Appointment</span>
                </button>

                <a
                  href="https://wa.me/27790118464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-xs text-white bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Sr Grace</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ServiceDetailModal
        service={detailService}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookNow={(s) => handleOpenBookingModal(s)}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        services={services}
        preselectedService={bookingService}
        onBookingSuccess={handleBookingSuccess}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        booking={confirmedBooking}
      />
    </div>
  );
}
