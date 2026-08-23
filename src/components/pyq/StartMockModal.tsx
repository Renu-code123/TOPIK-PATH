"use client";

import React from "react";
import { ExternalResourceItem } from "@/data/external-resources";
import { ExternalLink, Clock, ShieldCheck, X, ArrowRight } from "lucide-react";

interface StartMockModalProps {
  resource: ExternalResourceItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StartMockModal: React.FC<StartMockModalProps> = ({
  resource,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101b] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl">
            ⏱️
          </div>
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              External Exam Practice
            </div>
            <h3 className="text-lg font-black text-white">{resource.title}</h3>
          </div>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-sm text-slate-300">
          <p className="font-semibold text-white">
            You're about to practice on <span className="text-blue-400 font-bold">{resource.providerName}</span>.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            The full interactive timed mock test runs on the external website. When you finish your test, return to TOPIKPath to record your score and update your analytics!
          </p>
        </div>

        {/* Exam Specifications */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-bold">TYPE</div>
            <div className="font-bold text-slate-200 mt-0.5">{resource.examType.replace("_", " ")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-bold">TIME LIMIT</div>
            <div className="font-bold text-slate-200 mt-0.5">{resource.timeLimitMins || 100} Mins</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-bold">QUESTIONS</div>
            <div className="font-bold text-slate-200 mt-0.5">{resource.questionCount || 70} Qs</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            <span>Open {resource.providerName}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Small Disclaimer */}
        <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Practice opens safely in a new browser tab</span>
        </div>
      </div>
    </div>
  );
};
