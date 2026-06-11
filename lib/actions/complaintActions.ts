/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "../db";
import { getSession } from "../auth";
import { revalidatePath } from "next/cache";

export interface ComplaintAnalysis {
  category: string;
  sentiment: string;
  severity: string;
  recommendations: string[];
  confidence?: string;
}

/// Remote NLP API analyzer
export async function analyzeComplaintText(text: string): Promise<ComplaintAnalysis> {
  const token = process.env.HF_TOKEN;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
  
  console.log("Mengirim keluhan ke API analisis NLP...");
  try {
    const response = await fetch("https://alijunai-api-keluhan-uho.hf.space/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token || ""}`
      },
      body: JSON.stringify({ keluhan: text }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API NLP mengembalikan status error ${response.status}`);
    }

    const data = await response.json();
    console.log("Respon API NLP Berhasil:", data);
    
    // Map API outputs correctly
    const category = data.kategori || "Pelayanan Akademik";
    const sentiment = (data.sentimen || "NEGATIF").toUpperCase();
    const severity = (data.tingkat_keparahan || "SEDANG").toUpperCase();
    
    // Calculate average confidence
    const avgConf = ((data.kategori_confidence || 90) + (data.sentimen_confidence || 90)) / 2;
    const confidence = `${avgConf.toFixed(1)}%`;
    
    // Combine student and admin recommendations
    const recs: string[] = [];
    if (Array.isArray(data.rekomendasi_mahasiswa)) {
      recs.push(...data.rekomendasi_mahasiswa);
    }
    if (Array.isArray(data.rekomendasi_admin)) {
      recs.push(...data.rekomendasi_admin);
    }
    
    return {
      category,
      sentiment,
      severity,
      recommendations: recs.length > 0 ? recs : ["Terima kasih atas laporan Anda. Kami akan melakukan verifikasi terlebih dahulu."],
      confidence
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Kesalahan API NLP:", error);
    throw new Error(error.message || "Gagal menghubungi layanan analisis NLP.");
  }
}

export async function submitComplaintAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }

    const text = formData.get("text") as string;
    const location = formData.get("location") as string || null;

    if (!text || text.trim().length < 10) {
      return { success: false, error: "Isi laporan minimal 10 karakter." };
    }

    const analysis = await analyzeComplaintText(text);

    // Create complaint in DB
    const complaint = await db.complaint.create({
      data: {
        userId: session.userId,
        text,
        location,
        category: analysis.category,
        sentiment: analysis.sentiment,
        severity: analysis.severity,
        status: "NEW"
      }
    });

    // Create matching recommendations in DB
    for (const recText of analysis.recommendations) {
      await db.recommendation.create({
        data: {
          complaintId: complaint.id,
          text: recText
        }
      });
    }

    revalidatePath("/student");
    revalidatePath("/admin");

    return { success: true, complaintId: complaint.id };
  } catch (err: any) {
    console.error("Submit Complaint Error:", err);
    return { success: false, error: "Gagal mengirimkan laporan." };
  }
}

export async function updateComplaintStatusAction(complaintId: string, status: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Akses ditolak. Sesi admin tidak valid." };
    }

    await db.complaint.update({
      where: { id: complaintId },
      data: { status }
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (err: any) {
    console.error("Update Complaint Error:", err);
    return { success: false, error: "Gagal memperbarui status laporan." };
  }
}
