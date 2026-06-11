import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewComplaintFormClient from "./NewComplaintFormClient";

export default async function NewComplaintPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Title */}
      <div className="space-y-1.5 border-b border-border/60 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Kirim Aspirasi & Keluhan</h1>
        <p className="text-sm text-muted-foreground font-normal">
          Tuliskan kendala fasilitas atau layanan kampus Anda secara lengkap untuk dapat segera diproses oleh unit administrasi.
        </p>
      </div>

      <NewComplaintFormClient studentName={session.name} />
    </div>
  );
}
