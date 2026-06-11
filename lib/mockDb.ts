export interface Complaint {
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
  confidence: number;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  recommendations: string[];
}

export const DEFAULT_COMPLAINTS: Complaint[] = [
  {
    id: "comp-1",
    userId: "stud-1",
    userName: "Budi Santoso",
    userNim: "2109876543",
    userMajor: "Informatika '21",
    text: "Koneksi wifi di Gedung Kuliah Bersama (GKB) lantai 3 sering sekali terputus terutama saat jam kuliah siang. Sangat mengganggu proses pengerjaan kuis online.",
    location: "GKB Lantai 3",
    category: "WiFi / Internet",
    sentiment: "NEGATIF",
    severity: "TINGGI",
    confidence: 0.945,
    status: "IN_PROGRESS",
    createdAt: "2026-06-10T10:30:00Z",
    recommendations: [
      "Prioritaskan pengecekan jaringan di lokasi keluhan.",
      "Periksa access point dan bandwidth.",
      "Eskalasi ke unit teknis jaringan kampus."
    ]
  },
  {
    id: "comp-2",
    userId: "stud-2",
    userName: "Andi Wijaya",
    userNim: "2109876512",
    userMajor: "Sistem Informasi '22",
    text: "AC di kelas R.302 bocor airnya menetes ke kursi baris tengah. Mahasiswa jadi terganggu konsentrasinya karena lantai menjadi licin.",
    location: "Gedung A, R.302",
    category: "Ruang Kelas",
    sentiment: "NEGATIF",
    severity: "SEDANG",
    confidence: 0.887,
    status: "NEW",
    createdAt: "2026-06-11T08:15:00Z",
    recommendations: [
      "Periksa AC, pencahayaan, atau proyektor di ruang kelas terkait.",
      "Koordinasikan dengan unit sarana prasarana untuk perbaikan minor."
    ]
  },
  {
    id: "comp-3",
    userId: "stud-3",
    userName: "Siti Rahma",
    userNim: "2109876499",
    userMajor: "Teknik Sipil '20",
    text: "Kondisi toilet putri di dekat laboratorium sangat bau karena kran air tidak mengalir. Mohon segera diperbaiki karena ini fasilitas vital.",
    location: "Gedung Lab Terpadu",
    category: "Toilet",
    sentiment: "NEGATIF",
    severity: "TINGGI",
    confidence: 0.962,
    status: "NEW",
    createdAt: "2026-06-11T14:45:00Z",
    recommendations: [
      "Prioritaskan perbaikan pipa air utama yang pecah atau toilet mampet total.",
      "Segera atasi masalah bau menyengat atau ketiadaan air bersih."
    ]
  },
  {
    id: "comp-4",
    userId: "stud-4",
    userName: "Rian Hidayat",
    userNim: "2109876450",
    userMajor: "Teknik Elektro '21",
    text: "Antrean pelayanan berkas beasiswa di Biro Administrasi Akademik sangat lambat dan petugasnya kurang ramah dalam memberikan informasi.",
    location: "Gedung Rektorat Lt. 1",
    category: "Pelayanan Akademik",
    sentiment: "NEGATIF",
    severity: "RENDAH",
    confidence: 0.812,
    status: "RESOLVED",
    createdAt: "2026-06-08T09:00:00Z",
    recommendations: [
      "Evaluasi kepuasan layanan loket akademik secara berkala."
    ]
  },
  {
    id: "comp-5",
    userId: "stud-5",
    userName: "Dewi Lestari",
    userNim: "2109876321",
    userMajor: "Manajemen '23",
    text: "Area parkir motor blok C sangat berantakan dan tidak ada marka parkir yang jelas, sehingga motor sering kali saling mengunci dan susah dikeluarkan.",
    location: "Parkiran Blok C (Samping kantin)",
    category: "Parkiran",
    sentiment: "NEGATIF",
    severity: "RENDAH",
    confidence: 0.895,
    status: "RESOLVED",
    createdAt: "2026-06-05T11:20:00Z",
    recommendations: [
      "Lakukan perapian marka parkir atau rambu penunjuk arah."
    ]
  },
  {
    id: "comp-6",
    userId: "stud-1",
    userName: "Budi Santoso",
    userNim: "2109876543",
    userMajor: "Informatika '21",
    text: "Toilet di lantai 1 Gedung perpustakaan sudah bersih sekali, sabun dan tisu juga lengkap terisi. Terima kasih tim kebersihan kampus!",
    location: "Gedung Perpustakaan Lt. 1",
    category: "Toilet",
    sentiment: "POSITIF",
    severity: "RENDAH",
    confidence: 0.981,
    status: "RESOLVED",
    createdAt: "2026-06-07T13:10:00Z",
    recommendations: [
      "Ingatkan petugas kebersihan untuk menjaga ketersediaan tisu dan sabun."
    ]
  },
  {
    id: "comp-7",
    userId: "stud-6",
    userName: "Farhan Malik",
    userNim: "2109876111",
    userMajor: "Sastra Inggris '22",
    text: "Proyektor di ruang bahasa R.105 cahayanya redup sekali, sulit bagi kami yang duduk di belakang untuk membaca teks materi.",
    location: "Gedung Sastra, R.105",
    category: "Ruang Kelas",
    sentiment: "NEGATIF",
    severity: "SEDANG",
    confidence: 0.914,
    status: "IN_PROGRESS",
    createdAt: "2026-06-09T15:30:00Z",
    recommendations: [
      "Periksa AC, pencahayaan, atau proyektor di ruang kelas terkait.",
      "Koordinasikan dengan unit sarana prasarana untuk perbaikan minor."
    ]
  }
];

// Helper to get complaints from localStorage (client) or defaults (server)
export function getComplaints(): Complaint[] {
  if (typeof window === "undefined") {
    return DEFAULT_COMPLAINTS;
  }
  const stored = localStorage.getItem("campusvoice_complaints");
  if (!stored) {
    localStorage.setItem("campusvoice_complaints", JSON.stringify(DEFAULT_COMPLAINTS));
    return DEFAULT_COMPLAINTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_COMPLAINTS;
  }
}

// Helper to save a complaint
export function addComplaint(complaint: Omit<Complaint, "id" | "createdAt" | "status">): Complaint {
  const complaints = getComplaints();
  const newComplaint: Complaint = {
    ...complaint,
    id: `comp-${Date.now()}`,
    status: "NEW",
    createdAt: new Date().toISOString()
  };
  
  const updated = [newComplaint, ...complaints];
  if (typeof window !== "undefined") {
    localStorage.setItem("campusvoice_complaints", JSON.stringify(updated));
  }
  return newComplaint;
}

// Helper to update status
export function updateComplaintStatus(id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED"): boolean {
  const complaints = getComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return false;
  
  complaints[idx].status = status;
  if (typeof window !== "undefined") {
    localStorage.setItem("campusvoice_complaints", JSON.stringify(complaints));
  }
  return true;
}

// Fallback Local NLP Analyzer
export function analyzeComplaintText(text: string): {
  category: string;
  sentiment: string;
  severity: string;
  confidence: number;
  recommendations: string[];
} {
  const lowerText = text.toLowerCase();
  
  let category = "Pelayanan Akademik";
  let sentiment = "NEGATIF";
  let severity = "SEDANG";
  let confidence = 0.85 + Math.random() * 0.12; // 85% to 97% confidence
  
  // 1. Category Detection
  if (lowerText.includes("wifi") || lowerText.includes("internet") || lowerText.includes("koneksi") || lowerText.includes("jaringan") || lowerText.includes("hotspot")) {
    category = "WiFi / Internet";
  } else if (lowerText.includes("ac") || lowerText.includes("kelas") || lowerText.includes("ruang") || lowerText.includes("kursi") || lowerText.includes("proyektor") || lowerText.includes("papan tulis") || lowerText.includes("meja")) {
    category = "Ruang Kelas";
  } else if (lowerText.includes("parkir") || lowerText.includes("motor") || lowerText.includes("mobil") || lowerText.includes("helm") || lowerText.includes("karcis") || lowerText.includes("marka")) {
    category = "Parkiran";
  } else if (lowerText.includes("toilet") || lowerText.includes("air") || lowerText.includes("wc") || lowerText.includes("sabun") || lowerText.includes("kran") || lowerText.includes("mampet")) {
    category = "Toilet";
  }
  
  // 2. Sentiment Detection
  if (lowerText.includes("bagus") || lowerText.includes("puas") || lowerText.includes("bersih") || lowerText.includes("nyaman") || lowerText.includes("lancar") || lowerText.includes("terima kasih") || lowerText.includes("mantap") || lowerText.includes("keren") || lowerText.includes("rapi")) {
    sentiment = "POSITIF";
    severity = "RENDAH";
  } else if (lowerText.includes("biasa") || lowerText.includes("lumayan") || lowerText.includes("cukup") || lowerText.includes("standar")) {
    sentiment = "NETRAL";
    severity = "RENDAH";
  }
  
  // 3. Severity Detection (if NEGATIF)
  if (sentiment === "NEGATIF") {
    if (lowerText.includes("rusak berat") || lowerText.includes("parah") || lowerText.includes("mati") || lowerText.includes("tidak bisa") || lowerText.includes("hilang") || lowerText.includes("mampet total") || lowerText.includes("bocor keras") || lowerText.includes("darurat") || lowerText.includes("kecurian")) {
      severity = "TINGGI";
    } else if (lowerText.includes("lambat") || lowerText.includes("kurang") || lowerText.includes("kotor") || lowerText.includes("bocor") || lowerText.includes("antre") || lowerText.includes("panas")) {
      severity = "SEDANG";
    } else {
      severity = "RENDAH";
    }
  }

  // 4. Recommendation Mapping
  const RULE_RECOMMENDATIONS: Record<string, Record<string, string[]>> = {
    "WiFi / Internet": {
      "RENDAH": ["Lakukan monitoring kualitas jaringan secara berkala."],
      "SEDANG": ["Periksa access point pada lokasi keluhan.", "Cek kestabilan koneksi jaringan."],
      "TINGGI": ["Prioritaskan pengecekan jaringan di lokasi keluhan.", "Periksa access point dan bandwidth.", "Eskalasi ke unit teknis jaringan kampus."]
    },
    "Ruang Kelas": {
      "RENDAH": ["Agendakan pembersihan rutin tambahan pada ruang kelas."],
      "SEDANG": ["Periksa AC, pencahayaan, atau proyektor di ruang kelas terkait.", "Koordinasikan dengan unit sarana prasarana untuk perbaikan minor."],
      "TINGGI": ["Segera eskalasi perbaikan fasilitas krusial (AC mati, atap bocor, proyektor rusak).", "Pindahkan perkuliahan sementara jika ruangan tidak kondusif."]
    },
    "Parkiran": {
      "RENDAH": ["Lakukan perapian marka parkir atau rambu penunjuk arah."],
      "SEDANG": ["Tingkatkan patroli keamanan di area parkir pada jam sibuk.", "Atur ulang tata letak parkir untuk mengoptimalkan ruang."],
      "TINGGI": ["Eskalasi keluhan mengenai kehilangan barang atau sengketa parkir ke pihak keamanan kampus.", "Lakukan perbaikan darurat pada gerbang otomatis atau aspal yang rusak berat."]
    },
    "Toilet": {
      "RENDAH": ["Ingatkan petugas kebersihan untuk menjaga ketersediaan tisu dan sabun."],
      "SEDANG": ["Lakukan perbaikan pada kran bocor atau saluran pembuangan lambat.", "Tingkatkan frekuensi pembersihan toilet dalam sehari."],
      "TINGGI": ["Prioritaskan perbaikan pipa air utama yang pecah atau toilet mampet total.", "Segera atasi masalah bau menyengat atau ketiadaan air bersih."]
    },
    "Pelayanan Akademik": {
      "RENDAH": ["Evaluasi kepuasan layanan loket akademik secara berkala."],
      "SEDANG": ["Berikan feedback atau teguran kepada staf layanan terkait kelambatan respons.", "Sediakan panduan alur birokrasi yang lebih jelas untuk mahasiswa."],
      "TINGGI": ["Eskalasi masalah administrasi krusial (nilai error, kendala wisuda/registrasi) ke Kepala Biro Akademik.", "Lakukan tinjauan menyeluruh terhadap sistem informasi akademik yang mengalami kendala sistemis."]
    }
  };

  const recommendations = RULE_RECOMMENDATIONS[category]?.[severity] || ["Terima kasih atas laporan Anda. Kami akan melakukan verifikasi terlebih dahulu."];

  return {
    category,
    sentiment,
    severity,
    confidence: parseFloat(confidence.toFixed(3)),
    recommendations
  };
}
