import type { GameState } from '../types/badminton';

interface CourtHeaderProps {
  state: GameState;
  formattedDuration: string;
  canUndo: boolean;
  onUndo: () => void;
  onMenuOpen: () => void;
}

export default function CourtHeader({
  state,
  formattedDuration,
  canUndo,
  onUndo,
  onMenuOpen,
}: CourtHeaderProps) {
  const { servingTeam, ball, gameMode, matchType } = state;

  const teamColor = servingTeam === 'A' ? 'text-team-a-light' : 'text-team-b-light';
  const ballBg =
    ball === 2
      ? 'bg-amber-500 text-dark-bg animate-pulse-warn'
      : servingTeam === 'A'
        ? 'bg-team-a text-white'
        : 'bg-team-b text-white';

  const isRally = gameMode === 'rally_point';
  const isTunggal = matchType === 'tunggal';
  const showBallBadge = !isRally && !isTunggal;

  return (
    <div className="glass-panel z-10 flex items-center justify-between border-b border-white/[0.06] px-3 pb-2 pt-[max(env(safe-area-inset-top,0px),8px)]">
      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors active:bg-white/10 active:text-slate-200 disabled:pointer-events-none disabled:opacity-30"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 10h13a4 4 0 010 8H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14L3 10l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Center: Live Timer & Serve status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-black/40 px-2.5 py-1 text-[0.65rem] font-mono font-bold text-slate-300">
          <span className="text-[0.6rem]">⏱️</span>
          <span>{formattedDuration || '0:00'}</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-dark-surface1 px-3 py-1">
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500">Servis</span>
          <span className={`text-xs font-bold ${teamColor}`}>Tim {servingTeam}</span>
          {showBallBadge && (
            <span
              className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full font-mono text-[0.6rem] font-extrabold ${ballBg}`}
            >
              {ball}
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <button
        onClick={onMenuOpen}
        aria-label="Menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors active:bg-white/10 active:text-slate-200"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
