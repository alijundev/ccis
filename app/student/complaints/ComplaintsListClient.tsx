"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Recommendation {
  id: string;
  text: string;
}

interface Complaint {
  id: string;
  text: string;
  location: string | null;
  category: string;
  sentiment: string;
  severity: string;
  status: string;
  createdAt: Date;
  recommendations: Recommendation[];
}

interface ComplaintsListClientProps {
  initialComplaints: any[];
}

export default function ComplaintsListClient({ initialComplaints }: ComplaintsListClientProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["ALL", "WiFi / Internet", "Ruang Kelas", "Parkiran", "Toilet", "Pelayanan Akademik"];
  const statuses = [
    { value: "ALL", label: "Semua Status" },
    { value: "NEW", label: "Baru" },
    { value: "IN_PROGRESS", label: "Diproses" },
    { value: "RESOLVED", label: "Selesai" }
  ];

  const filteredComplaints = initialComplaints.filter((item: any) => {
    const matchesSearch = item.text.toLowerCase().includes(search.toLowerCase()) || 
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
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            Selesai
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="size-3" />
            Diproses
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <AlertCircle className="size-3" />
            Baru
          </span>
        );
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIF":
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">POSITIF</span>;
      case "NETRAL":
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground border border-border">NETRAL</span>;
      default:
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/10">NEGATIF</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "KRITIS":
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/15 text-red-600 dark:text-red-400 border border-red-600/20">KRITIS</span>;
      case "TINGGI":
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/10">TINGGI</span>;
      case "SEDANG":
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/10">SEDANG</span>;
      default:
        return <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/15 text-slate-600 border border-slate-500/10">RENDAH</span>;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* FILTER & TOOLBAR CARD */}
      <div className="bg-card border border-border p-4 md:p-6 rounded-2xl shadow-xs space-y-4">
        {/* Row 1: Search & Status */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari keluhan atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/20 border border-border rounded-xl text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
            />
          </div>

          <div className="flex gap-2.5">
            {statuses.map((stat) => (
              <button
                key={stat.value}
                onClick={() => setStatusFilter(stat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-98 ${
                  statusFilter === stat.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Categories scrollbar */}
        <div className="border-t border-border/40 pt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-muted-foreground shrink-0 uppercase tracking-wider mr-2">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 active:scale-98 ${
                categoryFilter === cat
                  ? "bg-primary/10 text-primary border border-primary/25"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {cat === "ALL" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* COMPLAINTS LIST FEED */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-16 text-center space-y-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
              <Filter className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold">Tidak ada keluhan yang cocok</h4>
              <p className="text-xs text-muted-foreground font-normal">Coba ubah filter pencarian atau pilih kategori lainnya.</p>
            </div>
          </div>
        ) : (
          filteredComplaints.map((item: any) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={item.id}
                className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 shadow-xs hover:border-border/80"
              >
                {/* Header card area */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                        {item.category}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="size-3" />
                          {item.location}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-foreground line-clamp-1">
                      {item.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end border-t border-border/40 md:border-none pt-3 md:pt-0">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                    </div>
                    {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded recommendation and analytics area */}
                {isExpanded && (
                  <div className="bg-muted/15 border-t border-border px-5 py-6 md:px-8 space-y-6 animate-slideDown">
                    {/* Full Text */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Teks Laporan Lengkap:</p>
                      <p className="text-xs md:text-sm text-foreground leading-relaxed font-normal bg-card p-4 rounded-xl border border-border/40">
                        {item.text}
                      </p>
                    </div>

                    {/* Metadata indicators */}
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Sentimen Laporan</p>
                        <div className="mt-1">{getSentimentBadge(item.sentiment)}</div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tingkat Urgensi</p>
                        <div className="mt-1">{getSeverityBadge(item.severity)}</div>
                      </div>
                    </div>

                    {/* Recommendations and Admin logic */}
                    <div className="bg-card border border-border/80 rounded-xl p-5 space-y-3.5 shadow-sm">
                      <h4 className="text-xs md:text-sm font-bold flex items-center gap-2">
                        <Sparkles className="size-4 text-emerald-500" />
                        Rekomendasi Penanganan Sistem:
                      </h4>
                      <ul className="space-y-2">
                        {item.recommendations && item.recommendations.map((rec: any, idx: number) => (
                          <li key={rec.id || idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed font-normal">
                            <span className="size-4.5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            {rec.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Log Date */}
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/40">
                      <p className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        Dikirim pada: {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                      <p>ID Laporan: {item.id}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
