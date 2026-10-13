import { useEffect, useRef } from 'react';
import type { GameState, TeamId } from '../types/badminton';

interface WinnerOverlayProps {
  show: boolean;
  state: GameState | null;
  formattedDuration: string;
  onNewMatch: () => void;
  onOpenHistory: () => void;
}

export default function WinnerOverlay({
  show,
  state,
  formattedDuration,
  onNewMatch,
  onOpenHistory,
}: WinnerOverlayProps) {
  const confettiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!show || !confettiRef.current) return;
    spawnConfetti(confettiRef.current);
  }, [show]);

  if (!show || !state) return null;

  const winner: TeamId = state.scoreA > state.scoreB ? 'A' : 'B';
  const winnerPlayers = winner === 'A' ? state.teamA : state.teamB;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/85 backdrop-blur-lg transition-opacity duration-300 p-4">
      <div className="relative w-full max-w-[360px] animate-overlay-in overflow-hidden rounded-3xl border border-white/[0.12] bg-dark-card p-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {/* Confetti */}
        <div ref={confettiRef} className="pointer-events-none absolute inset-0 overflow-hidden" />

        <div className="relative z-10">
          <div className="mb-2 animate-trophy-bounce text-5xl">🏆</div>
          <h2 className="bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 bg-clip-text text-2xl font-black text-transparent">
            Tim {winner} Menang!
          </h2>
          <p className="text-xs font-bold text-slate-300 mt-0.5">
            {winnerPlayers?.join(' & ')}
          </p>

          {/* Final Score */}
          <div className="my-3 rounded-2xl bg-black/40 py-2.5 px-4 border border-white/[0.06]">
            <div className="font-mono text-3xl font-black tracking-tight text-white">
              <span className={winner === 'A' ? 'text-team-a-light' : 'text-slate-400'}>
                {state.scoreA}
              </span>
              <span className="mx-2 text-slate-600">—</span>
              <span className={winner === 'B' ? 'text-team-b-light' : 'text-slate-400'}>
                {state.scoreB}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-2 text-[0.68rem] text-slate-400">
              <span>⏱️ {formattedDuration || '0:00'}</span>
              <span>&bull;</span>
              <span className="uppercase font-semibold text-cyan-300">
                {state.matchType === 'tunggal' ? 'Tunggal' : 'Ganda'}
              </span>
              <span>&bull;</span>
              <span className="uppercase font-semibold">
                {state.gameMode === 'rally_point' ? `Rally Point ${state.targetScore}` : '30 Pindah Bola'}
              </span>
            </div>
          </div>

          {/* Quick Match Stats */}
          {state.stats && (
            <div className="mb-4 grid grid-cols-2 gap-2 text-[0.7rem] text-left">
              <div className="rounded-xl border border-white/[0.05] bg-dark-surface1 p-2">
                <span className="text-slate-400 block text-[0.6rem] uppercase">Total Reli</span>
                <span className="font-mono font-bold text-white text-sm">
                  {state.stats.totalRallies || state.scoreA + state.scoreB}
                </span>
              </div>
              <div className="rounded-xl border border-white/[0.05] bg-dark-surface1 p-2">
                <span className="text-slate-400 block text-[0.6rem] uppercase">Streak Terbaik</span>
                <span className="font-mono font-bold text-white text-sm">
                  {Math.max(state.stats.maxStreakA || 0, state.stats.maxStreakB || 0)} Poin
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onNewMatch}
              className="w-full rounded-xl bg-gradient-to-br from-accent to-cyan-500 py-3 text-sm font-bold text-dark-bg shadow-[0_4px_16px_rgba(34,211,238,0.25)] transition-transform active:translate-y-0.5"
            >
              Pertandingan Baru
            </button>
            <button
              onClick={onOpenHistory}
              className="w-full rounded-xl border border-white/[0.1] bg-dark-surface1 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-white/10 active:scale-95"
            >
              📊 Lihat Riwayat & Statistik Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function spawnConfetti(container: HTMLElement): void {
  container.replaceChildren();
  const colors = ['#3b82f6', '#ef4444', '#22d3ee', '#f59e0b', '#10b981', '#a855f7', '#f472b6'];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'absolute';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.width = `${5 + Math.random() * 8}px`;
    piece.style.height = `${5 + Math.random() * 8}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)] ?? '#22d3ee';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.className = 'animate-confetti-fall';
    container.appendChild(piece);
  }
}
