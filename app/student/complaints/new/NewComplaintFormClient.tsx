"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitComplaintAction } from "@/lib/actions/complaintActions";
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Send, 
  Cpu, 
  CheckCircle2, 
  RefreshCw,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewComplaintFormClientProps {
  studentName: string;
}

export default function NewComplaintFormClient({ studentName }: NewComplaintFormClientProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const minChar = 15;
  const maxChar = 500;

  const steps = [
    "Menerima teks laporan keluhan...",
    "Menganalisis isi keluhan secara otomatis...",
    "Mengelompokkan pilar kategori keluhan...",
    "Menentukan tingkat prioritas penanganan...",
    "Menyusun rancangan aksi penanganan..."
  ];

  const triggerAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length < minChar) return;

    setIsAnalyzing(true);
    setLoadingStep(0);
    setError("");

    // Dynamic loading steps simulation
    const interval = setInterval(async () => {
      setLoadingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          
          // Trigger rule-based categorization simulation
          // (matching our backend analysis dictionary for a consistent preview)
          const lowerText = text.toLowerCase();
          let category = "Pelayanan Akademik";
          let sentiment = "NEGATIF";
          let severity = "SEDANG";
          
          if (lowerText.includes("wifi") || lowerText.includes("internet") || lowerText.includes("koneksi") || lowerText.includes("jaringan") || lowerText.includes("hotspot")) {
            category = "WiFi / Internet";
          } else if (lowerText.includes("ac") || lowerText.includes("kelas") || lowerText.includes("ruang") || lowerText.includes("kursi") || lowerText.includes("proyektor") || lowerText.includes("papan tulis") || lowerText.includes("meja")) {
            category = "Ruang Kelas";
          } else if (lowerText.includes("parkir") || lowerText.includes("motor") || lowerText.includes("mobil") || lowerText.includes("helm") || lowerText.includes("karcis") || lowerText.includes("marka")) {
            category = "Parkiran";
          } else if (lowerText.includes("toilet") || lowerText.includes("air") || lowerText.includes("wc") || lowerText.includes("sabun") || lowerText.includes("kran") || lowerText.includes("mampet")) {
            category = "Toilet";
          }
          
          if (lowerText.includes("bagus") || lowerText.includes("puas") || lowerText.includes("bersih") || lowerText.includes("nyaman") || lowerText.includes("lancar") || lowerText.includes("terima kasih") || lowerText.includes("mantap") || lowerText.includes("keren") || lowerText.includes("rapi")) {
            sentiment = "POSITIF";
            severity = "RENDAH";
          } else if (lowerText.includes("biasa") || lowerText.includes("lumayan") || lowerText.includes("cukup") || lowerText.includes("standar")) {
            sentiment = "NETRAL";
            severity = "RENDAH";
          }
          
          if (sentiment === "NEGATIF") {
            if (lowerText.includes("rusak berat") || lowerText.includes("parah") || lowerText.includes("mati") || lowerText.includes("tidak bisa") || lowerText.includes("hilang") || lowerText.includes("mampet total") || lowerText.includes("bocor keras") || lowerText.includes("darurat") || lowerText.includes("kecurian")) {
              severity = "TINGGI";
            } else if (lowerText.includes("lambat") || lowerText.includes("kurang") || lowerText.includes("kotor") || lowerText.includes("bocor") || lowerText.includes("antre") || lowerText.includes("panas")) {
              severity = "SEDANG";
            } else {
              severity = "RENDAH";
            }
          }

          const RULE_RECOMMENDATIONS: Record<string, Record<string, string[]>> = {
            "WiFi / Internet": {
              "RENDAH": ["Lakukan monitoring kualitas jaringan secara berkala."],
              "SEDANG": ["Periksa access point pada lokasi keluhan Perpustakaan Lantai 2.", "Cek kestabilan koneksi jaringan dan bandwidth wifi."],
              "TINGGI": ["Prioritaskan pengecekan jaringan di lokasi keluhan.", "Periksa access point dan bandwidth.", "Eskalasi ke unit teknis jaringan kampus."]
            },
            "Ruang Kelas": {
              "RENDAH": ["Agendakan pembersihan rutin tambahan pada ruang kelas."],
              "SEDANG": ["Periksa AC, pencahayaan, atau proyektor di ruang kelas terkait.", "Koordinasikan dengan unit sarana prasarana untuk perbaikan minor."],
              "TINGGI": ["Segera eskalasi perbaikan fasilitas krusial proyektor mati di Ruang 3.2 Gedung B.", "Koordinasikan dengan unit sarana prasarana untuk penggantian kabel HDMI baru."]
            },
            "Parkiran": {
              "RENDAH": ["Lakukan pengecatan ulang/perapian marka parkir di Parkiran Gedung C.", "Pasang rambu penunjuk arah parkir tambahan."],
              "SEDANG": ["Tingkatkan patroli keamanan di area parkir pada jam sibuk.", "Atur ulang tata letak parkir untuk mengoptimalkan ruang."],
              "TINGGI": ["Eskalasi keluhan mengenai kehilangan barang atau sengketa parkir ke pihak keamanan kampus.", "Lakukan perbaikan darurat pada gerbang otomatis atau aspal yang rusak berat."]
            },
            "Toilet": {
              "RENDAH": ["Ingatkan petugas kebersihan untuk menjaga ketersediaan tisu dan sabun."],
              "SEDANG": ["Lakukan perbaikan pada kran bocor atau saluran pembuangan lambat.", "Tingkatkan frekuensi pembersihan toilet dalam sehari."],
              "TINGGI": ["Prioritaskan perbaikan pipa air utama yang pecah dan ganti kran wastafel toilet lantai 1.", "Ingatkan petugas kebersihan untuk mengeringkan genangan air agar lantai tidak licin."]
            },
            "Pelayanan Akademik": {
              "RENDAH": ["Evaluasi kepuasan layanan loket akademik secara berkala."],
              "SEDANG": ["Berikan feedback atau teguran kepada staf layanan terkait kelambatan respons.", "Sediakan panduan alur birokrasi yang lebih jelas untuk mahasiswa."],
              "TINGGI": ["Eskalasi masalah administrasi krusial (nilai error, kendala wisuda/registrasi) ke Kepala Biro Akademik.", "Lakukan tinjauan menyeluruh terhadap sistem informasi akademik yang mengalami kendala sistemis."]
            }
          };

          const recommendations = RULE_RECOMMENDATIONS[category]?.[severity] || ["Terima kasih atas laporan Anda. Kami akan melakukan verifikasi terlebih dahulu."];

          setAnalysisResult({
            category,
            sentiment,
            severity,
            recommendations
          });
          setIsAnalyzing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
  };

  const handleFinalSubmit = async () => {
    if (!analysisResult) return;

    setError("");
    const formData = new FormData();
    formData.append("text", text);
    formData.append("location", location);

    const res = await submitComplaintAction(formData);
    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Gagal mengirimkan keluhan");
    }
  };

  const resetForm = () => {
    setText("");
    setLocation("");
    setAnalysisResult(null);
    setSubmitted(false);
    setError("");
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "POSITIF") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (sentiment === "NETRAL") return "text-muted-foreground bg-muted border-border";
    return "text-destructive bg-destructive/10 border-destructive/20";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "TINGGI") return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    if (severity === "SEDANG") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-slate-500 bg-slate-500/10 border-slate-500/20";
  };

  return (
    <div className="space-y-6">
      {!analysisResult && !isAnalyzing ? (
        // STATE 1: FORM FILLING
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Main Form */}
          <form onSubmit={triggerAnalysis} className="lg:col-span-2 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-xs space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block text-foreground">Isi Keluhan atau Aspirasi</label>
              <p className="text-xs text-muted-foreground">Tulis secara ringkas dan detail (min. 15 karakter). Berikan lokasi atau detail keluhan agar penanganan lebih cepat.</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={maxChar}
                placeholder="Contoh: AC di ruang kuliah GKB lantai 2 R.204 mati sejak pagi. Mahasiswa kepanasan sehingga dosen tidak nyaman mengajar..."
                className="w-full h-40 px-4 py-3 bg-muted/20 border border-border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground resize-none leading-relaxed"
                required
              />
              <div className="flex justify-between items-center text-xs pt-1">
                <span className={`font-semibold ${text.length < minChar ? "text-destructive" : "text-emerald-500"}`}>
                  {text.length < minChar ? `Minimal kurang ${minChar - text.length} karakter` : "Karakter tercukupi"}
                </span>
                <span className="text-muted-foreground">
                  {text.length} / {maxChar} karakter
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block text-foreground">Lokasi Spesifik (Opsional)</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Contoh: GKB 2, Ruang 204 atau Parkiran Samping Kantin"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/20 border border-border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={text.length < minChar}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-xl text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Cpu className="size-4 shrink-0" />
              <span>Proses Laporan & Cek Rekomendasi</span>
              <ArrowRight className="size-4 shrink-0" />
            </Button>
          </form>

          {/* Right Sidebar: Guidelines */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4 shadow-xs">
              <h4 className="font-bold text-xs md:text-sm text-foreground flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                Tips Menulis Keluhan
              </h4>
              <ul className="space-y-3.5 text-xs text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sebutkan nama fasilitas dengan jelas (misal: WiFi, AC, toilet, parkir, dll).</li>
                <li>Cantumkan nama ruangan atau lantai jika berada di dalam gedung kuliah.</li>
                <li>Gunakan kata-kata objektif agar sentiment analyzer membaca dengan presisi tinggi.</li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/10 p-6 space-y-3.5">
              <h4 className="font-bold text-xs text-primary flex items-center gap-2">
                <Sparkles className="size-4 shrink-0" />
                Sistem Pengaduan Digital
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Setiap laporan yang masuk akan dikategorikan secara otomatis demi memotong birokrasi dan mempercepat proses penanganan oleh tim administrator.
              </p>
            </div>
          </div>
        </div>
      ) : isAnalyzing ? (
        // STATE 2: PIPELINE LOADER
        <div className="bg-card rounded-2xl border border-border p-12 md:p-16 text-center space-y-8 shadow-md">
          <div className="relative size-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Cpu className="size-6 text-primary animate-pulse" />
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <h3 className="font-bold text-md md:text-lg">Sistem Sedang Memproses Laporan...</h3>
            <p className="text-xs text-muted-foreground font-normal">
              Laporan Anda sedang dikategorikan secara otomatis demi mempermudah proses administrasi penanganan.
            </p>
          </div>

          {/* Steps Track */}
          <div className="max-w-md mx-auto bg-muted/40 rounded-xl p-4 border border-border/60 text-left space-y-2.5">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                {idx < loadingStep ? (
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                ) : idx === loadingStep ? (
                  <RefreshCw className="size-4 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="size-4 border border-border rounded-full shrink-0" />
                )}
                <span className={idx === loadingStep ? "font-bold text-foreground" : idx < loadingStep ? "text-muted-foreground/80 line-through" : "text-muted-foreground"}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : submitted ? (
        // STATE 4: SUBMITTED SUCCESS BANNER
        <div className="bg-card rounded-2xl border border-emerald-500/20 p-12 text-center space-y-6 shadow-lg max-w-2xl mx-auto">
          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="size-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">Laporan Berhasil Dikirim!</h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Terima kasih, {studentName}. Keluhan Anda telah terdaftar dan siap diperiksa oleh tim administrator fakultas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              onClick={resetForm}
              className="bg-muted text-foreground hover:bg-muted/80 border border-border font-semibold rounded-xl text-xs py-2.5"
            >
              Kirim Keluhan Lain
            </Button>
            <Button
              onClick={() => router.push("/student/complaints")}
              className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-xl text-xs py-2.5"
            >
              Lihat Riwayat Saya
            </Button>
          </div>
        </div>
      ) : (
        // STATE 3: ANALYSIS MODEL PREDICTION RESULT SHOWCASE
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-card to-muted/20 rounded-2xl border border-primary/20 p-6 md:p-8 shadow-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="size-10 bg-primary/15 text-primary rounded-xl flex items-center justify-center font-bold">
                <Cpu className="size-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm md:text-md">Draf Detail Laporan</h3>
                <p className="text-[10px] text-muted-foreground">Kategori dan prioritas laporan yang dihasilkan oleh sistem otomatis</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive font-medium flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {/* Input display */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Teks Keluhan Anda:</p>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/60 text-xs md:text-sm leading-relaxed italic text-foreground">
                "{text}"
              </div>
            </div>

            {/* Prediction details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Category */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Kategori Terdeteksi</p>
                <p className="text-sm font-extrabold mt-1.5 text-primary">{analysisResult.category}</p>
              </div>

              {/* Sentiment */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Skor Sentimen</p>
                <div className="mt-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSentimentColor(analysisResult.sentiment)}`}>
                    {analysisResult.sentiment}
                  </span>
                </div>
              </div>

              {/* Severity */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tingkat Urgensi (Severity)</p>
                <div className="mt-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSeverityColor(analysisResult.severity)}`}>
                    {analysisResult.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations Rule list */}
            <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-3">
              <h4 className="font-bold text-xs md:text-sm text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4.5 text-emerald-500 shrink-0" />
                Rekomendasi Tindakan (Rule-Based):
              </h4>
              <p className="text-xs text-muted-foreground font-normal leading-normal">
                Berdasarkan kombinasi kategori dan tingkat urgensi laporan, sistem merumuskan draf aksi berikut untuk diserahkan kepada admin:
              </p>
              <ul className="space-y-2.5 pt-2">
                {analysisResult.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-normal leading-relaxed">
                    <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action panel */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                onClick={() => setAnalysisResult(null)}
                className="bg-muted text-foreground hover:bg-muted/80 border border-border font-semibold rounded-xl text-xs py-2 px-4"
              >
                Ubah Teks
              </Button>
              <Button
                onClick={handleFinalSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-xl text-xs py-2 px-5 flex items-center gap-2"
              >
                Kirim & Daftarkan Keluhan
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
