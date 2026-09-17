const djs = [
  {
    id: 1,
    name: "DJ Loonyo",
    image: "/djs/loonyo.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    name: "DJ Amari",
    image: "/djs/amari.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    name: "DJ Kliff",
    image: "/djs/kliff.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 4,
    name: "DJ Mannex",
    image: "/djs/mannex.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 5,
    name: "DJ Aya",
    image: "/djs/aya.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 6,
    name: "DJ M3",
    image: "/djs/m3.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 7,
    name: "DJ MRL",
    image: "/djs/mrl.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 8,
    name: "DJ Wana",
    image: "/djs/wana.webp",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

function DJCard({ dj }) {
  const number = String(dj.id).padStart(2, "0");

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        border
        border-white/10
        bg-white/[0.02]
        transition
        duration-300
        hover:border-ps-red
        hover:bg-ps-red-soft
      "
    >

      {/* IMAGE */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-neutral-900">

        <img
          src={dj.image}
          alt={dj.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-[1.02]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/40
            via-transparent
            to-transparent
          "
        />

        <span className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.25em] text-white/60">
          {number}
        </span>

      </div>


      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-6">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
              {dj.name}
            </h2>
          </div>

          <span className="text-xs text-white/20">
            0{number}
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
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {djs.map((dj) => (
              <DJCard key={dj.id} dj={dj} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}