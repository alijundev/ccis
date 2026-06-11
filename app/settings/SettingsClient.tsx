"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  Lock, 
  Sun, 
  Moon, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updatePasswordAction, logoutAction } from "@/lib/actions/authActions";

interface FreshUser {
  id: string;
  nim: string | null;
  username: string | null;
  name: string;
  role: string;
  major: string | null;
  createdAt: Date;
}

interface SettingsClientProps {
  user: FreshUser;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Determine active theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeMode(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (themeMode === "light") {
      root.classList.add("dark");
      setThemeMode("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      setThemeMode("light");
      localStorage.setItem("theme", "light");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Semua kolom kata sandi wajib diisi!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi sandi baru tidak sesuai!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Sandi baru harus minimal 6 karakter!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const res = await updatePasswordAction(formData);

      if (res.success) {
        setSuccess("Kata sandi berhasil diperbarui!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(res.error || "Gagal memperbarui kata sandi.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Terjadi kesalahan sistem saat memperbarui sandi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutAction();
      // Force reload to home page to clear all client states and middleware contexts
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  };

  const isStudent = user.role === "STUDENT";
  const userIdentifier = isStudent ? user.nim : user.username;
  const simulatedEmail = isStudent 
    ? `${user.nim}@student.ccis.ac.id` 
    : `${user.username}@admin.ccis.ac.id`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Title */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Pengaturan Akun</h1>
        <p className="text-sm text-muted-foreground font-normal">
          Ubah sandi, atur preferensi tampilan aplikasi, dan tinjau status metadata profil Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Form options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Account Profile Metadata */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="size-4 text-primary" />
              Profil {isStudent ? "Mahasiswa" : "Administrator"} (Terintegrasi DB)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Nama Lengkap</span>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Email Akademik</span>
                <p className="text-sm font-semibold text-foreground">{simulatedEmail}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                  {isStudent ? "Nomor Induk Mahasiswa (NIM)" : "Username Admin"}
                </span>
                <p className="text-sm font-semibold text-foreground">{userIdentifier}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                  {isStudent ? "Program Studi" : "Hak Akses Aplikasi"}
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {isStudent ? (user.major || "Belum ditentukan") : "Sistem Administrator"}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Change Password */}
          <form onSubmit={handlePasswordUpdate} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <Lock className="size-4 text-primary" />
              Pembaruan Kata Sandi
            </h3>

            {error && (
              <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive animate-headShake">
                <AlertCircle className="size-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground block">Kata Sandi Lama</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-muted/20 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted/20 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Konfirmasi Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted/20 border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs py-2 px-5 rounded-lg shadow-md transition-all active:scale-98 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Kata Sandi"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Quick settings panel */}
        <div className="space-y-6">
          {/* Preferences */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings className="size-4 text-primary" />
              Preferensi Aplikasi
            </h3>

            {/* Dark mode switch */}
            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <span className="text-xs font-bold text-foreground">Tema Tampilan</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border text-xs transition-colors"
              >
                {themeMode === "light" ? (
                  <>
                    <Moon className="size-3.5" />
                    Malam
                  </>
                ) : (
                  <>
                    <Sun className="size-3.5" />
                    Terang
                  </>
                )}
              </button>
            </div>

            {/* Log out */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="w-full bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive border border-destructive/20 font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="size-4" />
                Keluar Sesi Akun
              </Button>
            </div>
          </div>

          {/* NLP Verification policy card */}
          <div className="bg-primary/5 rounded-2xl border border-primary/15 p-6 space-y-3">
            <h4 className="font-bold text-xs text-primary flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              Keamanan Data Akun
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
              Aspirasi Anda dianalisis oleh modul pemrosesan bahasa alami secara objektif. Akun dan password Anda dienkripsi penuh menggunakan algoritma bcrypt guna menjamin kerahasiaan identitas pelapor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
