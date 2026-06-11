import Link from "next/link";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ComplaintsListClient from "./ComplaintsListClient";

export default async function StudentComplaintsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch student's complaints with recommendations
  const dbComplaints = await db.complaint.findMany({
    where: { userId: session.userId },
    include: { recommendations: true },
    orderBy: { createdAt: "desc" },
  });

  // Map to filter recommendations targeting the STUDENT
  const mappedComplaints = dbComplaints.map((c) => ({
    ...c,
    recommendations: c.recommendations.filter((r) => r.target === "STUDENT")
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Riwayat Aspirasi</h1>
          <p className="text-sm text-muted-foreground font-normal">
            Daftar lengkap keluhan yang telah Anda kirimkan berserta status tindak lanjutnya.
          </p>
        </div>

        <Link href="/student/complaints/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold py-2 px-4 rounded-xl shadow-xs">
            Kirim Keluhan Baru
          </Button>
        </Link>
      </div>

      {/* Interactive client filter and display list */}
      <ComplaintsListClient initialComplaints={mappedComplaints as any} />
    </div>
  );
}
