"use server";

import db from "../db";
import bcrypt from "bcryptjs";
import { createSession, deleteSession, getSession } from "../auth";

export interface ActionResponse {
  success: boolean;
  error?: string;
  role?: string;
}

export async function registerAction(formData: FormData): Promise<ActionResponse> {
  try {
    const nim = formData.get("nim") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const major = formData.get("major") as string | null;

    if (!nim || !name || !password || !major) {
      return { success: false, error: "Semua kolom wajib diisi." };
    }

    // Check if student already exists by NIM
    const existingUser = await db.user.findUnique({
      where: { nim },
    });

    if (existingUser) {
      return { success: false, error: "NIM sudah terdaftar." };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (defaults to STUDENT role, username is null)
    const user = await db.user.create({
      data: {
        nim,
        username: null,
        name,
        passwordHash,
        major: major || null,
        role: "STUDENT",
      },
    });

    // Create session cookie
    await createSession(user);

    return { success: true, role: user.role };
  } catch (err: any) {
    console.error("Register Error:", err);
    return { success: false, error: "Terjadi kesalahan pada sistem." };
  }
}

export async function loginAction(formData: FormData): Promise<ActionResponse> {
  try {
    const role = formData.get("role") as string || "STUDENT";
    const password = formData.get("password") as string;
    const nimOrUsername = (role === "ADMIN" 
      ? (formData.get("username") || formData.get("nim"))
      : (formData.get("nim") || formData.get("username"))
    ) as string;

    if (!nimOrUsername || !password) {
      return { success: false, error: "Semua kolom wajib diisi." };
    }

    let user = null;

    if (role === "ADMIN") {
      // Find admin by username
      user = await db.user.findUnique({
        where: { username: nimOrUsername },
      });
    } else {
      // Find student by NIM
      user = await db.user.findUnique({
        where: { nim: nimOrUsername },
      });
    }

    if (!user || user.role !== role) {
      return { success: false, error: `${role === "ADMIN" ? "Username" : "NIM"} atau password salah.` };
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: `${role === "ADMIN" ? "Username" : "NIM"} atau password salah.` };
    }

    // Create session cookie
    await createSession(user);

    return { success: true, role: user.role };
  } catch (err: any) {
    console.error("Login Error:", err);
    return { success: false, error: "Terjadi kesalahan pada sistem." };
  }
}

export async function logoutAction() {
  await deleteSession();
}

export async function updatePasswordAction(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Semua kolom kata sandi wajib diisi." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi sandi baru tidak sesuai." };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Sandi baru harus minimal 6 karakter." };
    }

    // Fetch user from DB to verify old password
    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    // Compare with existing hash
    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Kata sandi lama salah." };
    }

    // Hash and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: session.userId },
      data: { passwordHash },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Update Password Error:", err);
    return { success: false, error: "Gagal memperbarui kata sandi." };
  }
}

