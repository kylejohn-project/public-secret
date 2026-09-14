const djs = [
  {
    id: 1,
    name: "DJ1",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    name: "DJ2",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 3,
    name: "DJ3",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  },
  {
    id: 4,
    name: "DJ4",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
  },
  {
    id: 5,
    name: "DJ5",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  },
  {
    id: 6,
    name: "DJ6",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum.",
  },
  {
    id: 7,
    name: "DJ7",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur.",
  },
];

function DJCard({ dj }) {
  return (
    <article className="group border border-white/10 bg-white/[0.02] transition duration-300 hover:border-orange-700/60 hover:bg-orange-950/10">

      {/* IMAGE */}
      <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
        <div className="flex h-full w-full items-center justify-center bg-neutral-800">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-xl font-black text-white/20">
              {dj.id}
            </div>

            <span className="text-xs uppercase tracking-[0.3em] text-white/20">
              DJ Image
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-700">
              DJ 0{dj.id}
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              {dj.name}
            </h2>
          </div>

          <span className="text-xs text-white/20">
            00{dj.id}
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-white/40">
          {dj.details}
        </p>
      </div>
    </article>
  );
}

export default function DJs() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 pb-24 pt-32 md:px-10 md:pt-40">

      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        <section className="mb-16 md:mb-24">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
            Public Secret 001
          </p>

          <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="text-7xl font-black uppercase leading-[0.8] tracking-[-0.06em] md:text-[9rem]">
              DJs
            </h1>

            <p className="max-w-md text-sm leading-relaxed text-white/40 md:text-base">
              Meet the artists bringing the sound of Public Secret 001
              to Hydro Superclub.
            </p>
          </div>
        </section>

        {/* DJ GRID */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {djs.map((dj) => (
              <DJCard key={dj.id} dj={dj} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}