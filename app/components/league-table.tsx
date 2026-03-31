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
  { key: "Matches played", label: "Matches played" },
  { key: "Goals scored", label: "Goals scored" },
  { key: "Goals against", label: "Goals against" },
  { key: "Goal difference", label: "Goal difference" },
  { key: "Last 5", label: "Last 5" },
];

const COL_WIDTH = 130;
const CLUB_WIDTH = 140;

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
  const [activeCol, setActiveCol] = useState(0); //the active column
  const scrollEls = useRef<(HTMLDivElement | null)[]>([]); //holds a ref to every scrollable row div (header + each team row)
  const isSyncing = useRef(false); //A guard flag to prevent an infinite loop when scrolling between the rows
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((sourceIdx: number) => {
    // Prevent infinite loop when we programmatically set scrollLeft on other rows
    if (isSyncing.current) return;
    isSyncing.current = true;

    // Get the row that triggered the scroll
    const source = scrollEls.current[sourceIdx];
    if (!source) {
      isSyncing.current = false;
      return;
    }

    // Sync all other rows to the same scroll position
    const left = source.scrollLeft;
    scrollEls.current.forEach((el, i) => {
      if (i !== sourceIdx && el) el.scrollLeft = left;
    });

    // Update the active (highlighted) column based on current position
    setActiveCol(Math.round(left / COL_WIDTH));
    isSyncing.current = false;

    // Snap to the nearest column after the user stops scrolling
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      const snapped = Math.min(
        Math.round(source.scrollLeft / COL_WIDTH),
        COLS.length - 1
      );
      scrollEls.current.forEach((el) => {
        if (el) el.scrollTo({ left: snapped * COL_WIDTH, behavior: "smooth" });
      });
      setActiveCol(snapped);
    }, 80);
  }, []);

  // Store a ref to each scrollable row div by index
  const registerEl = (idx: number) => (el: HTMLDivElement | null) => {
    scrollEls.current[idx] = el;
  };

  return (
    <>
      <style>{`
        .scroll-x { overflow-x: scroll; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .scroll-x::-webkit-scrollbar { display: none; }
        .active-col-shadow { box-shadow: 4px 0 12px rgba(0,0,0,0.12); }
      `}</style>

      <div className="bg-white h-full font-sans select-none rounded-md">
        <div className="overflow-y-auto h-full flex flex-col rounded-md">
          {/* Sticky header */}
          <div className="sticky top-0 z-40 flex border-b border-gray-200 bg-white shrink-0">
            <div
              className="shrink-0 px-4 py-4 text-sm font-normal text-gray-900 border-r border-gray-200"
              style={{ width: CLUB_WIDTH }}
            >
              Club
            </div>
            <div
              ref={registerEl(0)}
              className="scroll-x flex"
              onScroll={() => onScroll(0)}
              style={{ flex: 1 }}
            >
              {COLS.map((col, i) => (
                <div
                  key={i}
                  className={`shrink-0 flex items-center justify-center py-4 text-sm font-bold whitespace-nowrap transition-colors duration-200 ${
                    activeCol === i
                      ? "bg-gray-900 text-white active-col-shadow"
                      : "bg-white text-gray-400"
                  }`}
                  style={{ width: COL_WIDTH }}
                >
                  {col.label}
                </div>
              ))}
            </div>
          </div>

          {/* Body rows */}
          <div className="flex-1">
            {TEAMS.map((team, rowIdx) => (
              <div
                key={team.Position}
                className="flex border-b border-gray-100"
              >
                <div
                  className="shrink-0 px-4 py-4 gap-1 text-sm border-r border-gray-200 flex items-center bg-white"
                  style={{ width: CLUB_WIDTH }}
                >
                  <p className="text-gray-400 text-xs">{team.Position}.</p>
                  <p className="font-normal text-gray-900">{team.Club}</p>
                </div>
                <div
                  ref={registerEl(rowIdx + 1)}
                  className="scroll-x flex"
                  onScroll={() => onScroll(rowIdx + 1)}
                  style={{ flex: 1 }}
                >
                  {COLS.map((col, i) => {
                    const raw = team[col.key];
                    return (
                      <div
                        key={i}
                        className={`shrink-0 flex items-center justify-center py-4 text-sm font-bold transition-colors duration-200 ${
                          activeCol === i
                            ? "text-gray-900 active-col-shadow"
                            : "text-gray-300"
                        }`}
                        style={{ width: COL_WIDTH }}
                      >
                        {col.key === "Last 5" ? (
                          <Badges value={raw as string} />
                        ) : (
                          formatVal(col.key, raw as number | string)
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
