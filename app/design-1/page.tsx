"use client";
import { useRef, useState, useCallback } from "react";
import data from "../data/data.json";

type Team = {
  Position: number;
  Club: string;
  "Matches played": number;
  Wins: number;
  Draws: number;
  Losses: number;
  "Goals scored": number;
  "Goals against": number;
  "Goal difference": number;
  Points: number;
  "Last 5": string;
};

const TEAMS = data as Team[];

const COLS: { key: keyof Omit<Team, "Position" | "Club">; label: string }[] = [
  { key: "Points", label: "Points" },
  { key: "Wins", label: "Wins" },
  { key: "Draws", label: "Draws" },
  { key: "Losses", label: "Losses" },
  { key: "Matches played", label: "Matches played" },
  { key: "Goals scored", label: "Goals scored" },
  { key: "Goals against", label: "Goals against" },
  { key: "Goal difference", label: "Goal difference" },
  { key: "Last 5", label: "Last 5" },
];

// Wrap index to loop infinitely
function wrap(idx: number) {
  return ((idx % COLS.length) + COLS.length) % COLS.length;
}

function formatVal(
  key: keyof Omit<Team, "Position" | "Club">,
  val: number | string
): string {
  if (key === "Goal difference" && typeof val === "number") {
    return val > 0 ? `+${val}` : `${val}`;
  }
  return `${val}`;
}

function Last5Badge({ value, peek }: { value: string; peek?: boolean }) {
  const results = value.split("\n");
  return (
    <div className={`flex gap-0.5 justify-center ${peek ? "opacity-30" : ""}`}>
      {results.map((r, i) => (
        <span
          key={i}
          className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white ${
            r === "Win"
              ? "bg-green-500"
              : r === "Draw"
              ? "bg-gray-400"
              : "bg-red-400"
          }`}
        >
          {r[0]}
        </span>
      ))}
    </div>
  );
}

export default function StickyTable() {
  const [activeCol, setActiveCol] = useState(0);
  const [fadingCol, setFadingCol] = useState<number | null>(null);
  const animatingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Always show peek — wraps around
  const peekColIdx = wrap(activeCol + 1);

  const changeCol = useCallback(
    (next: number) => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      const wrapped = wrap(next);
      setFadingCol(activeCol);
      setActiveCol(wrapped);
      setTimeout(() => {
        setFadingCol(null);
        animatingRef.current = false;
      }, 200);
    },
    [activeCol]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      changeCol(dx < 0 ? activeCol + 1 : activeCol - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const renderValue = (colIdx: number, team: Team, peek: boolean) => {
    const col = COLS[colIdx];
    const raw = team[col.key];
    if (col.key === "Last 5") {
      return <Last5Badge value={raw as string} peek={peek} />;
    }
    return (
      <span
        className={`text-sm font-bold ${
          peek ? "text-gray-400" : "text-gray-900"
        }`}
      >
        {formatVal(col.key, raw)}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        .fade-in  { animation: fadeIn  200ms ease forwards; }
        .fade-out {
          animation: fadeOut 200ms ease forwards;
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
      `}</style>

      <div
        className="bg-white min-h-screen font-sans select-none relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-40 flex border-b border-gray-200 bg-white">
          {/* Club header */}
          <div className="w-36 shrink-0 px-4 py-4 text-sm font-normal text-gray-900 border-r border-gray-200">
            Club
          </div>

          {/* Active col header */}
          <div
            className="flex-1 flex items-center justify-center py-4 bg-gray-900 relative overflow-hidden"
            style={{ boxShadow: "4px 0 12px rgba(0,0,0,0.18)" }}
          >
            {fadingCol !== null && (
              <span className="fade-out text-sm font-bold text-white whitespace-nowrap">
                {COLS[fadingCol].label}
              </span>
            )}
            <span
              key={activeCol}
              className="fade-in text-sm font-bold text-white whitespace-nowrap"
            >
              {COLS[activeCol].label}
            </span>
          </div>

          {/* Peek col header — text starts from left edge, overflows naturally, clipped */}
          <div className="w-20 shrink-0 flex items-center py-4 pl-3 border-l border-gray-100 overflow-hidden">
            {fadingCol !== null && (
              <span className="fade-out !justify-start !inset-auto relative text-xs font-normal text-gray-400 whitespace-nowrap">
                {COLS[peekColIdx].label}
              </span>
            )}
            <span
              key={`peek-${activeCol}`}
              className="fade-in text-xs font-normal text-gray-400 whitespace-nowrap"
            >
              {COLS[peekColIdx].label}
            </span>
          </div>
        </div>

        {/* ── Rows ── */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 53px)" }}
        >
          {TEAMS.map((team) => (
            <div key={team.Position} className="flex border-b border-gray-100">
              {/* Club cell */}
              <div className="w-36 shrink-0 px-4 py-4 text-sm border-r border-gray-200 flex items-center gap-2">
                <span className="font-normal text-gray-900">{team.Club}</span>
              </div>
              {/* Active data cell */}
              <div
                className="flex-1 flex items-center justify-center py-4 relative overflow-hidden"
                style={{ boxShadow: "4px 0 12px rgba(0,0,0,0.10)" }}
              >
                {fadingCol !== null && (
                  <div className="fade-out">
                    {renderValue(fadingCol, team, false)}
                  </div>
                )}
                <div
                  key={activeCol}
                  className="fade-in flex items-center justify-center"
                >
                  {renderValue(activeCol, team, false)}
                </div>
              </div>

              {/* Peek col */}
              <div className="w-20 shrink-0 flex items-center justify-center py-4 border-l border-gray-100 overflow-hidden ">
                {fadingCol !== null && (
                  <div className="fade-out">
                    {renderValue(peekColIdx, team, true)}
                  </div>
                )}
                <div
                  key={`peek-${activeCol}`}
                  className="fade-in flex items-center justify-center"
                >
                  {renderValue(peekColIdx, team, true)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Floating chevrons ── */}
        <div className="fixed bottom-8 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => changeCol(activeCol - 1)}
            className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform border-none cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => changeCol(activeCol + 1)}
            className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform border-none cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
