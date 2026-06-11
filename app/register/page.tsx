"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle, BookOpen, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/lib/actions/authActions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [major, setMajor] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nim || !major || !password || !confirmPassword) {
      setError("Semua kolom formulir wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter!");
      return;
    }
    
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("nim", nim);
    formData.append("major", major);
    formData.append("password", password);

    const res = await registerAction(formData);
    setLoading(false);

    if (res.success) {
      setSuccess("Pendaftaran berhasil! Mengalihkan ke dashboard...");
      setTimeout(() => {
        router.push("/student/dashboard");
      }, 1000);
    } else {
      setError(res.error || "Gagal mendaftar.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* LEFT PANEL: Academic Presentation */}
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
            <Fingerprint className="size-3.5 text-indigo-300" />
            Portal Mahasiswa • Kelompok 2
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Satu Akun, <br />Suara Terbuka.
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
            Daftarkan diri Anda untuk menyuarakan aspirasi, melaporkan keluhan fasilitas kampus, dan memantau penyelesaiannya secara langsung.
          </p>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5 font-bold text-xs">1</div>
              <p className="text-xs md:text-sm text-primary-foreground/80">Identitas aman berbasis Nomor Induk Mahasiswa (NIM).</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5 font-bold text-xs">2</div>
              <p className="text-xs md:text-sm text-primary-foreground/80">Pengelompokan keluhan otomatis untuk kemudahan tindak lanjut admin.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-xs text-primary-foreground/50">
          &copy; 2026 CampusVoice Kelompok 2. Tugas Kuliah Machine Learning.
        </div>
      </div>

      {/* RIGHT PANEL: Authentic Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 bg-card text-card-foreground p-8 rounded-2xl border border-border/80 shadow-xl transition-all duration-300">
          <div className="space-y-1.5 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Daftar Akun</h1>
            <p className="text-xs text-muted-foreground">Isi data lengkap Anda untuk bergabung di CampusVoice</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive animate-headShake">
                <AlertCircle className="size-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4 shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80 block">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>
            </div>

            {/* NIM & Jurusan (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 block">NIM</label>
                <input
                  type="text"
                  placeholder="2109876543"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full px-3 py-1.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 block">Program Studi</label>
                <input
                  type="text"
                  placeholder="Informatika '21"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>
            </div>



            {/* Sandi & Konfirmasi Sandi (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 block">Kata Sandi</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground/80 block">Konfirmasi</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary size-4 mt-0.5"
                required
              />
              <label htmlFor="terms" className="text-[11px] font-medium text-muted-foreground cursor-pointer leading-normal">
                Saya menyetujui <a href="#" className="text-primary hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> CampusVoice.
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-1 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-lg text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                  Mendaftarkan...
                </>
              ) : (
                <>
                  Daftarkan Akun
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Alternative Switch */}
          <div className="text-center text-xs text-muted-foreground pt-3 border-t border-border/40">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
