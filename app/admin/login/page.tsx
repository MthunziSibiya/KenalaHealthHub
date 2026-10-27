"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@kenalahealthhub.co.za");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Trigger red shake animation on password box!
        setIsShaking(true);
        setErrorMsg(data.error || "Incorrect password. Please verify your credentials.");
        setTimeout(() => {
          setIsShaking(false);
        }, 500);
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setIsShaking(true);
      setErrorMsg("Network error. Please try again.");
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/">
          <BrandLogo size="sm" isDark />
        </Link>
        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          ← Return to Client Portal
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top FNB Blue Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#007C89]" />

          {/* Badge */}
          <div className="w-12 h-12 rounded-2xl bg-[#007C89]/20 border border-[#007C89]/40 text-[#00A3AD] flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Admin Access Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-1 mb-6">
            Kenala Health Hub Secure JWT Authentication
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kenalahealthhub.co.za"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/90 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#007C89] transition-all"
                />
              </div>
            </div>

            {/* Password Field (With Custom Red Shake Animation!) */}
            <div className={`${isShaking ? "animate-shake" : ""}`}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <span className="text-[11px] text-zinc-500">Default: Kenala2026!</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
                    errorMsg
                      ? "border-red-500 bg-red-950/40 text-red-200 focus:ring-2 focus:ring-red-500"
                      : "border-zinc-700 bg-zinc-800/90 focus:ring-2 focus:ring-[#007C89]"
                  }`}
                />
              </div>

              {/* Shaking Red Error Label */}
              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mt-2 bg-red-950/60 p-2.5 rounded-lg border border-red-800/80 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#007C89] hover:bg-[#005C66] shadow-lg shadow-[#007C89]/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-500 text-center">
            Protected under HIPAA & POPIA Clinical Security Standards.
          </div>
        </div>
      </div>

      {/* Mini Footer */}
      <div className="text-center text-xs text-zinc-500 py-4">
        Kenala Health Hub • Sr Grace • Nellmapius, Pretoria East
      </div>
    </div>
  );
}
