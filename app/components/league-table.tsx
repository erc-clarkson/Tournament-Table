"use client";
import { useRef, useState, useCallback } from "react";
import data from "../data/data.json";
import Badges from "./badges";

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
  { key: "Matches played", label: "Played" },
  { key: "Goals scored", label: "GF" },
  { key: "Goals against", label: "GA" },
  { key: "Goal difference", label: "GD" },
  { key: "Last 5", label: "Last 5" },
];

const COL_WIDTH = 120;

function formatVal(
  key: keyof Omit<Team, "Position" | "Club">,
  val: number | string
): string {
  if (key === "Goal difference" && typeof val === "number") {
    return val > 0 ? `+${val}` : `${val}`;
  }
  return `${val}`;
}

export default function LeagueTable() {
  const [activeCol, setActiveCol] = useState(0); //which column has the black banner
  const scrollRef = useRef<HTMLDivElement>(null); //scroll ref for div
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); //holds id of setTimeout timer

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Derive which column is closest to the current scroll position
    // and clamp it so it never exceeds the last column index
    const idx = Math.min(
      Math.round(el.scrollLeft / COL_WIDTH),
      COLS.length - 1
    );
    setActiveCol(idx);

    // Clear any previous snap timer so we only snap once the user - has stopped scrolling (debounced by 80ms)
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      // Re-calculate after the user stops — scrollLeft may have drifted
      const snapped = Math.min(
        Math.round(el.scrollLeft / COL_WIDTH),
        COLS.length - 1
      );
      // Smoothly snap the scroll position to the nearest column boundary
      el.scrollTo({ left: snapped * COL_WIDTH, behavior: "smooth" });
      setActiveCol(snapped);
    }, 80);
  }, []);

  // Programmatically jump to a column — used by header clicks and nav dots
  const scrollToCol = useCallback((idx: number) => {
    scrollRef.current?.scrollTo({ left: idx * COL_WIDTH, behavior: "smooth" });
    setActiveCol(idx);
  }, []);

  return (
    <>
      <style>{`
        .lt-scroll { overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .lt-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="bg-white h-full font-sans select-none rounded-md flex flex-col">
        {/* Scrollable table */}
        <div
          ref={scrollRef}
          className="lt-scroll flex-1 overflow-y-auto"
          onScroll={onScroll}
        >
          <table
            className="border-collapse"
            style={{
              tableLayout: "fixed",
              minWidth: `${140 + COLS.length * COL_WIDTH}px`,
            }}
          >
            {/* Col widths */}
            <colgroup>
              <col style={{ width: 140, minWidth: 140 }} />
              {COLS.map((_, i) => (
                <col
                  key={i}
                  style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                />
              ))}
            </colgroup>

            {/* Header */}
            <thead>
              <tr className="border-b border-gray-200">
                {/* Sticky club column header */}
                <th
                  className="sticky left-0 top-0 z-30 bg-white border-r border-gray-200 text-left px-4 py-4 text-sm font-normal text-gray-900"
                  style={{ width: 140 }}
                >
                  Club
                </th>

                {/* Data column headers */}
                {COLS.map((col, i) => (
                  <th
                    key={i}
                    onClick={() => scrollToCol(i)}
                    className={`sticky top-0 z-10 py-4 text-sm font-bold whitespace-nowrap text-center cursor-pointer transition-colors duration-200 ${
                      activeCol === i
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-400"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {TEAMS.map((team) => (
                <tr key={team.Position} className="border-b border-gray-100">
                  {/* Sticky club cell */}
                  <td
                    className="sticky left-0 z-10 bg-white border-r border-gray-200 px-4 py-4"
                    style={{ width: 140 }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-xs">
                        {team.Position}.
                      </span>
                      <span className="text-sm text-gray-900">{team.Club}</span>
                    </div>
                  </td>

                  {/* Data cells */}
                  {COLS.map((col, i) => {
                    const raw = team[col.key];
                    return (
                      <td
                        key={i}
                        className={`py-4 text-sm font-bold text-center transition-colors duration-200 ${
                          activeCol === i ? "text-gray-900" : "text-gray-300"
                        }`}
                      >
                        {col.key === "Last 5" ? (
                          <Badges value={raw as string} />
                        ) : (
                          formatVal(col.key, raw as number | string)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Column nav dots */}
        <div className="flex justify-center gap-1.5 py-2.5 border-t border-gray-100 shrink-0">
          {COLS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCol(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                activeCol === i ? "bg-gray-900 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
