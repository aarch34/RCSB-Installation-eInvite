"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Sparkles, Smartphone, Trophy } from "lucide-react";
import QRCode from "qrcode";
import { EVENT, HOST_CLUBS } from "@/lib/constants";
import BackgroundGlow from "@/components/BackgroundGlow";
import NoiseTexture from "@/components/NoiseTexture";

export default function GamePosterPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [gameUrl, setGameUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const posterRef = useRef<HTMLDivElement>(null);

  // Generate dynamic QR code matching theme colors on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const targetUrl = `${origin}/service-quest`;
      setGameUrl(targetUrl);

      QRCode.toDataURL(targetUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: "#231815",  // Java Brown
          light: "#F5EFC8", // Transparent Yellow
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => {
          setQrCodeUrl(url);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to generate QR code", err);
          setIsLoading(false);
        });
    }
  }, []);

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  // Handle QR code image download
  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `service-quest-qr-${EVENT.title.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="relative min-h-screen w-full premium-radial-bg overflow-x-hidden flex flex-col items-center justify-start p-4 sm:p-8 select-none print:bg-white print:p-0 print:min-h-0">
      
      {/* Background elements - Hidden on print */}
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden">
        <BackgroundGlow isMobile={false} />
      </div>
      <div className="print:hidden">
        <NoiseTexture />
      </div>

      {/* Toolbar / Actions (Hidden on print) */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#A5BCD6]/70 hover:text-[#F5EFC8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadQR}
            disabled={isLoading || !qrCodeUrl}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#F5EFC8]/20 bg-[#231815]/60 text-xs text-[#A5BCD6] uppercase tracking-wider hover:bg-[#231815]/90 hover:border-[#F5EFC8]/45 hover:text-[#F5EFC8] active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR</span>
          </button>
          
          <button
            onClick={handlePrint}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#F5EFC8]/45 bg-[#F5EFC8] text-xs text-[#231815] font-semibold uppercase tracking-wider hover:bg-[#faf6db] active:scale-95 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,239,200,0.15)]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Poster</span>
          </button>
        </div>
      </div>

      {/* Poster Container */}
      <div
        ref={posterRef}
        className="relative z-10 w-full max-w-[640px] aspect-[1/1.414] rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/75 backdrop-blur-xl shadow-2xl p-8 sm:p-12 flex flex-col justify-between items-center text-center overflow-hidden
          print:border-0 print:rounded-none print:bg-white print:shadow-none print:w-full print:max-w-none print:aspect-none print:h-screen print:p-12 print:text-black"
        style={{ contentVisibility: "auto" }}
      >
        {/* Subtle Decorative Elements (Visible only on screen) */}
        <div className="absolute inset-4 rounded-xl border border-[#F5EFC8]/10 pointer-events-none print:border-2 print:border-[#231815]/30 print:inset-6" />
        <div className="absolute inset-[18px] rounded-lg border border-[#F5EFC8]/5 pointer-events-none print:border print:border-[#231815]/10 print:inset-[28px]" />

        {/* Elegant Corner Motifs */}
        <div className="absolute top-6 left-6 text-[#F5EFC8]/20 text-xs font-serif print:text-[#231815]/30 print:top-9 print:left-9">❖</div>
        <div className="absolute top-6 right-6 text-[#F5EFC8]/20 text-xs font-serif print:text-[#231815]/30 print:top-9 print:right-9">❖</div>
        <div className="absolute bottom-6 left-6 text-[#F5EFC8]/20 text-xs font-serif print:text-[#231815]/30 print:bottom-9 print:left-9">❖</div>
        <div className="absolute bottom-6 right-6 text-[#F5EFC8]/20 text-xs font-serif print:text-[#231815]/30 print:bottom-9 print:right-9">❖</div>

        {/* Header: Ceremony Details & Ganesha Emblem */}
        <div className="w-full space-y-4 relative z-10 pt-2 print:pt-4">
          <div className="flex justify-center mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ganesha.png"
              alt="Ganesha Emblem"
              className="w-14 h-auto object-contain drop-shadow-[0_0_10px_rgba(245,239,200,0.1)] opacity-[0.85] print:opacity-100 print:drop-shadow-none"
            />
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#A5BCD6]/80 print:text-[#231815]/70 font-light">
              Rotaract Clubs of Swarna Bengaluru & Bengaluru Nava Chaitanya
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-transparent-yellow font-normal tracking-wide drop-shadow-[0_0_15px_rgba(245,239,200,0.1)] print:text-[#231815] print:drop-shadow-none">
              {EVENT.title}
            </h2>
            <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase text-white/50 print:text-[#231815]/60 font-light">
              Joint Installation Ceremony • Year {EVENT.rotaryYear}
            </p>
          </div>
          
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/30 to-transparent mx-auto print:bg-none print:border-b print:border-[#231815]/20" />
        </div>

        {/* Center: Game Promotion & QR Code Box */}
        <div className="w-full flex-1 flex flex-col justify-center items-center py-6 sm:py-10 space-y-5 sm:space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#F5EFC8]/20 bg-[#F5EFC8]/5 text-[10px] text-[#F5EFC8] font-sans uppercase tracking-widest font-light print:border-[#231815]/30 print:text-[#231815]">
              <Sparkles className="w-3 h-3 text-[#F5EFC8] animate-pulse print:text-[#231815]" />
              <span>Interactive Event Game</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif italic font-medium text-transparent-yellow drop-shadow-[0_0_20px_rgba(245,239,200,0.12)] print:text-[#231815] print:drop-shadow-none">
              Service Quest
            </h1>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#A5BCD6]/70 print:text-[#231815]/75 font-sans font-light">
              Match the Spirit of Service
            </p>
          </div>

          {/* QR Code Frame */}
          <div className="relative group p-4 sm:p-5 rounded-2xl border border-[#F5EFC8]/25 bg-[#F5EFC8] shadow-[0_0_30px_rgba(245,239,200,0.1)] transition-transform duration-500 hover:scale-103 print:border-4 print:border-[#231815] print:shadow-none">
            {isLoading ? (
              <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-[#231815] border-[#231815]/20 animate-spin" />
              </div>
            ) : qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Scan to play Service Quest"
                className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center text-xs text-[#231815]">
                QR Code Generation Failed
              </div>
            )}
            
            {/* Elegant scan label overlay */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border border-[#F5EFC8]/35 bg-[#231815] text-[9px] text-[#F5EFC8] font-sans font-medium uppercase tracking-widest whitespace-nowrap shadow-md print:border-[#231815] print:bg-[#231815] print:text-white">
              Scan to Play
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <p className="text-xs sm:text-sm font-sans font-light text-white/90 leading-relaxed print:text-[#231815]/90">
              Flip and match Rotaract values like <span className="text-transparent-yellow font-normal print:text-black">Service, Fellowship, and Integrity</span>. Beat the clock and get ranked live!
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-[#A5BCD6] font-sans tracking-wide print:text-[#231815]/70">
              <Trophy className="w-3.5 h-3.5 text-[#F5EFC8] print:text-[#231815]" />
              <span>Live leaderboards displayed on the main stage screen!</span>
            </div>
          </div>
        </div>

        {/* Footer: Date, Venue, and Host Club Logos */}
        <div className="w-full space-y-4 pt-2 relative z-10 print:pt-4">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/30 to-transparent mx-auto print:bg-none print:border-b print:border-[#231815]/20" />
          
          <div className="flex items-center justify-center gap-4 text-xs font-sans tracking-wider text-[#A5BCD6]/85 print:text-[#231815] font-light">
            <div className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-[#F5EFC8] print:text-[#231815]" />
              <span>Open on Mobile Camera</span>
            </div>
            <span className="text-[#F5EFC8]/30">•</span>
            <div>
              <span>URL: </span>
              <span className="text-transparent-yellow font-normal underline break-all print:text-black">{gameUrl || "invite.rcsb.org/service-quest"}</span>
            </div>
          </div>

          {/* Joint Club Logos at the bottom of the poster */}
          <div className="flex items-center justify-center gap-5 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-swarna.png"
              alt="Rotaract Club of Swarna Bengaluru"
              className="h-10 sm:h-12 w-auto object-contain opacity-90 print:opacity-100"
            />
            <span className="text-[#F5EFC8]/45 text-xs font-serif italic print:text-[#231815]/50">&amp;</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-nava.png"
              alt="Rotaract Club of Bengaluru Nava Chaitanya"
              className="h-10 sm:h-12 w-auto object-contain opacity-90 print:opacity-100"
            />
          </div>

          <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 font-sans print:text-[#231815]/40 font-light">
            Rotary House of Friendship [RHF] • Sunday, 12th July 2026 • 6:00 PM
          </div>
        </div>
      </div>
    </main>
  );
}
