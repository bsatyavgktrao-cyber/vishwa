/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BirthChartData, ZODIAC_SIGNS } from "../utils/astrology";

interface KundliChartProps {
  data: BirthChartData;
  lang: string;
}

export default function KundliChart({ data, lang }: KundliChartProps) {
  const [style, setStyle] = useState<"north" | "south">("north");

  // Map planets into house brackets
  const housePlanets: { [key: number]: string[] } = {};
  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
  }
  data.planets.forEach((p) => {
    let dispName = p.name === "Sun" ? "Su" :
                   p.name === "Moon" ? "Mo" :
                   p.name === "Mars" ? "Ma" :
                   p.name === "Mercury" ? "Me" :
                   p.name === "Jupiter" ? "Ju" :
                   p.name === "Venus" ? "Ve" :
                   p.name === "Saturn" ? "Sa" :
                   p.name === "Rahu" ? "Ra" : "Ke";
    if (p.retrograde) dispName += "R";
    housePlanets[p.house].push(dispName);
  });

  // South Indian Rashi positions: Aries (0) starts at top-row second box, proceeding clockwise
  // Box indices 0 to 11 map to standard 12 zodiac rashis in order
  // Aries=0 (row 0, col 1), Taurus=1 (row 0, col 2), Gemini=2 (row 0, col 3), Cancer=3 (row 1, col 3)
  // Leo=4 (row 2, col 3), Virgo=5 (row 3, col 3), Libra=6 (row 3, col 2), Scorpio=7 (row 3, col 1), 
  // Sagittarius=8 (row 3, col 0), Capricorn=9 (row 2, col 0), Aquarius=10 (row 1, col 0), Pisces=11 (row 0, col 0)
  const southBoxMapping = [
    { name: "Aries", x: 100, y: 0, rashiIdx: 0 },
    { name: "Taurus", x: 200, y: 0, rashiIdx: 1 },
    { name: "Gemini", x: 300, y: 0, rashiIdx: 2 },
    { name: "Cancer", x: 300, y: 100, rashiIdx: 3 },
    { name: "Leo", x: 300, y: 200, rashiIdx: 4 },
    { name: "Virgo", x: 300, y: 300, rashiIdx: 5 },
    { name: "Libra", x: 200, y: 300, rashiIdx: 6 },
    { name: "Scorpio", x: 100, y: 300, rashiIdx: 7 },
    { name: "Sagittarius", x: 0, y: 300, rashiIdx: 8 },
    { name: "Capricorn", x: 0, y: 200, rashiIdx: 9 },
    { name: "Aquarius", x: 0, y: 100, rashiIdx: 10 },
    { name: "Pisces", x: 0, y: 0, rashiIdx: 11 },
  ];

  // Helper to find rashi index of Ascendant
  const ascRashiName = data.ascendant.rashi;
  const ascRashiIdx = ZODIAC_SIGNS.findIndex((z) => z.name === ascRashiName);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100 max-w-2xl mx-auto">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans text-xl font-bold tracking-tight text-amber-400">Vedic Birth Chart (Kundli)</h3>
          <p className="font-mono text-xs text-slate-400">Dynamic high-fidelity celestial coordinate model</p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="style-north-btn"
            onClick={() => setStyle("north")}
            className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-all duration-300 ${style === "north" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-100"}`}
          >
            North Indian Style
          </button>
          <button
            id="style-south-btn"
            onClick={() => setStyle("south")}
            className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-all duration-300 ${style === "south" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-100"}`}
          >
            South Indian Style
          </button>
        </div>
      </div>

      <div className="flex justify-center p-4">
        {style === "north" ? (
          /* NORTH INDIAN CHART */
          <svg viewBox="0 0 400 400" className="w-full max-w-[360px] aspect-square transition-all duration-500">
            {/* outer rectangle */}
            <rect x="5" y="5" width="390" height="390" fill="transparent" stroke="#f59e0b" strokeWidth="2.5" />
            
            {/* diagonals */}
            <line x1="5" y1="5" x2="395" y2="395" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="395" y1="5" x2="5" y2="395" stroke="#f59e0b" strokeWidth="1.5" />
            
            {/* inner diamond */}
            <polygon points="200,5 395,200 200,395 5,200" fill="transparent" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Custom houses annotation with Sign names & planets */}
            {/* 1st House (Lagna) - central top diamond */}
            <text x="200" y="80" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-base">
              {/* Sign Number */}
              {((ascRashiIdx) % 12) + 1}
            </text>
            <text x="200" y="110" textAnchor="middle" fill="#f8fafc" className="font-sans text-xs font-semibold">
              {housePlanets[1].join(", ") || "I (ASC)"}
            </text>

            {/* 2nd House - top left triangle */}
            <text x="130" y="45" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 1) % 12) + 1}
            </text>
            <text x="110" y="75" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[2].join(", ")}
            </text>

            {/* 3rd House - far left top-part */}
            <text x="45" y="130" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 2) % 12) + 1}
            </text>
            <text x="75" y="110" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[3].join(", ")}
            </text>

            {/* 4th House - central left diamond */}
            <text x="110" y="200" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-base">
              {((ascRashiIdx + 3) % 12) + 1}
            </text>
            <text x="80" y="220" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-semibold">
              {housePlanets[4].join(", ") || "IV"}
            </text>

            {/* 5th House - far left bottom-part */}
            <text x="45" y="270" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 4) % 12) + 1}
            </text>
            <text x="75" y="290" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[5].join(", ")}
            </text>

            {/* 6th House - bottom left triangle */}
            <text x="130" y="355" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 5) % 12) + 1}
            </text>
            <text x="110" y="325" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[6].join(", ")}
            </text>

            {/* 7th House - central bottom diamond */}
            <text x="200" y="320" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-base">
              {((ascRashiIdx + 6) % 12) + 1}
            </text>
            <text x="200" y="290" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-semibold">
              {housePlanets[7].join(", ") || "VII"}
            </text>

            {/* 8th House - bottom right triangle */}
            <text x="270" y="355" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 7) % 12) + 1}
            </text>
            <text x="290" y="325" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[8].join(", ")}
            </text>

            {/* 9th House - far right bottom-part */}
            <text x="355" y="270" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 8) % 12) + 1}
            </text>
            <text x="325" y="290" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[9].join(", ")}
            </text>

            {/* 10th House - central right diamond */}
            <text x="290" y="200" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-base">
              {((ascRashiIdx + 9) % 12) + 1}
            </text>
            <text x="320" y="220" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-semibold">
              {housePlanets[10].join(", ") || "X"}
            </text>

            {/* 11th House - far right top-part */}
            <text x="355" y="130" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 10) % 12) + 1}
            </text>
            <text x="325" y="110" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[11].join(", ")}
            </text>

            {/* 12th House - top right triangle */}
            <text x="270" y="45" textAnchor="middle" fill="#d97706" className="font-mono font-bold text-xs">
              {((ascRashiIdx + 11) % 12) + 1}
            </text>
            <text x="290" y="75" textAnchor="middle" fill="#e2e8f0" className="font-sans text-xs font-medium">
              {housePlanets[12].join(", ")}
            </text>
          </svg>
        ) : (
          /* SOUTH INDIAN CHART */
          <svg viewBox="0 0 400 400" className="w-full max-w-[360px] aspect-square transition-all duration-500">
            {/* Outer grid */}
            <rect x="5" y="5" width="390" height="390" fill="transparent" stroke="#f59e0b" strokeWidth="2.5" />
            
            {/* Draw internal lines for 12 outer boxes */}
            <line x1="100" y1="5" x2="100" y2="395" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="200" y1="5" x2="200" y2="395" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="300" y1="5" x2="300" y2="395" stroke="#f59e0b" strokeWidth="1.5" />
            
            <line x1="5" y1="100" x2="395" y2="100" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="5" y1="200" x2="395" y2="200" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="5" y1="300" x2="395" y2="300" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Cover the inner center (row 1-2, col 1-2) with a solid block representing central information */}
            <rect x="101" y="101" width="198" height="198" fill="#0b1329" />
            <text x="200" y="180" textAnchor="middle" fill="#f59e0b" className="font-sans text-sm font-bold">
              SOUTH INDIAN STYLE
            </text>
            <text x="200" y="210" textAnchor="middle" fill="#94a3b8" className="font-mono text-[10px]">
              LAGNA: {ZODIAC_SIGNS[ascRashiIdx].sanskrit}
            </text>
            <text x="200" y="230" textAnchor="middle" fill="#64748b" className="font-sans text-[10px]">
              Read clockwise starting from Aries
            </text>

            {/* Place Rashi names & respective planets insideboxes */}
            {southBoxMapping.map((box, idx) => {
              // Sign's index represents which Rashi this box holds
              // Find planets that belong in this Rashi
              const planetsInThisRashi = data.planets.filter((p) => p.rashi === box.name);
              const isAscendantBox = box.rashiIdx === ascRashiIdx;

              // Display array: includes ASC or planet abbreviations
              const cellItems: string[] = [];
              if (isAscendantBox) cellItems.push("ASC");
              planetsInThisRashi.forEach((p) => {
                let disp = p.name === "Sun" ? "Su" :
                           p.name === "Moon" ? "Mo" :
                           p.name === "Mars" ? "Ma" :
                           p.name === "Mercury" ? "Me" :
                           p.name === "Jupiter" ? "Ju" :
                           p.name === "Venus" ? "Ve" :
                           p.name === "Saturn" ? "Sa" :
                           p.name === "Rahu" ? "Ra" : "Ke";
                if (p.retrograde) disp += "R";
                cellItems.push(disp);
              });

              return (
                <g key={idx}>
                  {/* Small Rashi Name header in cell */}
                  <text x={box.x + 10} y={box.y + 25} fill="#d97706" className="font-sans text-[10px] font-semibold opacity-80">
                    {ZODIAC_SIGNS[box.rashiIdx].sanskrit.slice(0, 5)}
                  </text>
                  
                  {/* Items list */}
                  <text x={box.x + 50} y={box.y + 55} textAnchor="middle" fill="#f8fafc" className="font-sans text-xs font-bold">
                    {cellItems.join(", ") || "—"}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-800 pt-4 mt-4 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Su: Sun</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Mo: Moon</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Ma: Mars</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Me: Mercury</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Ju: Jupiter</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Ve: Venus</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Sa: Saturn</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Ra: Rahu</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Ke: Ketu</span>
      </div>
    </div>
  );
}
