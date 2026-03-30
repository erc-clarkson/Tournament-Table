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

// Append the first col again at the end so the peek never shows blank
const DISPLAY_COLS = [...COLS];

const COL_WIDTH = 135;
const CLUB_WIDTH = 144;

function formatVal(
  key: keyof Omit<Team, "Position" | "Club">,
  val: number | string
): string {
  if (key === "Goal difference" && typeof val === "number") {
    return val > 0 ? `+${val}` : `${val}`;
  }
  return `${val}`;
}

function Last5Badge({ value }: { value: string }) {
  const results = value.split("\n");
  return (
    <div className="flex gap-0.5 justify-center">
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
  const scrollEls = useRef<(HTMLDivElement | null)[]>([]);
  const isSyncing = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback((sourceIdx: number) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    const source = scrollEls.current[sourceIdx];
    if (!source) {
      isSyncing.current = false;
      return;
    }

    const left = source.scrollLeft;

    scrollEls.current.forEach((el, i) => {
      if (i !== sourceIdx && el) el.scrollLeft = left;
    });

    // Active col — the duplicate at COLS.length maps back to 0
    const rawIdx = Math.round(left / COL_WIDTH);
    setActiveCol(rawIdx >= COLS.length ? 0 : rawIdx);

    isSyncing.current = false;

    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      const currentLeft = source.scrollLeft;
      // Allow scrolling to the duplicate col so the peek is always filled
      const rawSnapped = Math.round(currentLeft / COL_WIDTH);
      const clamped = Math.min(rawSnapped, COLS.length); // allow one past end
      const snapLeft = clamped * COL_WIDTH;
      scrollEls.current.forEach((el) => {
        if (el) el.scrollTo({ left: snapLeft, behavior: "smooth" });
      });
      setActiveCol(clamped >= COLS.length ? 0 : clamped);
    }, 80);
  }, []);

  const registerEl = (idx: number) => (el: HTMLDivElement | null) => {
    scrollEls.current[idx] = el;
  };

  return (
    <>
      <style>{`
        .scroll-x {
          overflow-x: scroll;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .scroll-x::-webkit-scrollbar { display: none; }
        .active-col-shadow { box-shadow: 4px 0 12px rgba(0,0,0,0.12); }
      `}</style>

      <div className="bg-white min-h-screen font-sans select-none">
        <div className="overflow-y-auto h-screen flex flex-col">
          {/* ── Sticky header ── */}
          <div className="sticky top-0 z-40 flex border-b border-gray-200 bg-white shrink-0">
            <div
              className="shrink-0 px-4 py-4 text-sm font-normal text-gray-900 border-r border-gray-200 bg-white"
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
              {DISPLAY_COLS.map((col, i) => (
                <div
                  key={i}
                  className={`shrink-0 flex items-center justify-center py-4 text-sm font-bold whitespace-nowrap transition-colors duration-200 ${
                    activeCol === i || (i === COLS.length && activeCol === 0)
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

          {/* ── Body rows ── */}
          <div className="flex-1">
            {TEAMS.map((team, rowIdx) => (
              <div
                key={team.Position}
                className="flex border-b border-gray-100"
              >
                <div
                  className="shrink-0 px-4 py-4 text-sm border-r border-gray-200 flex items-center gap-2 bg-white"
                  style={{ width: CLUB_WIDTH }}
                >
                  <span className="font-normal text-gray-900">{team.Club}</span>
                </div>

                <div
                  ref={registerEl(rowIdx + 1)}
                  className="scroll-x flex"
                  onScroll={() => onScroll(rowIdx + 1)}
                  style={{ flex: 1 }}
                >
                  {DISPLAY_COLS.map((col, i) => {
                    const raw = team[col.key];
                    const isActive = activeCol === i && i < COLS.length;
                    return (
                      <div
                        key={i}
                        className={`shrink-0 flex items-center justify-center py-4 text-sm font-bold transition-colors duration-200 ${
                          isActive
                            ? "text-gray-900 active-col-shadow"
                            : "text-gray-300"
                        }`}
                        style={{ width: COL_WIDTH }}
                      >
                        {col.key === "Last 5" ? (
                          <Last5Badge value={raw as string} />
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
