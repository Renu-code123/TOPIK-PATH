"use client";

import React, { useState } from "react";
import { ExternalAttemptRecord } from "@/data/external-resources";
import { TrendingUp, Award, Calendar, CheckCircle2 } from "lucide-react";

interface ScoreTrendChartProps {
  attempts: ExternalAttemptRecord[];
  maxScore?: number;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  attempts,
  maxScore = 200,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // If no attempts or only 1, supply realistic starter data points
  const displayAttempts = attempts.length > 0 ? attempts : [];

  if (displayAttempts.length === 0) {
    return (
      <div className="h-56 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center text-center p-6 space-y-2">
        <TrendingUp className="w-8 h-8 text-slate-600" />
        <p className="text-sm font-semibold text-slate-300">No mock test scores logged yet</p>
        <p className="text-xs text-slate-500 max-w-sm">
          Complete a past paper or mock test on TOPIK GUIDE and log your result to visualize your score progression.
        </p>
      </div>
    );
  }

  // Calculate chart dimensions
  const width = 600;
  const height = 200;
  const paddingX = 45;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const minScore = 80;
  const effectiveMax = maxScore;

  const points = displayAttempts.map((att, i) => {
    const x =
      displayAttempts.length === 1
        ? width / 2
        : paddingX + (i / (displayAttempts.length - 1)) * chartWidth;
    const normalizedScore = Math.max(minScore, Math.min(effectiveMax, att.totalScore));
    const y =
      height -
      paddingY -
      ((normalizedScore - minScore) / (effectiveMax - minScore)) * chartHeight;
    return { x, y, attempt: att };
  });

  const pathString =
    points.length === 1
      ? `M ${paddingX} ${points[0].y} L ${width - paddingX} ${points[0].y}`
      : points.reduce(
          (acc, p, i) =>
            i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
          ""
        );

  const areaString =
    points.length > 1
      ? `${pathString} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : "";

  const bestAttempt = [...displayAttempts].sort((a, b) => b.totalScore - a.totalScore)[0];
  const latestAttempt = displayAttempts[displayAttempts.length - 1];
  const firstAttempt = displayAttempts[0];
  const improvement = latestAttempt.totalScore - firstAttempt.totalScore;

  return (
    <div className="space-y-4">
      {/* Chart Metric Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Latest Score</div>
          <div className="text-xl font-black text-white mt-0.5">
            {latestAttempt.totalScore} <span className="text-xs font-normal text-slate-400">/ {latestAttempt.maxScore}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Personal Best</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            {bestAttempt.totalScore} <span className="text-xs font-normal text-slate-400">/ {bestAttempt.maxScore}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Average Score</div>
          <div className="text-xl font-black text-indigo-300 mt-0.5">
            {Math.round(displayAttempts.reduce((sum, a) => sum + a.totalScore, 0) / displayAttempts.length)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Improvement</div>
          <div className={`text-xl font-black mt-0.5 ${improvement >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {improvement >= 0 ? `+${improvement}` : improvement} pts
          </div>
        </div>
      </div>

      {/* Interactive SVG Graph */}
      <div className="relative rounded-2xl bg-slate-950/80 border border-slate-800/90 p-4 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="scoreLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[100, 140, 180, 200].map((val) => {
            if (val > effectiveMax) return null;
            const yPos =
              height -
              paddingY -
              ((val - minScore) / (effectiveMax - minScore)) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={yPos}
                  x2={width - paddingX}
                  y2={yPos}
                  stroke="#1E293B"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={yPos + 4}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaString && <path d={areaString} fill="url(#scoreAreaGrad)" />}

          {/* Score Path */}
          <path
            d={pathString}
            fill="none"
            stroke="url(#scoreLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i;
            const isBest = p.attempt.totalScore === bestAttempt.totalScore;
            return (
              <g
                key={p.attempt.id || i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Hit target */}
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                {/* Outer Glow */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 8 : 6}
                  fill={isBest ? "#10B981" : "#6366F1"}
                  className="transition-all duration-200"
                />
                <circle cx={p.x} cy={p.y} r={isHovered ? 4 : 3} fill="#FFFFFF" />

                {/* X-axis labels */}
                <text
                  x={p.x}
                  y={height - 10}
                  fill="#94A3B8"
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {p.attempt.examNumber}th
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute top-4 right-4 bg-slate-900 border border-indigo-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1 z-20 pointer-events-none animate-fade-in"
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>📝 {points[hoveredIdx].attempt.resourceTitle || `${points[hoveredIdx].attempt.examNumber}th TOPIK`}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300 font-mono">
              <span className="font-bold text-white text-sm">
                Score: {points[hoveredIdx].attempt.totalScore} / {points[hoveredIdx].attempt.maxScore}
              </span>
              <span>•</span>
              <span>L: {points[hoveredIdx].attempt.listeningScore}</span>
              <span>R: {points[hoveredIdx].attempt.readingScore}</span>
              {points[hoveredIdx].attempt.writingScore !== undefined && (
                <span>W: {points[hoveredIdx].attempt.writingScore}</span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {points[hoveredIdx].attempt.attemptDate}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
