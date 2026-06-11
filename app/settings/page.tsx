import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Pengaturan Akun • Aspirasi Kampus",
  description: "Ubah kata sandi dan sesuaikan preferensi akun Anda secara aman terintegrasi database.",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch the fresh user data from PostgreSQL via Prisma v7
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nim: true,
      username: true,
      name: true,
      role: true,
      major: true,
      createdAt: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return <SettingsClient user={user} />;
}
