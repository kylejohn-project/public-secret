export default function Footer() {
  return (
    <footer className="border-t border-orange-900/20 bg-black px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-black tracking-[0.25em] text-white">
            PUBLIC SECRET
            <span className="ml-2 text-orange-600">001</span>
          </p>

          <p className="mt-3 text-sm text-white/40">
            Hydro Superclub
          </p>
        </div>

        <div className="text-sm text-white/30">
          © 2026 Public Secret
        </div>

      </div>
    </footer>
  );
}