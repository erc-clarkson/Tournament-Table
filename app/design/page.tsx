import Link from "next/link";
import LeagueTable from "../components/league-table";

export default function Page() {
  return (
    <main className="grid grid-cols-1 gap-8">
      <div className="shadow-md rounded-md border border-gray-200 h-screen overflow-hidden">
        <LeagueTable />
      </div>
      <Link
        href="/"
        className="underline text-blue-500 hover:text-blue-600 underline-offset-4 w-max text-xs font-semibold uppercase"
      >
        Home page
      </Link>
    </main>
  );
}
