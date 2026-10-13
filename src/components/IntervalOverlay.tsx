interface IntervalOverlayProps {
  show: boolean;
  onOk: () => void;
}

export default function IntervalOverlay({ show, onOk }: IntervalOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/85 backdrop-blur-lg transition-opacity duration-300">
      <div className="w-[90%] max-w-[320px] animate-overlay-in rounded-3xl border border-white/[0.08] bg-dark-card p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="mb-4 animate-spin-slow text-5xl">🔄</div>
        <h2 className="mb-2 bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-2xl font-extrabold text-transparent">
          Interval!
        </h2>
        <p className="mb-5 text-sm text-slate-400">Tukar Sisi Lapangan</p>
        <button
          onClick={onOk}
          className="w-full rounded-xl bg-gradient-to-br from-accent to-cyan-500 py-3.5 text-sm font-bold text-dark-bg shadow-[0_4px_16px_rgba(34,211,238,0.25)] transition-transform active:translate-y-0.5"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
