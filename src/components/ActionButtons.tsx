import type { GameState, TeamId } from '../types/badminton';

interface ActionButtonsProps {
  state: GameState;
  onRally: (team: TeamId) => void;
}

export default function ActionButtons({ state, onRally }: ActionButtonsProps) {
  const { gameOver, sidesSwapped } = state;

  const leftTeam: TeamId = sidesSwapped ? 'B' : 'A';
  const rightTeam: TeamId = sidesSwapped ? 'A' : 'B';

  const leftBg =
    leftTeam === 'A'
      ? 'from-team-a to-blue-600 shadow-[0_4px_16px_rgba(59,130,246,0.35)]'
      : 'from-team-b to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.35)]';

  const rightBg =
    rightTeam === 'A'
      ? 'from-team-a to-blue-600 shadow-[0_4px_16px_rgba(59,130,246,0.35)]'
      : 'from-team-b to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.35)]';

  return (
    <div className="glass-panel z-10 grid grid-cols-2 gap-2 border-t border-white/[0.06] p-2 pb-[max(env(safe-area-inset-bottom,0px),8px)]">
      <button
        id={`btn-${leftTeam.toLowerCase()}-wins`}
        onClick={() => onRally(leftTeam)}
        disabled={gameOver}
        className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br ${leftBg} px-3 py-[18px] text-[0.9rem] font-bold text-white transition-transform active:translate-y-0.5 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40`}
      >
        <span>Tim {leftTeam} Menang</span>
        <span className="text-xl">👆</span>
      </button>
      <button
        id={`btn-${rightTeam.toLowerCase()}-wins`}
        onClick={() => onRally(rightTeam)}
        disabled={gameOver}
        className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br ${rightBg} px-3 py-[18px] text-[0.9rem] font-bold text-white transition-transform active:translate-y-0.5 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40`}
      >
        <span>Tim {rightTeam} Menang</span>
        <span className="text-xl">👆</span>
      </button>
    </div>
  );
}
