"use client";

import React from "react";
import { BarChart2, BookOpen, FileCheck, User, HelpCircle } from "lucide-react";
import { ActiveSection } from "./Sidebar";

interface BottomNavProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "pyq_hub", label: "PYQs/Mocks", icon: FileCheck },
    { id: "vocab", label: "Vocab", icon: BookOpen },
    { id: "mcq", label: "Practice", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectSection(tab.id as ActiveSection)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
