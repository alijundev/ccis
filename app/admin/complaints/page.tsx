import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminComplaintsClient, { MappedComplaintDetail } from "./AdminComplaintsClient";

export default async function AdminComplaintsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch complaints from db using Prisma v7
  const dbComplaints = await db.complaint.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      recommendations: true,
    },
  });

  // Map to MappedComplaintDetail format
  const mappedComplaints: MappedComplaintDetail[] = dbComplaints.map((c) => ({
    id: c.id,
    userId: c.userId,
    userName: c.user.name,
    userNim: c.user.nim || "admin",
    userMajor: c.user.major || "Lembaga Penjamin Mutu",
    text: c.text,
    location: c.location || "",
    category: c.category,
    sentiment: c.sentiment,
    severity: c.severity,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    recommendations: c.recommendations.map((r) => r.text),
  }));

  return <AdminComplaintsClient initialComplaints={mappedComplaints} />;
}
