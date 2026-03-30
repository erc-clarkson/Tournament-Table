import LeagueTable from "./league-table";

export default function Page() {
  return (
    <main className="lg:p-10">
      <div className="max-4-[600px] w-full shadow-md rounded-md border border-gray-200">
        <LeagueTable />
      </div>
    </main>
  );
}
