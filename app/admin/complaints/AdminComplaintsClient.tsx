"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Sparkles,
  Cpu,
  User,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateComplaintStatusAction } from "@/lib/actions/complaintActions";

export interface MappedComplaintDetail {
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
  recommendations: string[];
}

interface AdminComplaintsClientProps {
  initialComplaints: MappedComplaintDetail[];
}

export default function AdminComplaintsClient({ initialComplaints }: AdminComplaintsClientProps) {
  const [complaints, setComplaints] = useState<MappedComplaintDetail[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Synchronize database updates down to client state
  useEffect(() => {
    setComplaints(initialComplaints);
  }, [initialComplaints]);

  const categories = ["ALL", "WiFi / Internet", "Ruang Kelas", "Parkiran", "Toilet", "Pelayanan Akademik"];
  const statuses = [
    { value: "ALL", label: "Semua Status" },
    { value: "NEW", label: "Baru" },
    { value: "IN_PROGRESS", label: "Diproses" },
    { value: "RESOLVED", label: "Selesai" }
  ];
  const severities = ["ALL", "KRITIS", "TINGGI", "SEDANG", "RENDAH"];

  const filteredComplaints = complaints.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(search.toLowerCase()) || 
                          item.userName.toLowerCase().includes(search.toLowerCase()) ||
                          item.userNim.includes(search) ||
                          (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
    
    // Normalize category comparison for resilient filtering
    const normalizeCat = (cat: string) => {
      const c = cat.toLowerCase();
      if (c.includes("wifi") || c.includes("internet")) return "wifi";
      if (c.includes("kelas") || c.includes("ruang")) return "kelas";
      if (c.includes("parkir")) return "parkir";
      if (c.includes("toilet") || c.includes("wc")) return "toilet";
      return "akademik";
    };

    const matchesCategory = categoryFilter === "ALL" || normalizeCat(item.category) === normalizeCat(categoryFilter);
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesSeverity = severityFilter === "ALL" || item.severity === severityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const res = await updateComplaintStatusAction(id, newStatus);
    setUpdatingId(null);
    
    if (res.success) {
      // Update local state dynamically
      setComplaints(prev => 
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );
    } else {
      alert(res.error || "Gagal memperbarui status.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Selesai</span>;
      case "IN_PROGRESS":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">Diproses</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">Baru</span>;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIF":
        return <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/10">POSITIF</span>;
      case "NETRAL":
        return <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">NETRAL</span>;
      default:
        return <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded border border-destructive/10">NEGATIF</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "KRITIS":
        return <span className="text-[10px] font-bold bg-red-600/15 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-600/20">KRITIS</span>;
      case "TINGGI":
        return <span className="text-[10px] font-bold bg-rose-500/15 text-rose-600 px-2 py-0.5 rounded border border-rose-500/10">TINGGI</span>;
      case "SEDANG":
        return <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded border border-amber-500/10">SEDANG</span>;
      default:
        return <span className="text-[10px] font-bold bg-slate-500/15 text-slate-600 px-2 py-0.5 rounded border border-slate-500/10">RENDAH</span>;
    }
  };

  const activeComplaint = complaints.find(c => c.id === selectedId);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Title */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Antrean Keluhan Mahasiswa</h1>
        <p className="text-sm text-muted-foreground font-normal">
          Daftar seluruh aspirasi mahasiswa terdaftar. Evaluasi kategori keluhan dan perbarui status penanganannya.
        </p>
      </div>

      {/* COMPLAINTS MANAGER SPLIT LAYOUT (Master-Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Master List of Complaints */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi filters Toolbar */}
          <div className="bg-card border border-border p-4 md:p-5 rounded-2xl shadow-xs space-y-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kata kunci, nama, NIM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted/20 border border-border rounded-xl text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
              />
            </div>

            {/* Quick selectors dropdown layout / inline */}
            <div className="flex flex-wrap gap-3 pt-1">
              {/* Status Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-muted/30 border border-border rounded-lg text-xs px-2.5 py-1.5 focus:outline-hidden font-semibold text-foreground cursor-pointer"
                >
                  {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {/* Category Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Kategori</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-muted/30 border border-border rounded-lg text-xs px-2.5 py-1.5 focus:outline-hidden font-semibold text-foreground cursor-pointer"
                >
                  <option value="ALL">Semua Kategori</option>
                  {categories.filter(c => c !== "ALL").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Severity Filter */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Tingkat Urgensi</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-muted/30 border border-border rounded-lg text-xs px-2.5 py-1.5 focus:outline-hidden font-semibold text-foreground cursor-pointer"
                >
                  <option value="ALL">Semua Tingkat</option>
                  {severities.filter(s => s !== "ALL").map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Table List of Complaints */}
          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-3">
                <Filter className="size-10 text-muted-foreground mx-auto" />
                <h4 className="font-bold text-xs md:text-sm">Tidak ada keluhan ditemukan</h4>
                <p className="text-xs text-muted-foreground">Ubah saringan filter untuk melihat keluhan lainnya.</p>
              </div>
            ) : (
              filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`bg-card rounded-xl border p-5 transition-all duration-300 shadow-xs cursor-pointer select-none relative overflow-hidden ${
                    selectedId === item.id 
                      ? "border-primary ring-2 ring-primary/20 shadow-md bg-muted/5" 
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                          {item.category}
                        </span>
                        {getSeverityBadge(item.severity)}
                      </div>
                      
                      <p className="text-xs md:text-sm text-foreground line-clamp-2 pr-4 leading-relaxed font-normal">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {getStatusBadge(item.status)}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* sender metadata */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                    <User className="size-3.5" />
                    <span>{item.userName} ({item.userNim})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 5 Cols: Detail Action Console */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          {activeComplaint ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">
                    <Cpu className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">Action Console</h3>
                    <p className="text-[10px] text-muted-foreground">Detail analisis dan keputusan aksi</p>
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground font-mono">ID: {activeComplaint.id.substring(0, 8)}...</span>
              </div>

              {/* Student Bio */}
              <div className="space-y-3 bg-muted/15 p-4 rounded-xl border border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Identitas Pengirim:</h4>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">{activeComplaint.userName}</p>
                  <p className="text-[11px] text-muted-foreground">{activeComplaint.userNim} &bull; {activeComplaint.userMajor}</p>
                  {activeComplaint.location && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1 font-semibold">
                      <MapPin className="size-3 text-primary shrink-0" />
                      Lokasi: {activeComplaint.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Complete text */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pernyataan Keluhan:</h4>
                <p className="text-xs md:text-sm text-foreground leading-relaxed italic bg-muted/20 p-4 rounded-xl border border-border/40 font-normal">
                  "{activeComplaint.text}"
                </p>
              </div>

              {/* Metrics card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/10 p-3.5 rounded-lg border border-border text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sentimen Laporan</p>
                  <div className="mt-1.5 flex justify-center">{getSentimentBadge(activeComplaint.sentiment)}</div>
                </div>
                <div className="bg-muted/10 p-3.5 rounded-lg border border-border text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tingkat Urgensi</p>
                  <div className="mt-1.5 flex justify-center">{getSeverityBadge(activeComplaint.severity)}</div>
                </div>
              </div>

              {/* Action Recommendations rule list */}
              <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-1.5 text-primary">
                  <Sparkles className="size-4 shrink-0 text-amber-500" />
                  Rekomendasi Aksi (Automated):
                </h4>
                <ul className="space-y-2.5">
                  {activeComplaint.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed font-normal">
                      <span className="size-4.5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Change status buttons */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Pembaruan Status Penanganan:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleStatusChange(activeComplaint.id, "NEW")}
                    disabled={updatingId !== null}
                    className={`h-9 text-[11px] font-bold rounded-lg cursor-pointer ${
                      activeComplaint.status === "NEW"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Baru
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(activeComplaint.id, "IN_PROGRESS")}
                    disabled={updatingId !== null}
                    className={`h-9 text-[11px] font-bold rounded-lg cursor-pointer ${
                      activeComplaint.status === "IN_PROGRESS"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {updatingId === activeComplaint.id ? (
                      <RefreshCw className="size-3.5 animate-spin mx-auto" />
                    ) : (
                      "Proses"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(activeComplaint.id, "RESOLVED")}
                    disabled={updatingId !== null}
                    className={`h-9 text-[11px] font-bold rounded-lg cursor-pointer ${
                      activeComplaint.status === "RESOLVED"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Selesai
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border/80 border-dashed rounded-2xl p-12 text-center space-y-4 text-muted-foreground">
              <Cpu className="size-10 mx-auto text-muted-foreground/50 animate-bounce" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs md:text-sm text-foreground/80">Belum ada keluhan terpilih</h4>
                <p className="text-xs font-normal">Klik salah satu kartu keluhan di sebelah kiri untuk membuka console tindakan penanganan.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
