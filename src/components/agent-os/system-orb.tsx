export function SystemOrb({ sync = 100 }: { sync?: number }) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
      {/* drifting wave field */}
      <svg
        viewBox="0 0 400 400"
        className="animate-wave absolute inset-0 h-full w-full opacity-70"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M0,${190 + i * 12} C 90,${140 - i * 18} 150,${250 + i * 16} 200,200 C 250,${150 - i * 14} 310,${260 + i * 18} 400,${190 + i * 12}`}
            fill="none"
            strokeWidth={0.8}
            className="stroke-primary/40"
          />
        ))}
      </svg>

      <div className="animate-orb-spin absolute inset-[6%] rounded-full border border-primary/25 border-dashed" />
      <div className="animate-orb-spin-rev absolute inset-[16%] rounded-full border border-primary/20" />
      <div className="animate-orb-pulse absolute inset-[24%] rounded-full bg-primary/10 blur-xl" />

      <svg viewBox="0 0 200 200" className="relative h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="orbCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="35%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="58" fill="url(#orbCore)" opacity="0.5" />
        <circle cx="100" cy="100" r="46" className="fill-none stroke-primary/40" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="34" className="fill-none stroke-primary/60" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="22" className="fill-none stroke-primary/70" strokeWidth="0.6" />
        <g className="animate-orb-pulse">
          <circle cx="100" cy="100" r="7" className="fill-primary" />
        </g>
        {Array.from({ length: 160 }).map((_, i) => {
          const a = (i / 160) * Math.PI * 2 * 3;
          const r = 20 + (i % 40) * 1.15;
          return (
            <circle
              key={i}
              cx={100 + Math.cos(a) * r}
              cy={100 + Math.sin(a) * r * 0.98}
              r={0.55}
              className="fill-primary/60"
            />
          );
        })}
      </svg>

      <div className="absolute bottom-0 flex items-center gap-3">
        <span className="label-caps">System sync</span>
        <span className="font-display text-sm text-primary">{sync}%</span>
      </div>
    </div>
  );
}
