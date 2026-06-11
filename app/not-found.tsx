"use client";

import Link from "next/link";
import { HelpCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-md w-full border border-border bg-card rounded-3xl p-8 md:p-10 shadow-xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30" />
        
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mx-auto">
          <div className="size-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground">CampusVoice</span>
        </div>

        {/* Icon */}
        <div className="size-20 bg-muted/40 text-primary rounded-full flex items-center justify-center mx-auto border border-border">
          <HelpCircle className="size-10 stroke-[1.5]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
          <h2 className="text-lg font-bold text-foreground/90">Halaman Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan. Pastikan alamat URL yang Anda masukkan sudah benar.
          </p>
        </div>

        {/* Button */}
        <div className="pt-2">
          <Link href="/">
            <Button className="w-full h-11 font-semibold flex items-center justify-center gap-2 rounded-xl transition-all active:scale-98 bg-primary text-primary-foreground hover:bg-primary/95">
              <ArrowLeft className="size-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
