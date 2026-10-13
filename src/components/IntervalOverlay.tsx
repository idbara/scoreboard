interface IntervalOverlayProps {
  show: boolean;
  scoreA: number;
  scoreB: number;
  intervalScore: number;
  onContinue: (swapSides: boolean) => void;
}

export default function IntervalOverlay({
  show,
  scoreA,
  scoreB,
  intervalScore,
  onContinue,
}: IntervalOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/85 backdrop-blur-lg transition-opacity duration-300">
      <div className="w-[92%] max-w-[340px] animate-overlay-in rounded-3xl border border-white/[0.08] bg-dark-card p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Animated Icon & Badge */}
        <div className="mb-3 text-4xl animate-bounce">⏱️</div>
        <div className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-amber-400 border border-amber-500/20 mb-2">
          Jeda Interval ({intervalScore} Poin)
        </div>

        <h2 className="mb-1 text-2xl font-black text-white">
          Waktu Istirahat
        </h2>

        {/* Skor saat interval */}
        <div className="my-3 flex items-center justify-center gap-3 rounded-2xl bg-black/40 py-2.5 px-4 border border-white/5">
          <div className="text-center">
            <span className="text-[0.65rem] font-bold text-team-a-light block">Tim A</span>
            <span className="text-2xl font-black text-white font-mono">{scoreA}</span>
          </div>
          <span className="text-sm font-bold text-slate-500">-</span>
          <div className="text-center">
            <span className="text-[0.65rem] font-bold text-team-b-light block">Tim B</span>
            <span className="text-2xl font-black text-white font-mono">{scoreB}</span>
          </div>
        </div>

        <p className="mb-5 text-xs leading-relaxed text-slate-400">
          Apakah pemain bertukar sisi lapangan?
          <span className="block mt-1 text-[0.65rem] text-slate-500">
            (Pilih tetap di sisi ini jika bermain sistem game beruntun / tidak perlu tukar sisi)
          </span>
        </p>

        {/* Pilihan Aksi */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onContinue(true)}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-accent to-cyan-500 py-3 text-xs font-black uppercase tracking-wider text-dark-bg shadow-[0_4px_16px_rgba(34,211,238,0.25)] transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <span>🔄</span>
            <span>Tukar Sisi & Lanjutkan</span>
          </button>

          <button
            onClick={() => onContinue(false)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-dark-surface1 py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 active:scale-[0.98]"
          >
            <span>➡️</span>
            <span>Tetap di Sisi Ini & Lanjut</span>
          </button>
        </div>
      </div>
    </div>
  );
}
