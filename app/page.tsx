import LeagueTableInitial from "./components/league-table-initial";
import LeagueTable from "./components/league-table";
import Link from "next/link";
export default function Page() {
  return (
    <main className="w-full grid grid-cols-1 gap-20">
      {/* First attempt */}
      <section>
        <p className="mb-4 subheading">First Design</p>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <LeagueTableInitial />
          <div className="">
            <h2>First Design Notes</h2>
            <div className="space-y-4 pt-2">
              <p>
                The brief stated{" "}
                <span className="bg-yellow-200 px-1">
                  <span className="highlight italic">
                    use this table as a wireframe
                  </span>
                </span>
                , so the focus was on building a fast, practical solution.
              </p>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Built using <strong>React (Next.js) with TypeScript</strong>{" "}
                  for scalability and structure.
                </li>
                <li>
                  Used a native <strong>HTML table</strong> to closely match the
                  wireframe layout.
                </li>
                <li>
                  Added <strong>Tailwind CSS</strong> for quick styling and
                  reduced need for custom CSS files.
                </li>
                <li>
                  Implemented sticky header/column using{" "}
                  <span className="bg-yellow-200 px-1">
                    <code>sticky</code>
                  </span>
                  ,{" "}
                  <span className="bg-yellow-200 px-1">
                    <code>top-0</code>
                  </span>
                  ,{" "}
                  <span className="bg-yellow-200 px-1">
                    <code>left-0</code>
                  </span>
                  .
                </li>
                <li>
                  Inline utility classes sped up development and made iteration
                  easier.
                </li>
              </ul>

              <p>
                This approach balanced <strong>speed</strong>,{" "}
                <strong>maintainability</strong>, and{" "}
                <strong>accuracy to the design</strong>.
              </p>
            </div>
          </div>
        </section>
      </section>
      <hr></hr>
      {/* Second attempt */}
      <section className="place-self-center grid grid-cols-1 gap-5">
        <p className="subheading">Second Design</p>
        <div className="rounded-md border border-gray-300 shadow-lg h-[570px] w-full max-w-lg">
          <LeagueTable />
        </div>
        <Link
          href={"/design"}
          className="underline text-blue-500 hover:text-blue-600 underline-offset-4 w-max text-xs font-semibold uppercase"
        >
          Go to own page
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* second attempt - text */}
        <section className="space-y-4 border border-gray-200 rounded-md p-4">
          <h2>Second Design notes</h2>
          <p>
            For the second approach, I focused on{" "}
            <span className="bg-yellow-200 px-1">
              <span className="highlight">user interaction</span>.
            </span>
          </p>
          <h3>Notes from the first approach</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              The first design closely resembled a desktop table. The brief
              indicated this is for an{" "}
              <span className="bg-yellow-200 px-1">
                <span className="highlight italic">app</span>
              </span>
              , so the experience needed to feel natural on mobile rather than
              like <span className="italic">“I wish I was on a laptop.”</span>
            </li>
          </ul>
          <h3>Design decisions for the second approach</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Avoided a <span className="italic">squished </span>
              feeling by making one column the focal point, giving users a clear
              center of attention without overloading them with information.
            </li>
            <li>
              Added scroll effects to create the perception that the content
              moves independently, rather than the whole page scrolling.
            </li>
          </ul>
        </section>

        {/* component structure */}
        <section className="space-y-4 border border-gray-200 rounded-md p-4">
          <h2>Component Structure</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="bg-yellow-200 px-1">
                <code>layout.js</code>
              </span>{" "}
            </li>
            <li>
              <span className="bg-yellow-200 px-1">
                <code>page.js</code>
              </span>{" "}
            </li>
            <li>
              <span className="bg-yellow-200 px-1">
                <code>league-table.js</code>
              </span>{" "}
              – all table functionality
            </li>
            <li>
              <span className="bg-yellow-200 px-1">
                <code>badges.js</code>
              </span>{" "}
              – reusable component
            </li>
          </ul>

          <h2>Data Handling</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Ran an{" "}
              <span className="bg-yellow-200 px-1">
                <code>xlsx</code>
              </span>{" "}
              conversion script to convert{" "}
              <span className="bg-yellow-200 px-1">
                <code>data.xlsx</code>
              </span>{" "}
              to{" "}
              <span className="bg-yellow-200 px-1">
                <code>data.json</code>
              </span>
              .
            </li>
            <li>
              Imported the JSON into the{" "}
              <span className="bg-yellow-200 px-1">
                <code>league-table</code>
              </span>{" "}
              component.
            </li>
            <li>
              Ideally, this would be replaced with an API request to fetch live
              data, allowing caching, revalidation, and streaming into the app.
            </li>
          </ul>
        </section>
      </section>
      <hr></hr>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Potential Pitfalls / Edge Cases / if i had more time
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Endless looping or scroll-around behavior wasn’t implemented; this
            could improve the user experience.
          </li>
          <li>
            Need to test on multiple devices, as combining horizontal and
            vertical scrolling can cause layout or usability issues.
          </li>
          <li>
            Device rotation (portrait vs. landscape) needs consideration, since
            the table may behave differently when the orientation changes.
          </li>
          <li>
            If the table data comes from an API, care must be taken to prevent
            the table from “jumping” or losing position when the data refreshes.
          </li>
          <li>
            Would add "left" and "right" chevron buttons so people could access across the table via clicking. Also is a good visual indication
            of scroll effect.
          </li>
        </ul>
      </section>
    </main>
  );
}
