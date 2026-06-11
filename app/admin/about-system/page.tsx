"use client";

import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  ShieldAlert, 
  Flame, 
  MessageSquare, 
  Terminal,
  Settings
} from "lucide-react";

export default function AboutSystemPage() {
  const steps = [
    {
      title: "1. Penginputan Laporan",
      description: "Mahasiswa menulis keluhan mengenai fasilitas kampus secara spesifik melalui formulir digital, lengkap dengan pilihan lokasi yang terdampak.",
      icon: MessageSquare,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "2. Analisis & Klasifikasi",
      description: "Sistem secara otomatis menganalisis teks laporan untuk mendeteksi kategori fasilitas, mengukur sentimen keluhan (positif/netral/negatif), dan menentukan tingkat urgensi.",
      icon: Layers,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "3. Penentuan Rekomendasi",
      description: "Berdasarkan kategori dan urgensi yang terdeteksi, sistem menyusun rekomendasi tindakan penanganan awal otomatis sesuai dengan kebijakan kampus.",
      icon: Sparkles,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      title: "4. Tindak Lanjut Admin",
      description: "Administrator meninjau laporan pada console khusus, memperbarui status pengerjaan (Baru -> Diproses -> Selesai) yang akan tersinkronisasi langsung ke mahasiswa.",
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    }
  ];

  const categories = [
    {
      name: "WiFi / Internet",
      desc: "Menangani kendala koneksi internet lambat, access point tidak aktif, gangguan hotspot, atau ruter bermasalah.",
      triggers: ["wifi", "internet", "jaringan", "lambat", "koneksi", "putus", "hotspot"]
    },
    {
      name: "Ruang Kelas",
      desc: "Menangani kendala sarana ruang perkuliahan seperti AC panas, proyektor rusak, papan tulis retak, kursi goyang, atau lampu redup.",
      triggers: ["ac", "kelas", "ruang", "kursi", "proyektor", "meja", "bocor", "panas"]
    },
    {
      name: "Parkiran",
      desc: "Menangani tata tertib kendaraan, ketersediaan blok parkir, sirkulasi jalan, keamanan helm, atau aspal berlubang.",
      triggers: ["parkir", "motor", "mobil", "helm", "karcis", "gerbang", "sempit"]
    },
    {
      name: "Toilet",
      desc: "Menangani kebersihan toilet, kran air macet, air bersih tidak keluar, WC tersumbat, wastafel pecah, atau bau tidak sedap.",
      triggers: ["toilet", "air", "wc", "sabun", "kran", "mampet", "bau", "wastafel"]
    },
    {
      name: "Pelayanan Akademik",
      desc: "Menangani keramahan staf, kecepatan respons loket administrasi, kejelasan alur berkas, atau keluhan birokrasi kampus.",
      triggers: ["pelayanan", "akademik", "staf", "baa", "birokrasi", "loket", "antrean"]
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Title */}
      <div className="border-b border-border/60 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          Tugas Kelompok 2 • Machine Learning
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Tentang Sistem CampusVoice</h1>
        <p className="text-sm text-muted-foreground font-normal">
          Informasi fungsional mengenai alur penanganan keluhan mahasiswa dan mekanisme pengelompokan laporan otomatis pada platform digital Kelompok 2.
        </p>
      </div>

      {/* OVERVIEW CARD */}
      <section className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Ikhtisar Aplikasi</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            <strong>CampusVoice</strong> adalah aplikasi pengaduan digital yang dirancang untuk menjembatani aspirasi mahasiswa dengan pihak pengelola kampus. Sistem ini memproses laporan keluhan secara real-time dan mengelompokkannya secara cerdas ke dalam unit penanganan yang sesuai. 
          </p>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Dengan adanya sistem pengelompokan otomatis ini, admin kampus dapat langsung mengidentifikasi tingkat urgensi laporan dan menindaklanjutinya dengan cepat tanpa harus melakukan pemilahan laporan secara manual satu per satu.
          </p>
        </div>
      </section>

      {/* SYSTEM FLOW */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-md md:text-lg font-bold tracking-tight">Alur Kerja Sistem Pengaduan</h2>
          <p className="text-xs text-muted-foreground">Bagaimana laporan diproses dari pengiriman hingga penyelesaian akhir</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-card border border-border p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-4 relative">
                <div className="space-y-3">
                  <div className={`p-2 rounded-lg w-fit ${step.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-xs md:text-sm text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORY DICTIONARIES */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="space-y-1 border-b border-border pb-4">
          <h2 className="text-md md:text-lg font-bold tracking-tight flex items-center gap-2">
            <Settings className="size-5 text-primary" />
            Aturan Pengelompokan Kategori
          </h2>
          <p className="text-xs text-muted-foreground">Sistem mengidentifikasi kategori laporan berdasarkan kecocokan kata kunci pada kamus penilai berikut:</p>
        </div>

        <div className="space-y-6 divide-y divide-border/60">
          {categories.map((cat, idx) => (
            <div key={idx} className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${idx > 0 ? "pt-6" : ""} items-start`}>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-primary">{cat.name}</h3>
                <p className="text-xs text-muted-foreground leading-normal font-normal">
                  {cat.desc}
                </p>
              </div>

              <div className="lg:col-span-2 space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Kata Kunci Deteksi:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.triggers.map((word) => (
                    <span 
                      key={word} 
                      className="text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground px-2.5 py-1 rounded border border-border/40 font-semibold transition-colors"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
