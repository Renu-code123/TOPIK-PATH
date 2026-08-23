"use client";

import React, { useState } from "react";
import { Flame, Zap, CheckCircle2, Menu, LogOut, User } from "lucide-react";
import { getLevelFromXp, getNextLevelProgress } from "@/lib/xp";
import { MascotLogo } from "../brand/MascotLogo";

interface TopBarProps {
  xp: number;
  streak: number;
  masteredCount: number;
  selectedTarget: "ALL" | "TOPIK_I" | "TOPIK_II";
  onSelectTarget: (target: "ALL" | "TOPIK_I" | "TOPIK_II") => void;
  onOpenMobileMenu?: () => void;
  userName?: string;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  xp,
  streak,
  masteredCount,
  selectedTarget,
  onSelectTarget,
  onOpenMobileMenu,
  userName,
  onLogout,
}) => {
  const currentTier = getLevelFromXp(xp);
  const nextProgress = getNextLevelProgress(xp);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Menu Button + Level Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <MascotLogo size="sm" showTagline={false} />
        </div>

        {/* Level Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 text-xs">
          {[
            { id: "ALL", label: "All Levels" },
            { id: "TOPIK_I", label: "TOPIK I (1-2)" },
            { id: "TOPIK_II", label: "TOPIK II (3-6)" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTarget(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedTarget === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gamification Badges + User Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Level Tier Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-base">{currentTier.icon}</span>
          <div>
            <div className="font-bold text-white leading-none">{currentTier.title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {nextProgress.xpNeeded > 0 ? `${nextProgress.xpNeeded} XP to next rank` : "Max Rank"}
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-bold text-amber-300">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{streak} Days</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs font-bold text-indigo-300">
          <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
          <span>{xp} XP</span>
        </div>

        {/* Mastered Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{masteredCount} Words</span>
        </div>

        {/* User Avatar / Logout */}
        {userName && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500/50 text-xs font-bold text-slate-300 hover:text-white transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline max-w-[80px] truncate">{userName}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="text-xs font-bold text-white truncate">{userName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Signed in</div>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); onLogout?.(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-all text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
