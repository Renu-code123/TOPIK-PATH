"use client";

import React from "react";
import {
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  PenTool,
  Bookmark,
  Award,
  Calendar,
  Sparkles,
  BarChart2,
  FileCheck,
  User,
  TrendingUp,
} from "lucide-react";
import { MascotLogo } from "../brand/MascotLogo";

export type ActiveSection =
  | "dashboard"
  | "vocab"
  | "flashcards"
  | "mcq"
  | "grammar"
  | "pyq_hub"
  | "mock_tests"
  | "writing"
  | "mistakes"
  | "planner"
  | "achievements"
  | "profile";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  xp: number;
  streak: number;
  mistakesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  xp,
  streak,
  mistakesCount,
}) => {
  const navGroups: NavGroup[] = [
    {
      title: "OVERVIEW",
      items: [
        { id: "dashboard", label: "Command Center", icon: BarChart2, badge: "Live" },
        { id: "profile", label: "My Profile & Growth", icon: User, badge: "Analytics" },
      ],
    },
    {
      title: "OFFICIAL EXAMS & PYQs",
      items: [
        {
          id: "pyq_hub",
          label: "📝 PYQs & Mock Tests",
          icon: FileCheck,
          badge: "NEW",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        },
        { id: "mock_tests", label: "In-App Mock Center", icon: Clock, badge: "PBT/IBT" },
      ],
    },
    {
      title: "LEARN & MEMORIZE",
      items: [
        { id: "vocab", label: "Vocab Explorer", icon: BookOpen, badge: "4.3k" },
        { id: "flashcards", label: "Flashcards Studio", icon: Layers, badge: "SM-2" },
        { id: "grammar", label: "Grammar Patterns", icon: FileText },
      ],
    },
    {
      title: "PRACTICE & TESTS",
      items: [
        { id: "mcq", label: "MCQ Quiz Engine", icon: HelpCircle, badge: "+XP" },
        { id: "writing", label: "Writing Lab", icon: PenTool, badge: "51-54" },
      ],
    },
    {
      title: "RETENTION & GOALS",
      items: [
        {
          id: "mistakes",
          label: "Mistake Notebook",
          icon: Bookmark,
          badge: mistakesCount > 0 ? `${mistakesCount}` : undefined,
          badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        },
        { id: "planner", label: "Study Planner", icon: Calendar },
        { id: "achievements", label: "Badges & Trophies", icon: Award },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col h-full shrink-0">
      {/* Brand Header with Mascot Logo */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <MascotLogo size="sm" showTagline={true} />
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id as ActiveSection)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-400"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                        item.badgeColor ||
                        (isActive
                          ? "bg-indigo-700 text-white"
                          : "bg-slate-800 text-slate-400 group-hover:text-slate-200")
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Quick Level Status Box */}
      <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Daily Target
          </span>
          <span className="text-slate-400">80%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-4/5" />
        </div>
        <p className="text-[10px] text-slate-400">🔥 {streak} days • ⚡ {xp} Total XP</p>
      </div>
    </aside>
  );
};
