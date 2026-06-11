"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/lib/actions/authActions";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !password) {
      setError(`${role === "ADMIN" ? "Username" : "NIM"} dan kata sandi wajib diisi!`);
      return;
    }
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    if (role === "ADMIN") {
      formData.append("username", nim);
    } else {
      formData.append("nim", nim);
    }
    formData.append("password", password);
    formData.append("role", role);

    const res = await loginAction(formData);
    setLoading(false);

    if (res.success) {
      if (res.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } else {
      setError(res.error || "Login gagal.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* LEFT PANEL: Academic/AI Visual Presentation */}
      <div className="md:w-1/2 bg-primary text-primary-foreground p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-20" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-10 bg-primary-foreground text-primary rounded-xl flex items-center justify-center font-bold shadow-lg transition-transform group-hover:scale-105">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">CampusVoice</span>
              <span className="text-[10px] text-primary-foreground/65 mt-0.5 block">Tugas ML • Kelompok 2</span>
            </div>
          </Link>
        </div>

        {/* Center Showcase */}
        <div className="relative my-auto space-y-6 max-w-md py-12 md:py-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white font-medium border border-white/10">
            <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
            Tugas Akhir Kelompok 2
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sampaikan Aspirasi Secara <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-100 underline decoration-indigo-300/40">Terstruktur</span>.
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
            CampusVoice mempermudah mahasiswa mengirim laporan fasilitas kampus dan membantu admin mengelola tindak lanjut laporan secara terorganisir.
          </p>

          {/* Clean list of focus categories instead of fake metrics */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Kategori Fasilitas:</p>
            <div className="flex flex-wrap gap-2">
              {["WiFi / Internet", "Ruang Kelas", "Parkiran", "Toilet", "Pelayanan"].map((cat) => (
                <span key={cat} className="text-[11px] bg-white/10 text-white px-2.5 py-1 rounded-full font-medium border border-white/5">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-xs text-primary-foreground/50">
          &copy; 2026 CampusVoice Kelompok 2. Tugas Kuliah Machine Learning.
        </div>
      </div>

      {/* RIGHT PANEL: Authentic Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-card text-card-foreground p-8 rounded-2xl border border-border/80 shadow-xl transition-all duration-300">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Selamat Datang</h1>
            <p className="text-sm text-muted-foreground">Silakan masuk menggunakan akun CampusVoice Anda</p>
          </div>

          {/* Role Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl border border-border/40">
            <button
              onClick={() => setRole("STUDENT")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-98 ${
                role === "STUDENT"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-3.5" />
              Mahasiswa
            </button>
            <button
              onClick={() => setRole("ADMIN")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-98 ${
                role === "ADMIN"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="size-3.5" />
              Admin / Dosen
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive animate-headShake">
                <AlertCircle className="size-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* NIM / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 block">
                {role === "ADMIN" ? "Username Admin" : "NIM Mahasiswa"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={role === "ADMIN" ? "Contoh: admin" : "Contoh: 2109876543"}
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground/80 block">Kata Sandi</label>
                <a href="#" className="text-[11px] font-medium text-primary hover:underline">Lupa Kata Sandi?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary size-4"
              />
              <label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                Ingat perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-lg text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Portal
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Alternative Switch */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/40">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
