import { Link } from "react-router-dom";

const communityPerformances = [
  {
    name: "ExtraRDnary",
    coach: "RD Pagsanghan",
    image: "/communitylogo/extrardnary.webp",
  },
  {
    name: "Barrio Swagg",
    coach: "Kliff Acosta",
    image: "/communitylogo/barrioswagg.webp",
  },
  {
    name: "The Femme Series",
    coach: "Richard Navarro",
    image: "/communitylogo/tfs.webp",
  },
  {
    name: "Reality",
    coach: "Jade Pangilinan",
    image: "/communitylogo/reality.webp",
  },
  {
    name: "Rad*Lab",
    coach: "Melchor Bureros III",
    image: "/communitylogo/radlab.webp",
  }
];

const djs = [
  {
    name: "DJ Loonyo",
    image: "/djs/loonyo.webp",
  },
  {
    name: "DJ Amari",
    image: "/djs/amari.webp",
  },
  {
    name: "DJ Kliff",
    image: "/djs/kliff.webp",
  },
  {
    name: "DJ Mannex",
    image: "/djs/mannex.webp",
  },
  {
    name: "DJ Aya",
    image: "/djs/aya.webp",
  },
  {
    name: "DJ M3",
    image: "/djs/m3.webp",
  },
  {
    name: "DJ MRL",
    image: "/djs/mrl.webp",
  },
  {
    name: "DJ Wana",
    image: "/djs/wana.webp",
  },
];

export default function Home() {
  return (
    <main>

      {/* TICKET MARQUEE */}
      <Link
        to="/tickets"
        className="
          group
          relative
          z-20
          block
          w-full
          top-16
          overflow-hidden
          bg-[#050505]
          py-5
          md:py-3
        "
      >
        <div className="marquee-track flex w-max items-center whitespace-nowrap">

                  {/* FIRST SET */}
                  <div className="flex shrink-0 items-center">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`marquee-a-${index}`}
                        className="
                          flex
                          shrink-0
                          items-center
                          text-xs
                          font-black
                          uppercase
                          tracking-[-0.02em]
                          text-ps-red
                          md:text-md
                          lg:text-xl
                        "
                      >
                        <span>
                          ROCK*WELL PH × HYDRO SUPERCLUB
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          PUBLIC SECRET 001
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          TICKETS ₱555
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          WALK-IN ₱999
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          GET YOUR TICKETS NOW ↗
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>
                      </div>
                    ))}
                  </div>


                  {/* DUPLICATE FOR SEAMLESS LOOP */}
                  <div
                    className="flex shrink-0 items-center"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`marquee-b-${index}`}
                        className="
                          flex
                          shrink-0
                          items-center
                          text-xs
                          font-black
                          uppercase
                          tracking-[-0.02em]
                          text-ps-red
                          md:text-md
                          lg:text-xl
                        "
                      >
                        <span>
                          ROCK*WELL PH × HYDRO SUPERCLUB
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          PUBLIC SECRET 001
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          TICKETS ₱555
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          WALK-IN ₱999
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>

                        <span>
                          GET YOUR TICKETS NOW ↗
                        </span>

                        <span className="mx-7 md:mx-10">
                          ✦
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </Link>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#050505]">
        
        {/* HERO BACKGROUND */}
        <div className="absolute inset-0">

          <img
            src="/hero.webp"
            alt=""
            className="
              h-full
              w-full
              object-cover
              object-[85%_center]
              md:object-[center_25%]
            "
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/20" />

          {/* LEFT-SIDE TEXT GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />

          {/* ORANGE AMBIENT GLOW */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,var(--ps-accent-soft),transparent_45%)]" />

          {/* BOTTOM GRADIENT */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />

        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20">

          <div className="max-w-5xl">

            <p className="mb-6 text-xs font-bold uppercase tracking-[0.35em] text-ps-red">
              Rock*Well PH Presents:
            </p>

            <h1 className="text-7xl font-black uppercase leading-[0.8] tracking-[-0.06em] sm:text-8xl md:text-[10rem]">
              Public
              <br />
              Secret
            </h1>

            <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-ps-red">
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
                className="btn h-14 rounded-none border-0 bg-ps-red px-8 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-ps-red-hover"
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
              Public Secret 001 brings together music, dance performances,
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
              October 15, 2026 <br/> 9:00 PM
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
              Tickets (Inclusive of 1 free drink) <br /> Walk-in Price: ₱999
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
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-red">
                Public Secret 001
                </p>

                <h2 className="mt-5 text-6xl font-black uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl">
                The
                <br />
                Lineup
                </h2>
            </div>

            </div>

            {/* DJ LINEUP */}
            <div className="mt-16 flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0">

              {djs.map((dj, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={dj.name}
                    className="
                      group
                      relative
                      flex
                      min-w-[78vw]
                      snap-start
                      flex-col
                      overflow-hidden
                      border
                      border-white/10
                      bg-white/[0.02]
                      transition
                      duration-300
                      hover:border-ps-red
                      hover:bg-ps-red-soft
                      sm:min-w-[45vw]
                      md:min-w-0
                    "
                  >

                    {/* DJ IMAGE */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">

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

                      {/* SUBTLE BOTTOM GRADIENT */}
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

                      {/* NUMBER */}
                      <span
                        className="
                          absolute
                          left-4
                          top-4
                          text-[10px]
                          font-bold
                          tracking-[0.25em]
                          text-white/60
                        "
                      >
                        {number}
                      </span>

                    </div>

                    {/* DJ INFO */}
                    <div className="flex min-h-[92px] flex-1 items-center justify-between p-5">

                      <div>

                        <h3 className="mt-1 text-xl font-black uppercase">
                          {dj.name}
                        </h3>
                      </div>

                      <span className="text-lg text-white/20 transition group-hover:text-ps-red">
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
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition hover:text-ps-red"
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
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-red">
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
      <div className="group relative min-w-[88vw] overflow-hidden border border-ps-red-border bg-white/[0.02] transition duration-500 hover:border-ps-red md:min-w-0">

        {/* ROCK*WELL PH PERFORMANCE IMAGE */}
        <div className="relative aspect-[16/8] overflow-hidden bg-neutral-900">

          <img
            src="/rockwell.webp"
            alt="Rock*Well PH Performance"
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              object-center
              transition
              duration-700
              group-hover:scale-[1.02]
            "
          />

          {/* SUBTLE DARK OVERLAY */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/30
              via-transparent
              to-black/10
            "
          />

          {/* PERFORMANCE NUMBER */}
          <span
            className="
              absolute
              left-5
              top-5
              text-[10px]
              font-bold
              tracking-[0.3em]
              text-ps-red
            "
          >
            01
          </span>

          {/* FEATURED BADGE */}
          <span
            className="
              absolute
              right-5
              top-5
              border
              border-ps-red/40
              bg-black/40
              px-3
              py-2
              text-[9px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-ps-red
              backdrop-blur-sm
            "
          >
            Featured
          </span>

        </div>

        {/* INFO */}
        <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-end md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ps-red">
              Main Performance
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-5xl">
              Rock*Well PH
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/40">
              Performances from Rock*Well PH.
            </p>
          </div>

          <span className="text-2xl text-ps-red transition-transform duration-300 group-hover:translate-x-2">
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
            className="group relative min-w-[78vw] snap-start overflow-hidden border border-white/10 bg-white/[0.02] transition duration-300 hover:border-ps-red hover:bg-ps-red-soft sm:min-w-[45vw] lg:min-w-0"
        >
          {/* PERFORMANCE IMAGE */}
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">

            <img
              src={group.image}
              alt={`${group.name} performance`}
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

            {/* SUBTLE BOTTOM GRADIENT */}
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

            {/* PERFORMANCE NUMBER */}
            <span
              className="
                absolute
                left-4
                top-4
                text-[10px]
                font-bold
                tracking-[0.25em]
                text-white/60
              "
            >
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

            <span className="text-lg text-white/20 transition group-hover:text-ps-red">
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
                    className="btn btn-lg h-16 rounded-none border-0 bg-ps-red px-10 text-white hover:bg-ps-red-hover"
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