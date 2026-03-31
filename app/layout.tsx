// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Football App",
//   description: "Created by Emily Clarkson",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">{children}</body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Link from "next/link";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beyond Sports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${barlowCondensed.variable}`}>
        <section className="px-4 min-h-[500px] text-center items-center flex flex-col justify-center bg-black text-white gap-4">
          <h1 className="">Tournament Table</h1>
          <p className="max-w-2xl">
            For this exercise, I focused on
            <span className="bg-orange-400 px-1 mx-1 italic">
              <span className="bg-orange-300 px-1 text-black">
                recreating a football competition results table,
              </span>
            </span>
            using the provided spreadsheet as a functional wireframe. The goal
            was to replicate the scrolling behaviour and sticky header/column
            requirements, while building a responsive, mobile-friendly UI. My
            approach emphasizes clarity, maintainability, and usability, using
            static data to demonstrate a proof-of-concept implementation.
          </p>

          <p className="font-light italic">Emily Clarkson</p>
        </section>
        <div className="px-4 py-20 max-w-[1400px] mx-auto">{children}</div>
        <footer className="bg-black text-white py-12">
          <div className="max-w-[1400px] mx-auto px-4 flex flex-col items-center gap-4">
            <h2 className="font-semibold text-lg tracking-wide">
              Emily Clarkson
            </h2>

            <a
              href="mailto:erc.clarkson@btinternet.com"
              className="hover:text-white transition-colors duration-200"
            >
              erc.clarkson@btinternet.com
            </a>
            <div className="flex gap-6 mt-2">
              <Link
                target="_blank"
                href="https://github.com/erc-clarkson"
                className="text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                GitHub
                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link
                target="_blank"
                href="https://www.linkedin.com/in/erc-clarkson/"
                className="text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                LinkedIn
                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
