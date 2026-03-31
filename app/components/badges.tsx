type Last5BadgeProps = {
  /** A string of results separated by newlines, e.g. "Win\nDraw\nLoss" */
  value: string;
};

const resultColors: Record<string, string> = {
  Win: "bg-green-500",
  Draw: "bg-gray-400",
  Loss: "bg-red-400",
};

export default function Badges({ value }: Last5BadgeProps) {
  const results = value.split("\n");

  return (
    <div className="flex gap-0.5 justify-center">
      {results.map((r, i) => {
        const color = resultColors[r] || "bg-gray-300"; // fallback color
        return (
          <span
            key={i}
            className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white ${color}`}
            title={r} // optional: hover shows full word
          >
            {r[0]}
          </span>
        );
      })}
    </div>
  );
}
