"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Next.js Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-md w-full border border-border bg-card rounded-3xl p-8 md:p-10 shadow-xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
        
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mx-auto">
          <div className="size-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground">CampusVoice</span>
        </div>

        {/* Icon */}
        <div className="size-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto border border-destructive/20 animate-headShake">
          <AlertTriangle className="size-10 stroke-[1.5]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Terjadi Kesalahan Sistem</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Maaf atas ketidaknyamanan ini. Terjadi kesalahan internal saat memuat halaman ini. Tim pengembang kami telah merekam insiden ini.
          </p>
          {error.digest && (
            <p className="text-[10px] text-muted-foreground font-mono bg-muted/50 py-1 px-2.5 rounded-md inline-block">
              ID Error: {error.digest}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="h-11 font-semibold flex items-center justify-center gap-2 rounded-xl transition-all active:scale-98"
          >
            <RefreshCw className="size-4" />
            Coba Lagi
          </Button>

          <Link href="/">
            <Button className="w-full h-11 font-semibold flex items-center justify-center gap-2 rounded-xl transition-all active:scale-98 bg-primary text-primary-foreground hover:bg-primary/95">
              <Home className="size-4" />
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
