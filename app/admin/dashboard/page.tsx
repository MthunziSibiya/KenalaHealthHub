"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  LogOut,
  Phone,
  MessageCircle,
  MapPin,
  FileText,
  Edit2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [metrics, setMetrics] = useState<any>({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenueCollected: 0,
    totalPendingBalance: 0,
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "services">("bookings");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Service Edit Modal
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editRetainer, setEditRetainer] = useState<string>("");
  const [editActive, setEditActive] = useState<boolean>(true);

  // Selected Booking Details Modal
  const [viewBooking, setViewBooking] = useState<any | null>(null);

  const fetchMetricsAndBookings = async () => {
    setLoading(true);
    try {
      // Check auth
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/admin/login");
        return;
      }

      // Fetch metrics
      const metricsRes = await fetch("/api/admin/metrics");
      const metricsData = await metricsRes.json();
      if (metricsData.metrics) {
        setMetrics(metricsData.metrics);
      }

      // Fetch bookings
      const bookingsRes = await fetch(
        `/api/admin/bookings?status=${statusFilter}&q=${encodeURIComponent(searchQuery)}`
      );
      const bookingsData = await bookingsRes.json();
      if (bookingsData.bookings) {
        setBookings(bookingsData.bookings);
      }

      // Fetch services
      const servicesRes = await fetch("/api/admin/services");
      const servicesData = await servicesRes.json();
      if (servicesData.services) {
        setServices(servicesData.services);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsAndBookings();
  }, [statusFilter, searchQuery]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchMetricsAndBookings();
        if (viewBooking?.id === id) {
          setViewBooking((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleSaveServiceEdit = async () => {
    if (!editingService) return;
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingService.id,
          price: parseFloat(editPrice),
          retainerPercentage: parseFloat(editRetainer),
          isActive: editActive,
        }),
      });

      if (res.ok) {
        setEditingService(null);
        fetchMetricsAndBookings();
      }
    } catch (e) {
      console.error("Failed to update service:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-zinc-900 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-[#111111] text-white border-b-4 border-[#007C89] px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <BrandLogo size="sm" isDark />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-zinc-800 text-[11px] font-bold text-[#00A3AD] tracking-wider uppercase">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">Sr Grace</span>
              <span className="text-[10px] text-zinc-400">Registered Nurse & Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#007C89]" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Retainers Collected */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Paid Retainers (PayFast)
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-zinc-900 mt-2">
              R{metrics.totalRevenueCollected.toFixed(2)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Secured deposits across confirmed bookings
            </p>
          </div>

          {/* Card 2: Balances Pending */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Pending Visit Balances
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              R{metrics.totalPendingBalance.toFixed(2)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Due for in-person settlement upon arrival
            </p>
          </div>

          {/* Card 3: Total Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Total Appointments
              </span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-[#007C89] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-zinc-900 mt-2">
              {metrics.totalBookings}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              {metrics.confirmedBookings} confirmed, {metrics.completedBookings} completed
            </p>
          </div>

          {/* Card 4: Patients / Conversion */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Active Services
              </span>
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-zinc-900 mt-2">
              {services.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              30% default retainer across clinic catalog
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 pb-3">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "bookings"
                ? "bg-[#111111] text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Appointments & Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "services"
                ? "bg-[#111111] text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Clinical Services & 30% Retainer Editor
          </button>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
            {/* Filters & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {["ALL", "CONFIRMED", "PENDING_PAYMENT", "COMPLETED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? "bg-[#007C89] text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {st === "ALL" && "All"}
                    {st === "CONFIRMED" && "Confirmed (Paid)"}
                    {st === "PENDING_PAYMENT" && "Pending Payment"}
                    {st === "COMPLETED" && "Completed"}
                    {st === "CANCELLED" && "Cancelled"}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search ref, patient, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#007C89]"
                />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Patient & WhatsApp</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Date & Slot</th>
                    <th className="py-3 px-3">Paid via PayFast</th>
                    <th className="py-3 px-3">Balance Due</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-zinc-500">
                        No appointments found matching this filter.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#007C89]">
                          {b.referenceCode}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-zinc-900">{b.patientName}</div>
                          <div className="flex items-center gap-1.5 text-zinc-500 mt-0.5">
                            <a
                              href={`https://wa.me/${b.patientPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                            >
                              <MessageCircle className="w-3 h-3" />
                              {b.patientPhone}
                            </a>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-zinc-800">{b.service?.name}</span>
                          <span className="text-[10px] text-zinc-500 block">{b.area}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-zinc-900">{b.appointmentDate}</div>
                          <div className="text-zinc-500 text-[11px]">{b.timeSlot}</div>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">
                          R{b.amountPaid?.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-amber-600">
                          R{b.balanceDue?.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : b.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => setViewBooking(b)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                          >
                            View & Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING EDITOR */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Clinical Services Catalog & Retainer Policy
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Adjust treatment prices and mandatory retainer deposit percentage (30%).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#007C89]">
                      {s.category}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-900">{s.name}</h4>
                    <p className="text-xs text-zinc-600 line-clamp-2">{s.shortDescription}</p>

                    <div className="flex items-center gap-4 pt-2 text-xs">
                      <div>
                        <span className="text-zinc-500">Price: </span>
                        <strong className="text-zinc-900">R{s.price}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500">Deposit: </span>
                        <strong className="text-[#007C89]">
                          {s.retainerPercentage}% (R{Math.round(s.price * (s.retainerPercentage / 100))})
                        </strong>
                      </div>
                      <div>
                        <span className="text-zinc-500">Status: </span>
                        <span
                          className={`font-bold ${
                            s.isActive ? "text-emerald-600" : "text-zinc-400"
                          }`}
                        >
                          {s.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingService(s);
                      setEditPrice(s.price.toString());
                      setEditRetainer(s.retainerPercentage.toString());
                      setEditActive(s.isActive);
                    }}
                    className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4 text-[#007C89]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: VIEW & MANAGE BOOKING */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-[#111111] text-white p-6 border-b-4 border-[#007C89] flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">Appointment Management</span>
                <h3 className="text-xl font-bold font-mono text-[#00A3AD]">
                  {viewBooking.referenceCode}
                </h3>
              </div>
              <button
                onClick={() => setViewBooking(null)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Patient:</span>
                  <strong className="text-zinc-900">{viewBooking.patientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">WhatsApp Phone:</span>
                  <a
                    href={`https://wa.me/${viewBooking.patientPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {viewBooking.patientPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email:</span>
                  <strong className="text-zinc-900">{viewBooking.patientEmail}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Service:</span>
                  <strong className="text-zinc-900">{viewBooking.service?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Schedule:</span>
                  <strong className="text-zinc-900">
                    {viewBooking.appointmentDate} at {viewBooking.timeSlot}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <strong className="text-zinc-900">{viewBooking.patientAddress}, {viewBooking.area}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-200">
                  <span className="text-emerald-700 font-bold">Paid via PayFast:</span>
                  <span className="text-emerald-700 font-bold text-sm">
                    R{viewBooking.amountPaid?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#007C89] font-bold">
                  <span>Balance Due on Visit:</span>
                  <span>R{viewBooking.balanceDue?.toFixed(2)}</span>
                </div>
              </div>

              {viewBooking.medicalNotes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <strong className="text-amber-800 block mb-1">Patient Notes / Symptoms:</strong>
                  <p className="text-zinc-700">{viewBooking.medicalNotes}</p>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="pt-2">
                <span className="font-bold text-zinc-700 block mb-2">Update Appointment Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateBookingStatus(viewBooking.id, "CONFIRMED")}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                  >
                    Confirm (Paid)
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus(viewBooking.id, "COMPLETED")}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus(viewBooking.id, "CANCELLED")}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-red-100 hover:bg-red-200 text-red-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SERVICE PRICING */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-[#111111] text-white p-6 border-b-4 border-[#007C89] flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">Edit Clinical Service</span>
                <h3 className="text-lg font-bold text-white">{editingService.name}</h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Full Consultation Fee (ZAR)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-300 text-sm font-semibold bg-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Retainer Deposit Percentage (%)
                </label>
                <input
                  type="number"
                  value={editRetainer}
                  onChange={(e) => setEditRetainer(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-300 text-sm font-semibold bg-zinc-50"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Calculated Deposit: R
                  {Math.round(
                    (parseFloat(editPrice || "0") * parseFloat(editRetainer || "0")) / 100
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="w-4 h-4 text-[#007C89] rounded focus:ring-[#007C89]"
                />
                <label htmlFor="activeToggle" className="text-xs font-bold text-zinc-800">
                  Service is Active & Available for Booking
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveServiceEdit}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#007C89] hover:bg-[#005C66] shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-zinc-500 border-t border-zinc-200 bg-white">
        Kenala Health Hub Secure Admin Portal • JWT Authentication Active
      </footer>
    </div>
  );
}
