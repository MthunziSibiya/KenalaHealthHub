"use client";

import React, { useState, useEffect } from "react";
import { ServiceItem } from "./ServiceCard";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  preselectedService?: ServiceItem | null;
  onBookingSuccess: (bookingData: any) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  services,
  preselectedService,
  onBookingSuccess,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("09:00 - 09:45");
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [patientAddress, setPatientAddress] = useState<string>("");
  const [area, setArea] = useState<string>("Nellmapius");
  const [medicalNotes, setMedicalNotes] = useState<string>("");
  const [paymentChoice, setPaymentChoice] = useState<"RETAINER_30" | "FULL_100">("RETAINER_30");

  // Errors & Shake state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakingField, setShakingField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time slots available (08:00 - 17:00)
  const timeSlots = [
    "08:00 - 08:45",
    "09:00 - 09:45",
    "10:00 - 10:45",
    "11:00 - 11:45",
    "12:00 - 12:45",
    "13:00 - 13:45",
    "14:00 - 14:45",
    "15:00 - 15:45",
    "16:00 - 16:45",
  ];

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setAppointmentDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Sync preselected service
  useEffect(() => {
    if (preselectedService) {
      setSelectedServiceId(preselectedService.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [preselectedService, services]);

  if (!isOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const totalAmount = currentService ? currentService.price : 450;
  const retainerAmount = Math.round(totalAmount * ((currentService?.retainerPercentage || 30) / 100));
  const amountToPayNow = paymentChoice === "FULL_100" ? totalAmount : retainerAmount;
  const balanceDueLater = paymentChoice === "FULL_100" ? 0 : totalAmount - retainerAmount;

  const triggerShake = (fieldName: string, message: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
    setShakingField(fieldName);
    setTimeout(() => {
      setShakingField(null);
    }, 500);
  };

  const handleStep1Next = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedServiceId) newErrors.service = "Please choose a clinical service";
    if (!appointmentDate) newErrors.date = "Please pick an appointment date";
    if (!timeSlot) newErrors.timeSlot = "Please choose a time slot";

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      triggerShake(firstKey, newErrors[firstKey]);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleStep2Next = () => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) newErrors.patientName = "Please enter the patient's full name";
    if (!patientPhone.trim() || patientPhone.trim().length < 9)
      newErrors.patientPhone = "Please enter a valid South African phone number";
    if (!patientEmail.trim() || !patientEmail.includes("@"))
      newErrors.patientEmail = "Please enter a valid email address for your confirmation";
    if (!patientAddress.trim())
      newErrors.patientAddress = "Please provide your street address / location";

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      triggerShake(firstKey, newErrors[firstKey]);
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          patientName,
          patientPhone,
          patientEmail,
          patientAddress,
          area,
          appointmentDate,
          timeSlot,
          paymentChoice,
          medicalNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      // If in dev/sandbox, we simulate the PayFast confirmation so the user experiences the immediate success modal
      // We also provide the option to submit the PayFast form directly
      const simRes = await fetch("/api/bookings/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode: data.booking.referenceCode }),
      });

      const simData = await simRes.json();
      setIsSubmitting(false);
      onClose();
      onBookingSuccess(simData.booking || data.booking);
    } catch (err: any) {
      setIsSubmitting(false);
      triggerShake("submit", err.message || "Failed to process booking");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#111111] text-white p-6 border-b-4 border-[#B81D24] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E02830] px-2 py-0.5 rounded bg-red-950/60 inline-block mb-1">
            Step {step} of 3
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            {step === 1 && "Select Service & Schedule"}
            {step === 2 && "Patient Contact & Location"}
            {step === 3 && "Payment & Slot Confirmation"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Care • Compassion • Community — Sr Grace (079 011 8464)
          </p>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className={`h-1.5 rounded-full ${step >= 1 ? "bg-[#B81D24]" : "bg-zinc-700"}`} />
            <div className={`h-1.5 rounded-full ${step >= 2 ? "bg-[#B81D24]" : "bg-zinc-700"}`} />
            <div className={`h-1.5 rounded-full ${step >= 3 ? "bg-[#B81D24]" : "bg-zinc-700"}`} />
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">

          {/* STEP 1: SERVICE & SCHEDULE */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Service Select */}
              <div className={`${shakingField === "service" ? "animate-shake" : ""}`}>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Clinical Service *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className={`w-full p-3.5 rounded-xl border text-sm font-semibold bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                    errors.service ? "border-red-500 bg-red-50" : "border-zinc-300"
                  }`}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Full Fee: R{s.price} (30% Deposit: R{Math.round(s.price * 0.3)})
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {errors.service}
                  </p>
                )}
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className={`${shakingField === "date" ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className={`w-full p-3.5 rounded-xl border text-sm font-medium bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                        errors.date ? "border-red-500 bg-red-50" : "border-zinc-300"
                      }`}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errors.date}
                    </p>
                  )}
                </div>

                {/* Time Slot Picker */}
                <div className={`${shakingField === "timeSlot" ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className={`w-full p-3.5 rounded-xl border text-sm font-medium bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                      errors.timeSlot ? "border-red-500 bg-red-50" : "border-zinc-300"
                    }`}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Price Summary Pill */}
              {currentService && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-500 block">Selected Consultation:</span>
                    <strong className="text-sm text-zinc-900">{currentService.name}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block">Total Fee: R{currentService.price}</span>
                    <span className="font-bold text-[#B81D24]">30% Deposit: R{retainerAmount}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PATIENT CONTACT & LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Full Name */}
              <div className={`${shakingField === "patientName" ? "animate-shake" : ""}`}>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="e.g. Lerato Khumalo"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                      errors.patientName ? "border-red-500 bg-red-50" : "border-zinc-300"
                    }`}
                  />
                </div>
                {errors.patientName && (
                  <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {errors.patientName}
                  </p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`${shakingField === "patientPhone" ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 079 559 7208"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                        errors.patientPhone ? "border-red-500 bg-red-50" : "border-zinc-300"
                      }`}
                    />
                  </div>
                  {errors.patientPhone && (
                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errors.patientPhone}
                    </p>
                  )}
                </div>

                <div className={`${shakingField === "patientEmail" ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      placeholder="e.g. name@example.co.za"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                        errors.patientEmail ? "border-red-500 bg-red-50" : "border-zinc-300"
                      }`}
                    />
                  </div>
                  {errors.patientEmail && (
                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errors.patientEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Area & Physical Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-300 text-sm bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#B81D24]"
                  >
                    <option value="Nellmapius">Nellmapius</option>
                    <option value="Equestria">Equestria</option>
                    <option value="Silverlakes">Silverlakes</option>
                    <option value="Garsfontein">Garsfontein</option>
                    <option value="Faerie Glen">Faerie Glen</option>
                    <option value="Moreleta Park">Moreleta Park</option>
                    <option value="Pretoria East (Other)">Pretoria East (Other)</option>
                  </select>
                </div>

                <div className={`sm:col-span-2 ${shakingField === "patientAddress" ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Physical Address / Clinic Visit Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="e.g. Corner Love drive & Alwyn str, ext 4"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#B81D24] ${
                        errors.patientAddress ? "border-red-500 bg-red-50" : "border-zinc-300"
                      }`}
                    />
                  </div>
                  {errors.patientAddress && (
                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errors.patientAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Medical Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Medical Notes or Symptoms (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                  <textarea
                    rows={2}
                    placeholder="Briefly describe any current symptoms, allergies, or questions for Sr Grace..."
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#B81D24]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & PAYMENT SELECTION */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Appointment Summary Box */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">Service:</span>
                  <span className="font-bold text-zinc-900">{currentService?.name}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">Date & Slot:</span>
                  <span className="font-bold text-zinc-900">{appointmentDate} at {timeSlot}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">Patient:</span>
                  <span className="font-bold text-zinc-900">{patientName} ({patientPhone})</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">Location:</span>
                  <span className="font-bold text-zinc-900">{patientAddress}, {area}</span>
                </div>
              </div>

              {/* Payment Choice Options (User Request: 30% Retainer vs 100% Full Payment) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Select Payment Option *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: 30% Retainer Deposit */}
                  <div
                    onClick={() => setPaymentChoice("RETAINER_30")}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      paymentChoice === "RETAINER_30"
                        ? "border-[#B81D24] bg-red-50/50 shadow-md"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B81D24]">
                        30% Mandatory Deposit
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentChoice === "RETAINER_30"
                            ? "border-[#B81D24] bg-[#B81D24]"
                            : "border-zinc-400"
                        }`}
                      >
                        {paymentChoice === "RETAINER_30" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div className="text-xl font-extrabold text-zinc-900">
                      R{retainerAmount.toFixed(2)}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                      Secures your appointment slot immediately. Balance of R{(totalAmount - retainerAmount).toFixed(2)} payable at visit.
                    </p>
                  </div>

                  {/* Option 2: 100% Full Payment */}
                  <div
                    onClick={() => setPaymentChoice("FULL_100")}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      paymentChoice === "FULL_100"
                        ? "border-[#B81D24] bg-red-50/50 shadow-md"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Full Settle Upfront (100%)
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentChoice === "FULL_100"
                            ? "border-[#B81D24] bg-[#B81D24]"
                            : "border-zinc-400"
                        }`}
                      >
                        {paymentChoice === "FULL_100" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div className="text-xl font-extrabold text-zinc-900">
                      R{totalAmount.toFixed(2)}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                      Pay the complete consultation fee now. Zero payment required during your appointment.
                    </p>
                  </div>
                </div>
              </div>

              {/* PayFast Trust Badge & Breakdown */}
              <div className="bg-zinc-900 text-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                    Amount to process via PayFast:
                  </span>
                  <span className="text-2xl font-black text-white">
                    R{amountToPayNow.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    {paymentChoice === "FULL_100" ? "Fully Settled" : `Balance Due on Visit: R${balanceDueLater.toFixed(2)}`}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Encrypted via PayFast ZA
                  </span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {errors.submit}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleStep1Next}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#B81D24] hover:bg-[#941319] shadow-md transition-all active:scale-95"
            >
              <span>Continue to Contact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleStep2Next}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#B81D24] hover:bg-[#941319] shadow-md transition-all active:scale-95"
            >
              <span>Review & Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSubmitBooking}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold text-white bg-[#B81D24] hover:bg-[#941319] shadow-lg shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Booking...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with PayFast (R{amountToPayNow.toFixed(2)})</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
