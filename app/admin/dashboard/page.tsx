import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient, { MappedComplaint } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await getSession();
  
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch complaints from PostgreSQL via Prisma v7
  const complaints = await db.complaint.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          nim: true,
          major: true,
        }
      }
    }
  });

  // Map to format required by the visualization component
  const mappedComplaints: MappedComplaint[] = complaints.map((c) => ({
    id: c.id,
    userId: c.userId,
    userName: c.user.name,
    userNim: c.user.nim || "Admin",
    userMajor: c.user.major || "Fakultas",
    text: c.text,
    location: c.location || "Tidak spesifik",
    category: c.category,
    sentiment: c.sentiment,
    severity: c.severity,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }));

  return <AdminDashboardClient initialComplaints={mappedComplaints} />;
}
