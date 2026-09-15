import { Link } from "react-router-dom";

const communityPerformances = [
  {
    name: "ExtraRDnary",
    coach: "RD Pagsanghan"
  },
  {
    name: "Barrio Swagg",
    coach: "Kliff Acosta"
  },
  {
    name: "The Femme Series",
    coach: "Richard Navarro"
  },
  {
    name: "Reality",
    coach: "Jade Pangilinan"
  },
  {
    name: "Rad*Lab",
    coach: "Melchor Bureros III"
  },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#050505]">

        {/* BACKGROUND IMAGE PLACEHOLDER */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-neutral-900">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <span className="block text-[10rem] font-black tracking-[-0.08em] text-white/[0.03] md:text-[18rem]">
                  001
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
                  Hero Image Placeholder
                </span>
              </div>
            </div>
          </div>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/70" />

          {/* ORANGE AMBIENT GLOW */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(194,65,12,0.16),transparent_45%)]" />

          {/* BOTTOM GRADIENT */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20">

          <div className="max-w-5xl">

            <p className="mb-6 text-xs font-bold uppercase tracking-[0.35em] text-orange-600">
              Rock*Well PH Presents:
            </p>

            <h1 className="text-7xl font-black uppercase leading-[0.8] tracking-[-0.06em] sm:text-8xl md:text-[10rem]">
              Public
              <br />
              Secret
            </h1>

            <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
                  001
                </p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
                  Hydro Superclub
                </p>

                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/40">
                  October 15, 2026
                </p>
              </div>

              <Link
                to="/tickets"
                className="btn h-14 rounded-none border-0 bg-orange-700 px-8 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-600"
              >
                Buy Tickets ↗
              </Link>

            </div>
          </div>
        </div>

      </section>

      {/* EVENT INTRO */}
      <section className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:px-10 md:py-32">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
              The Event
            </p>

            <h2 className="mt-6 text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
              One night.
              <br />
              No rules.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-xl text-lg leading-relaxed text-white/60 md:text-xl">
              Public Secret 001 brings together music, dance, performances,
              and people in one unforgettable night at Hydro Superclub.
            </p>
          </div>
        </div>
      </section>

      {/* EVENT DETAILS */}
      <section className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Date
            </p>

            <p className="mt-5 text-2xl font-bold">
              October 15, 2026
            </p>
          </div>

          <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Venue
            </p>

            <p className="mt-5 text-2xl font-bold">
              Hydro Superclub
            </p>
          </div>

          <div className="p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Tickets (Inclusive of 1 cocktail drink)
            </p>

            <p className="mt-5 text-2xl font-bold">
              ₱555
            </p>
          </div>
        </div>
      </section>


        {/* LINEUP PREVIEW */}
        <section className="border-y border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">

            {/* SECTION HEADER */}
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600">
                Public Secret 001
                </p>

                <h2 className="mt-5 text-6xl font-black uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl">
                The
                <br />
                Lineup
                </h2>
            </div>

            </div>

            {/* DJ PLACEHOLDERS */}
            <div className="mt-16 flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0">

            {Array.from({ length: 7 }).map((_, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                <div
                    key={index}
                    className={`group relative min-w-[78vw] snap-start overflow-hidden border border-white/10 bg-white/[0.02] transition duration-300 hover:border-orange-700/60 hover:bg-orange-950/10 sm:min-w-[45vw] md:min-w-0 ${
                    index === 0
                        ? "md:col-span-2 md:row-span-2"
                        : ""
                    }`}
                >

                    {/* IMAGE PLACEHOLDER */}
                    <div
                    className={`relative flex items-center justify-center bg-neutral-900 ${
                        index === 0
                        ? "aspect-square"
                        : "aspect-[4/5]"
                    }`}
                    >

                    {/* Orange glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,65,12,0.12),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                    <div className="relative text-center">
                        <span className="block text-5xl font-black text-white/[0.05] md:text-7xl">
                        {number}
                        </span>

                        <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                        Artist
                        </span>
                    </div>

                    {/* Number */}
                    <span className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.25em] text-orange-700">
                        {number}
                    </span>
                    </div>

                    {/* NAME */}
                    <div className="flex items-center justify-between p-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                        Artist
                        </p>

                        <h3 className="mt-1 text-xl font-black uppercase">
                        DJ {index + 1}
                        </h3>
                    </div>

                    <span className="text-lg text-white/20 transition group-hover:text-orange-600">
                        ↗
                    </span>
                    </div>

                </div>
                );
            })}
            </div>

            {/* VIEW ALL */}
            <div className="mt-10 flex justify-end">
            <Link
                to="/djs"
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition hover:text-orange-500"
            >
                View All DJs

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
                </span>
            </Link>
            </div>

        </div>
        </section>

        {/* DANCE PERFORMANCES */}
<section className="border-b border-white/10 bg-[#050505]">
  <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">

    {/* SECTION HEADER */}
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600">
          Rock*Well PH
        </p>

        <h2 className="mt-5 text-6xl font-black uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl">
          Dance
          <br />
          Performances
        </h2>
      </div>

      {/* <p className="max-w-sm text-sm leading-relaxed text-white/40 md:text-base">
        One featured performance.
        <br />
        Five community groups.
        <br />
        One stage.
      </p> */}
    </div>

    {/* FEATURED ROCK*WELL PERFORMANCE */}
    <div className="mt-16 overflow-x-auto pb-4 md:overflow-visible md:pb-0">
      <div className="group relative min-w-[88vw] overflow-hidden border border-orange-700/40 bg-white/[0.02] transition duration-500 hover:border-orange-500 md:min-w-0">

        {/* IMAGE PLACEHOLDER */}
        <div className="relative flex aspect-[16/8] items-center justify-center bg-neutral-900">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,65,12,0.18),transparent_60%)]" />

          <div className="relative text-center">
            <span className="block text-7xl font-black text-white/[0.06] md:text-[10rem]">
              01
            </span>

            <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-orange-600">
              Featured Performance
            </span>
          </div>

          <span className="absolute left-5 top-5 text-[10px] font-bold tracking-[0.3em] text-orange-600">
            01
          </span>

          <span className="absolute right-5 top-5 border border-orange-600/30 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-orange-500">
            Featured
          </span>
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-end md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-orange-600">
              Main Performance
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-5xl">
              Rock*Well PH
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/40">
              Performances from Rock*Well PH.
            </p>
          </div>

          <span className="text-2xl text-orange-600 transition-transform duration-300 group-hover:translate-x-2">
            ↗
          </span>
        </div>
      </div>
    </div>

    

    {/* COMMUNITY PERFORMANCES */}
<div className="mt-20">

  <div className="mb-8 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
        Rock*Well PH Community
      </p>

      <h3 className="mt-2 text-2xl font-black uppercase md:text-3xl">
        Community Performances
      </h3>
    </div>
  </div>

  {/* GROUP PLACEHOLDERS */}
  <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
    {communityPerformances.map((group, index) => {
      const number = String(index + 2).padStart(2, "0");

      return (
        <div
            key={group.name}
            className="group relative min-w-[78vw] snap-start overflow-hidden border border-white/10 bg-white/[0.02] transition duration-300 hover:border-orange-700/60 hover:bg-orange-950/10 sm:min-w-[45vw] lg:min-w-0"
        >
          {/* IMAGE PLACEHOLDER */}
          <div className="relative flex aspect-[4/5] items-center justify-center bg-neutral-900">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,65,12,0.10),transparent_60%)] opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="relative px-6 text-center">
              <span className="block text-6xl font-black text-white/[0.05] md:text-7xl">
                {number}
              </span>

              <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                Performance
              </span>
            </div>

            <span className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.25em] text-orange-700">
              {number}
            </span>
          </div>

          {/* GROUP INFO */}
          <div className="flex items-center justify-between p-5">
            <div>
    
              <h4 className="text-xl font-black uppercase">
                {group.name}
              </h4>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">
                by Coach {group.coach}
              </p>
            </div>

            <span className="text-lg text-white/20 transition group-hover:text-orange-600">
              ↗
            </span>
          </div>
        </div>
      );
    })}
  </div>
</div>

    {/* FOOTNOTE */}
    <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">
        Featuring Rock*Well PH &amp; Friends
      </p>
    </div>

  </div>
</section>


      {/* CTA */}
      <section className="bg-[#050505] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="border border-white/10 p-8 md:p-16">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
              Public Secret 001
            </p>

            <div className="mt-8 flex flex-col justify-between gap-10 md:flex-row md:items-end">
                <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-8xl">
                    Get your ticket.
                    <br />
                    Be there.
                </h2>

                <Link
                    to="/tickets"
                    className="btn btn-lg h-16 rounded-none border-0 bg-orange-700 px-10 text-white hover:bg-orange-600"
                >
                    BUY TICKETS
                    <span className="text-xl">↗</span>
                </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}