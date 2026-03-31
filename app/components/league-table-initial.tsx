import data from "../data/data.json";

const resultStyle: Record<string, string> = {
  Win: "bg-green-100 text-green-800",
  Draw: "bg-gray-100 text-gray-600",
  Loss: "bg-red-100 text-red-800",
};

export default function LeagueTableInitial() {
  const columns = Object.keys(data?.[0])?.filter(
    (item) => item != "Position" && item != "Club"
  );

  return (
    <div className="bg-white overflow-auto max-h-[600px] border border-gray-200 rounded-xl shadow-lg">
      <table className="border-collapse text-sm whitespace-nowrap border-separate">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-30 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 min-w-40">
              Club
            </th>
            {columns.map((h) => (
              <th
                key={h}
                className="sticky top-0 z-20 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr
              key={row.Position}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium">
                {row.Club}
              </td>
              <td className="px-4 py-3">{row["Matches played"]}</td>
              <td className="px-4 py-3">{row.Wins}</td>
              <td className="px-4 py-3">{row.Draws}</td>
              <td className="px-4 py-3">{row.Losses}</td>
              <td className="px-4 py-3">{row["Goals scored"]}</td>
              <td className="px-4 py-3">{row["Goals against"]}</td>
              <td className="px-4 py-3">{row["Goal difference"]}</td>
              <td className="px-4 py-3 font-medium">{row.Points}</td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  {row["Last 5"].split("\n").map((r: string, i: number) => (
                    <span
                      key={i}
                      className={`w-5 h-5 rounded-full text-xs font-medium flex items-center justify-center ${
                        resultStyle[r] ?? ""
                      }`}
                    >
                      {r[0]}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
