import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    console.log("Menjalankan seed database PRODUCTION (Hanya Admin)...");

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    // Cek apakah admin sudah terdaftar
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
        username: adminUsername
      }
    });

    if (!existingAdmin) {
      console.log(`Membuat akun Admin baru: ${adminUsername}`);
      const adminPasswordHash = await hash(adminPassword, 10);
      
      await prisma.user.create({
        data: {
          username: adminUsername,
          name: adminName,
          passwordHash: adminPasswordHash,
          role: "ADMIN"
        }
      });
      console.log("Akun Admin berhasil dibuat untuk production!");
    } else {
      console.log("Akun Admin sudah terdaftar, melewati pembuatan.");
    }
    return;
  }

  console.log("Menghapus data lama...");
  await prisma.recommendation.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Membuat pengguna bawaan...");
  const adminPasswordHash = await hash("admin123", 10);
  const studentPasswordHash = await hash("budi123", 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      name: "Admin Academic",
      passwordHash: adminPasswordHash,
      role: "ADMIN"
    }
  });

  // 2. Create Student
  const student = await prisma.user.create({
    data: {
      nim: "2109876543",
      name: "Budi Santoso",
      passwordHash: studentPasswordHash,
      major: "Informatika",
      role: "STUDENT"
    }
  });

  console.log("Berhasil membuat pengguna: admin dan student.");

  console.log("Membuat keluhan awal untuk simulasi...");

  const complaintsData = [
    {
      userId: student.id,
      text: "Koneksi WiFi di area Perpustakaan Lantai 2 lambat sekali, sering putus sendiri dan tidak bisa dipakai untuk mengakses portal e-learning kampus.",
      location: "Perpustakaan Lantai 2",
      category: "WiFi / Internet",
      sentiment: "NEGATIF",
      severity: "SEDANG",
      status: "IN_PROGRESS",
      recommendations: [
        "Periksa access point pada lokasi keluhan Perpustakaan Lantai 2.",
        "Cek kestabilan koneksi jaringan dan bandwidth wifi."
      ]
    },
    {
      userId: student.id,
      text: "Proyektor di Gedung B Ruang Kelas 3.2 mati total saat dosen sedang menerangkan materi kuliah. Kabel HDMI sepertinya putus di dalam.",
      location: "Gedung B Ruang 3.2",
      category: "Ruang Kelas",
      sentiment: "NEGATIF",
      severity: "TINGGI",
      status: "NEW",
      recommendations: [
        "Segera eskalasi perbaikan fasilitas krusial proyektor mati di Ruang 3.2 Gedung B.",
        "Koordinasikan dengan unit sarana prasarana untuk penggantian kabel HDMI baru."
      ]
    },
    {
      userId: student.id,
      text: "Marka garis parkir motor di dekat Gedung C sudah pudar dan tidak terlihat, membuat tata letak kendaraan kacau dan parkir sembarangan menghalangi jalan keluar.",
      location: "Parkiran Gedung C",
      category: "Parkiran",
      sentiment: "NEGATIF",
      severity: "RENDAH",
      status: "NEW",
      recommendations: [
        "Lakukan pengecatan ulang/perapian marka parkir di Parkiran Gedung C.",
        "Pasang rambu penunjuk arah parkir tambahan."
      ]
    },
    {
      userId: student.id,
      text: "Kran air di wastafel toilet lantai 1 Gedung Utama pecah, air kotornya terus meluap menggenangi lantai sampai licin dan berbau tidak sedap.",
      location: "Toilet Lantai 1 Gedung Utama",
      category: "Toilet",
      sentiment: "NEGATIF",
      severity: "TINGGI",
      status: "RESOLVED",
      recommendations: [
        "Prioritaskan perbaikan pipa air utama yang pecah dan ganti kran wastafel toilet lantai 1.",
        "Ingatkan petugas kebersihan untuk mengeringkan genangan air agar lantai tidak licin."
      ]
    },
    {
      userId: student.id,
      text: "Petugas administrasi di loket pelayanan BAA kurang ramah dan lambat sekali dalam memproses berkas legalisir ijazah, antrean antre sangat panjang.",
      location: "Biro Administrasi Akademik",
      category: "Pelayanan Akademik",
      sentiment: "NEGATIF",
      severity: "SEDANG",
      status: "RESOLVED",
      recommendations: [
        "Berikan teguran dan pengarahan kepada staf loket BAA terkait kelambatan respons layanan.",
        "Sediakan papan alur birokrasi dan persyaratan berkas yang lebih jelas di ruang tunggu."
      ]
    }
  ];

  for (const item of complaintsData) {
    const { recommendations, ...complaintFields } = item;
    const complaint = await prisma.complaint.create({
      data: complaintFields
    });

    // Create recommendations linked to complaint
    for (const recText of recommendations) {
      const isForAdmin = recText.toLowerCase().includes("petugas") || 
                        recText.toLowerCase().includes("periksa") || 
                        recText.toLowerCase().includes("eskalasi") || 
                        recText.toLowerCase().includes("lakukan") || 
                        recText.toLowerCase().includes("berikan") || 
                        recText.toLowerCase().includes("koordinasikan") || 
                        recText.toLowerCase().includes("prioritaskan") || 
                        recText.toLowerCase().includes("ingatkan");
      await prisma.recommendation.create({
        data: {
          complaintId: complaint.id,
          text: recText,
          target: isForAdmin ? "ADMIN" : "STUDENT"
        }
      });
    }
  }

  console.log("Berhasil membuat data keluhan awal.");
}

main()
  .catch((e) => {
    console.error("Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
