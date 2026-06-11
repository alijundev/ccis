"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  Activity,
  History,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Users,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MappedComplaint {
  id: string;
  userId: string;
  userName: string;
  userNim: string;
  userMajor: string;
  text: string;
  location: string;
  category: string;
  sentiment: string;
  severity: string;
  status: string;
  createdAt: string;
}

interface AdminDashboardClientProps {
  initialComplaints: MappedComplaint[];
}

export default function AdminDashboardClient({ initialComplaints }: AdminDashboardClientProps) {
  const [complaints] = useState<MappedComplaint[]>(initialComplaints);

  // Compute metrics
  const totalCount = complaints.length;
  const newCount = complaints.filter(c => c.status === "NEW").length;
  const inProgressCount = complaints.filter(c => c.status === "IN_PROGRESS").length;
  const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
  const highSeverityCount = complaints.filter(c => c.severity === "TINGGI" && c.status !== "RESOLVED").length;
  const negativeSentimentCount = complaints.filter(c => c.sentiment === "NEGATIF").length;

  // Chart 1: Category distribution
  const categoriesList = ["WiFi / Internet", "Ruang Kelas", "Parkiran", "Toilet", "Pelayanan Akademik"];
  
  const normalizeCat = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("wifi") || c.includes("internet")) return "wifi";
    if (c.includes("kelas") || c.includes("ruang")) return "kelas";
    if (c.includes("parkir")) return "parkir";
    if (c.includes("toilet") || c.includes("wc")) return "toilet";
    return "akademik";
  };

  const categoryData = categoriesList.map(cat => {
    const targetNorm = normalizeCat(cat);
    return {
      name: cat.split(" / ")[0], // Shorter name for chart labels
      "Jumlah Keluhan": complaints.filter(c => normalizeCat(c.category) === targetNorm).length
    };
  });

  // Chart 2: Sentiment distribution
  const sentimentsList = ["NEGATIF", "NETRAL", "POSITIF"];
  const sentimentColors = ["#ef4444", "#94a3b8", "#10b981"];
  const sentimentData = sentimentsList.map((sent, idx) => {
    return {
      name: sent,
      value: complaints.filter(c => c.sentiment === sent).length,
      color: sentimentColors[idx]
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">Selesai</span>;
      case "IN_PROGRESS":
        return <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold animate-pulse">Diproses</span>;
      default:
        return <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">Baru</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "KRITIS":
        return <span className="text-[10px] bg-red-600/15 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md font-bold">KRITIS</span>;
      case "TINGGI":
        return <span className="text-[10px] bg-rose-500/15 text-rose-600 px-2 py-0.5 rounded-md font-bold">TINGGI</span>;
      case "SEDANG":
        return <span className="text-[10px] bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-md font-bold">SEDANG</span>;
      default:
        return <span className="text-[10px] bg-slate-500/15 text-slate-600 px-2 py-0.5 rounded-md font-bold">RENDAH</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
            Tugas Kelompok 2 • Admin Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Aspirasi Kampus Panel</h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Monitor suara mahasiswa, tinjau pengelompokan kategori keluhan secara otomatis, dan berikan respon tindak lanjut penyelesaian laporan secara sistematis.
          </p>
        </div>

        <Link href="/admin/complaints" className="shrink-0">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-2">
            Kelola Antrean Keluhan
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>

      {/* ADMIN METRICS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Metric 1: Total complaints */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Masuk</p>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{totalCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Aspirasi dari mahasiswa</p>
          </div>
        </div>

        {/* Metric 2: ACTION REQUIRED */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Laporan Baru</p>
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">{newCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Perlu verifikasi & tindakan</p>
          </div>
        </div>

        {/* Metric 3: HIGH SEVERITY */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Urgensi Tinggi</p>
            <div className="p-2 bg-rose-500/10 text-rose-600 rounded-lg">
              <ShieldAlert className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-rose-600">{highSeverityCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Status belum tuntas</p>
          </div>
        </div>

        {/* Metric 4: NEGATIVE SENTIMENT */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sentimen Negatif</p>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <TrendingDown className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-600">{negativeSentimentCount}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Keluhan ketidakpuasan</p>
          </div>
        </div>
      </section>

      {/* RECHARTS VISUALIZATION CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart 1: Bar Category Chart */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Penyebaran Berdasarkan Kategori</h3>
            <h2 className="text-md md:text-lg font-bold tracking-tight">Kategori Fasilitas Terpopuler</h2>
          </div>
          
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    borderRadius: "0.5rem",
                    fontSize: "12px"
                  }} 
                />
                <Bar dataKey="Jumlah Keluhan" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pie Sentiment Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-semibold">Distribusi Laporan</h3>
            <h2 className="text-md md:text-lg font-bold tracking-tight">Analisis Sentimen Mahasiswa</h2>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute text-center space-y-0.5">
              <p className="text-xl font-extrabold">{totalCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Laporan</p>
            </div>
          </div>

          {/* Pie Legends */}
          <div className="flex justify-center gap-4 pt-2">
            {sentimentData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground font-semibold">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK INBOX TABLE / NEW ACTIONS REQUIRED */}
      <section className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 md:p-6 border-b border-border flex justify-between items-center">
          <div className="space-y-0.5">
            <h3 className="font-bold text-md tracking-tight">Daftar Antrean Masuk (Status: Baru)</h3>
            <p className="text-xs text-muted-foreground">Butuh tinjauan kategori keluhan dan pembaruan pengerjaan</p>
          </div>
          <Link href="/admin/complaints" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Lihat Semua Antrean
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {complaints.filter(c => c.status === "NEW").length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-2">
              <CheckCircle2 className="size-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold">Semua laporan telah ditangani atau diproses!</p>
            </div>
          ) : (
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 md:p-5">Pengirim</th>
                  <th className="p-4 md:p-5">Teks Keluhan</th>
                  <th className="p-4 md:p-5">Kategori</th>
                  <th className="p-4 md:p-5">Urgensi</th>
                  <th className="p-4 md:p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/65">
                {complaints.filter(c => c.status === "NEW").slice(0, 3).map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10 text-xs md:text-sm font-normal">
                    <td className="p-4 md:p-5 shrink-0 whitespace-nowrap">
                      <div className="font-semibold text-foreground">{item.userName}</div>
                      <div className="text-[10px] text-muted-foreground">{item.userNim}</div>
                    </td>
                    <td className="p-4 md:p-5 max-w-sm truncate text-muted-foreground font-normal">
                      {item.text}
                    </td>
                    <td className="p-4 md:p-5">
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 md:p-5">
                      {getSeverityBadge(item.severity)}
                    </td>
                    <td className="p-4 md:p-5 text-right">
                      <Link href={`/admin/complaints`}>
                        <Button className="h-8 text-[11px] bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold px-3 py-1 rounded-lg">
                           Buka Console
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
