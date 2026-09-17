export default function StatCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`border p-6 md:p-8 ${
        highlight
          ? "border-ps-red-border bg-ps-red-soft"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
        {label}
      </p>

      <p
        className={`mt-5 text-4xl font-black tracking-tight md:text-5xl ${
          highlight
            ? "text-ps-red"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}