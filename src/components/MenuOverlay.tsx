interface MenuOverlayProps {
  show: boolean;
  onClose: () => void;
  onReset: () => void;
  onNewMatch: () => void;
  onOpenHistory: () => void;
  onSwapSides: () => void;
}

export default function MenuOverlay({
  show,
  onClose,
  onReset,
  onNewMatch,
  onOpenHistory,
  onSwapSides,
}: MenuOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/85 backdrop-blur-lg transition-opacity duration-300">
      <div className="w-[90%] max-w-[320px] animate-overlay-in rounded-3xl border border-white/[0.08] bg-dark-card p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <h2 className="mb-4 text-xl font-extrabold text-white">Menu Pertandingan</h2>

        <button
          onClick={onOpenHistory}
          className="mb-2 flex w-full items-center gap-2.5 rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-left text-xs font-bold text-accent transition-colors hover:bg-accent/20 active:scale-[0.98]"
        >
          <span>📊</span>
          <span>Riwayat & Statistik</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onSwapSides();
          }}
          className="mb-2 flex w-full items-center gap-2.5 rounded-xl bg-dark-surface1 px-4 py-3 text-left text-xs font-semibold text-slate-200 transition-colors hover:bg-dark-surface2 active:scale-[0.98]"
        >
          <span>🔄</span>
          <span>Tukar Sisi Lapangan (Kiri / Kanan)</span>
        </button>

        <button
          onClick={onReset}
          className="mb-2 flex w-full items-center gap-2.5 rounded-xl bg-dark-surface1 px-4 py-3 text-left text-xs font-semibold text-slate-200 transition-colors hover:bg-dark-surface2 active:scale-[0.98]"
        >
          <span>⏮️</span>
          <span>Reset Pertandingan Ini</span>
        </button>

        <button
          onClick={onNewMatch}
          className="mb-2 flex w-full items-center gap-2.5 rounded-xl bg-dark-surface1 px-4 py-3 text-left text-xs font-semibold text-slate-200 transition-colors hover:bg-dark-surface2 active:scale-[0.98]"
        >
          <span>🏸</span>
          <span>Pertandingan Baru</span>
        </button>

        <button
          onClick={onClose}
          className="mt-1 flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-300 active:bg-dark-surface1"
        >
          ✕ Tutup
        </button>
      </div>
    </div>
  );
}
