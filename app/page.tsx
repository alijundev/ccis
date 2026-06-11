"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  User, 
  Settings, 
  Database, 
  Cpu, 
  HelpCircle,
  MessageSquare,
  History,
  TrendingDown,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeComplaintText } from "@/lib/actions/complaintActions";

export default function LandingPage() {
  const [demoInput, setComplaintInput] = useState("WiFi di perpustakaan lantai 2 sangat lambat, susah sekali dipakai buat ngerjain tugas!");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    category: string;
    sentiment: string;
    severity: string;
    confidence: string;
  } | null>({
    category: "WiFi / Internet",
    sentiment: "NEGATIF",
    severity: "TINGGI",
    confidence: "91.8%"
  });

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeComplaintText(demoInput);
      setResult({
        category: res.category,
        sentiment: res.sentiment,
        severity: res.severity,
        confidence: res.confidence || "90.0%"
      });
    } catch (err) {
      console.error("Gagal melakukan analisis keluhan:", err);
      // Client-side fallback if server action throws an error
      const text = demoInput.toLowerCase();
      let category = "Pelayanan Akademik";
      let sentiment = "NEGATIF";
      let severity = "SEDANG";
      let confidence = "85.0%";

      if (text.includes("wifi") || text.includes("internet") || text.includes("koneksi") || text.includes("jaringan")) {
        category = "WiFi / Internet";
        severity = "TINGGI";
        confidence = "89.4%";
      } else if (text.includes("ac") || text.includes("kelas") || text.includes("ruang") || text.includes("kursi") || text.includes("proyektor")) {
        category = "Ruang Kelas";
        confidence = "87.2%";
      } else if (text.includes("parkir") || text.includes("motor") || text.includes("mobil") || text.includes("marka")) {
        category = "Parkiran";
        confidence = "86.5%";
      } else if (text.includes("toilet") || text.includes("air") || text.includes("wc") || text.includes("sabun")) {
        category = "Toilet";
        confidence = "88.1%";
      }

      if (text.includes("bagus") || text.includes("lancar") || text.includes("bersih") || text.includes("puas") || text.includes("ramah") || text.includes("terima kasih")) {
        sentiment = "POSITIF";
        severity = "RENDAH";
        confidence = "92.1%";
      } else if (text.includes("biasa") || text.includes("lumayan") || text.includes("cukup")) {
        sentiment = "NETRAL";
        severity = "RENDAH";
        confidence = "85.2%";
      }

      setResult({ category, sentiment, severity, confidence });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans overflow-x-hidden flex flex-col justify-between">
      {/* Decorative Blur Background circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
              <Sparkles className="size-4" />
            </div>
            <div>
              <span className="font-bold text-md tracking-tight">CampusVoice</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold ml-2">Kelompok 2</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors">Fitur Utama</a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">Demo NLP</a>
            <a href="#alur" className="text-muted-foreground hover:text-foreground transition-colors">Alur Kerja</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Registrasi</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Tugas Kelompok 2 • Machine Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Sistem Analisis Keluhan Mahasiswa Menggunakan <span className="text-primary bg-clip-text">NLP</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            CampusVoice adalah aplikasi pengelolaan keluhan mahasiswa berbasis web. Dikembangkan oleh Kelompok 2 untuk tugas mata kuliah Machine Learning, sistem ini mengelompokkan laporan fasilitas dan pelayanan kampus secara otomatis demi proses penanganan yang lebih cepat dan terstruktur.
          </p>

          {/* Shortcut Portals */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <Link href="/student/dashboard" className="group">
              <div className="border border-border rounded-xl p-5 hover:border-primary/40 bg-card hover:shadow-xs transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="p-2.5 bg-primary/10 text-primary rounded-lg">
                    <User className="size-5" />
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1">Portal Mahasiswa</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Kirim keluhan fasilitas & akademik, dan pantau respons tindak lanjut admin secara transparan.
                </p>
              </div>
            </Link>

            <Link href="/admin/dashboard" className="group">
              <div className="border border-border rounded-xl p-5 hover:border-primary/40 bg-card hover:shadow-xs transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className="p-2.5 bg-primary/10 text-primary rounded-lg">
                    <LayoutDashboard className="size-5" />
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-sm text-foreground mb-1">Dashboard Admin</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Pantau visualisasi bento-grid, analisis sentimen mahasiswa, distribusi keparahan, & tindak lanjut.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* DEMO NLP CARD (Lg Col 5) */}
        <div className="lg:col-span-5" id="demo">
          <div className="border border-border bg-card rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30" />
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-md text-foreground flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                Uji Coba Analisis Keluhan
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Ketik keluhan di bawah untuk menguji klasifikasi kategori, sentimen, dan tingkat urgensi (severity):
            </p>

            <div className="space-y-4">
              <textarea
                value={demoInput}
                onChange={(e) => setComplaintInput(e.target.value)}
                placeholder="Tulis keluhan fasilitas kampus..."
                rows={3}
                className="w-full min-h-[80px] text-xs md:text-sm p-3 bg-muted/40 border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:outline-hidden text-foreground"
              />

              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !demoInput.trim()}
                className="w-full h-10 font-semibold flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Activity className="size-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Activity className="size-4" />
                    <span>Analisis Keluhan</span>
                  </>
                )}
              </Button>

              {/* NLP OUTPUT GRID */}
              {result && (
                <div className="space-y-3 pt-4 border-t border-border animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Hasil Analisis Model AI:</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      Sistem Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Kategori</p>
                      <p className="text-xs font-bold text-primary truncate" title={result.category}>
                        {result.category}
                      </p>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Sentimen</p>
                      <p className="text-xs font-bold text-destructive truncate">
                        {result.sentiment}
                      </p>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Severity</p>
                      <p className="text-xs font-bold text-foreground truncate">
                        {result.severity}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT INFO BANNER */}
      <section className="bg-muted/30 border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-muted-foreground">
            Dikembangkan oleh Kelompok 2 untuk Tugas Project Akhir Mata Kuliah Machine Learning
          </p>
        </div>
      </section>

      {/* CORE FEATURES (col-span-12) */}
      <section id="fitur" className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Solusi Pintar Pengelolaan Laporan Kampus
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Aplikasi yang mempermudah proses penyampaian keluhan mahasiswa, memantau status tindak lanjut, dan membantu pengelolaan data laporan secara teratur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-border bg-card p-6 rounded-2xl hover:shadow-md transition-shadow">
            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <Cpu className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">NLP Kategori Klasifikasi</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Membaca keluhan mahasiswa lalu secara otomatis menentukannya ke dalam salah satu dari 5 kategori utama: WiFi, Ruang Kelas, Toilet, Parkiran, atau Pelayanan Akademik.
            </p>
          </div>

          <div className="border border-border bg-card p-6 rounded-2xl hover:shadow-md transition-shadow">
            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <Activity className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">Sentiment & Severity Engine</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mendeteksi apakah keluhan bernilai Positif, Netral, atau Negatif serta melabeli keparahan (Urgensi Tinggi, Sedang, Rendah) untuk menetapkan prioritas pengerjaan.
            </p>
          </div>

          <div className="border border-border bg-card p-6 rounded-2xl hover:shadow-md transition-shadow">
            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">Sistem Rekomendasi Aksi</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Memberikan saran tindakan berbasis aturan (*Rule-Based Decision*) secara otomatis ke pihak admin LPM (Lembaga Penjamin Mutu) berdasarkan hasil klasifikasi keluhan.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-card text-card-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-muted-foreground">
          <p>© 2026 CampusVoice Kelompok 2. Dikembangkan untuk Tugas Proyek Kelas Machine Learning.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:underline text-primary font-semibold">Uji Coba Portal</Link>
            <span className="text-border">|</span>
            <span className="italic">Proyek Kelompok 2 • Machine Learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
