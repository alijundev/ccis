import Link from "next/link";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Sparkles, 
  MessageSquarePlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  History,
  ShieldCheck,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch complaints from PostgreSQL via Prisma ORM
  const complaints = await db.complaint.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  // Compute metrics
  const totalSubmitted = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === "IN_PROGRESS").length;
  const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
  const newCount = complaints.filter(c => c.status === "NEW").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3.5" />
            Selesai
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="size-3.5" />
            Diproses
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <AlertCircle className="size-3.5" />
            Baru
          </span>
        );
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIF":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
            POSITIF
          </span>
        );
      case "NETRAL":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground border border-border">
            NETRAL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/10">
            NEGATIF
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "TINGGI":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/10">
            TINGGI
          </span>
        );
      case "SEDANG":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/10">
            SEDANG
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/15 text-slate-600 border border-slate-500/10">
            RENDAH
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-xs relative overflow-hidden">
        {/* Absolute radial blur background */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
            Portal Aspirasi Mahasiswa
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Halo, {session.name}! 👋</h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Suaramu adalah fondasi peningkatan sarana kampus. Laporkan keluhan atau kendala fasilitas di lingkungan universitas dengan mudah, cepat, dan transparan.
          </p>
        </div>

        <Link href="/student/complaints/new" className="shrink-0">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-2">
            <MessageSquarePlus className="size-4" />
            Kirim Keluhan Baru
          </Button>
        </Link>
      </section>

      {/* METRICS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Total Submitted */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between group transition-all duration-300 hover:border-border/80">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Laporan</p>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <History className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{totalSubmitted}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Aspirasi terdaftar</p>
          </div>
        </div>

        {/* Card 2: New Complaints */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between group transition-all duration-300 hover:border-border/80">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Baru</p>
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{newCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Menunggu verifikasi</p>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between group transition-all duration-300 hover:border-border/80">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sedang Diproses</p>
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{inProgressCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Investigasi & pengerjaan</p>
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between group transition-all duration-300 hover:border-border/80">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selesai Ditangani</p>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{resolvedCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Selesai diperbaiki</p>
          </div>
        </div>
      </section>

      {/* RECENT COMPLAINTS & QUICK GUIDE INFO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left 2 Cols: Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-md md:text-lg font-bold tracking-tight">Keluhan Terbaru Saya</h2>
            <Link href="/student/complaints" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Lihat Semua Riwayat
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-4">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                  <History className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold">Belum ada keluhan terdaftar</h4>
                  <p className="text-xs text-muted-foreground">Setiap aspirasi yang Anda kirimkan akan tampil secara kronologis di sini.</p>
                </div>
                <Link href="/student/complaints/new">
                  <Button className="mt-2 text-xs bg-primary text-primary-foreground hover:bg-primary/95">Kirim Aspirasi Pertama Anda</Button>
                </Link>
              </div>
            ) : (
              complaints.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className="bg-card rounded-xl border border-border p-5 md:p-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-md"
                >
                  {/* Category and Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                        {item.category}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />
                          {item.location}
                        </span>
                      )}
                    </div>
                    <div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  {/* Complaint Text */}
                  <p className="text-xs md:text-sm text-foreground mt-4 leading-relaxed font-normal line-clamp-2 md:line-clamp-3">
                    {item.text}
                  </p>

                  {/* Analysis Meta metrics */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-3.5 border-t border-border/40">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Sentimen:</span>
                        {getSentimentBadge(item.sentiment)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Tingkat Keparahan:</span>
                        {getSeverityBadge(item.severity)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Info Sidebar Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 space-y-5 shadow-xs relative overflow-hidden">
            <div className="size-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold shadow-inner shrink-0">
              <Sparkles className="size-5" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-sm md:text-md text-foreground">Panduan Menulis Laporan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                Gunakan tips berikut agar laporan Anda dapat diproses dengan cepat oleh petugas unit terkait:
              </p>
            </div>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3">
                <div className="p-1 bg-emerald-500/10 text-emerald-600 rounded-md shrink-0 mt-0.5">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Jelas & Spesifik</p>
                  <p className="text-[10px] text-muted-foreground">Tuliskan kendala secara langsung, seperti "Kran air di toilet lantai 1 bocor".</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 bg-emerald-500/10 text-emerald-600 rounded-md shrink-0 mt-0.5">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Sebutkan Lokasi</p>
                  <p className="text-[10px] text-muted-foreground">Sertakan detail lokasi (lantai, gedung, atau ruangan) pada kolom yang disediakan.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 bg-emerald-500/10 text-emerald-600 rounded-md shrink-0 mt-0.5">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Pantau Status</p>
                  <p className="text-[10px] text-muted-foreground">Cek menu "Riwayat Keluhan" secara berkala untuk melihat perkembangan tindak lanjut.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Help Card */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-500">
              <ShieldCheck className="size-5" />
              <h4 className="font-bold text-xs md:text-sm text-foreground">Umpan Balik Transparan</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-normal font-normal">
              Semua status penanganan diperbarui langsung secara transparan oleh pimpinan fakultas atau unit terkait. Anda akan menerima notifikasi setiap ada perubahan status.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
