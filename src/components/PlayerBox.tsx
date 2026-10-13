import type { TeamId, BallNumber } from '../types/badminton';

interface PlayerBoxProps {
  name: string;
  posLabel: string;
  isServing: boolean;
  ball: BallNumber;
  team: TeamId;
  swapAnim?: 'up' | 'down' | 'left' | 'right' | null;
}

export default function PlayerBox({
  name,
  posLabel,
  isServing,
  ball,
  team,
  swapAnim,
}: PlayerBoxProps) {
  const borderColor =
    team === 'A'
      ? 'border-blue-500/40 bg-blue-950/35 hover:border-blue-400/60'
      : 'border-red-500/40 bg-red-950/35 hover:border-red-400/60';

  const servingBorder =
    'border-accent shadow-[0_0_20px_rgba(34,211,238,0.45),inset_0_0_14px_rgba(34,211,238,0.12)] ring-2 ring-accent/70 bg-cyan-950/40 scale-[1.03]';

  const animClass =
    swapAnim === 'up'
      ? 'animate-swap-up'
      : swapAnim === 'down'
        ? 'animate-swap-down'
        : swapAnim === 'right'
          ? 'animate-swap-right'
          : swapAnim === 'left'
            ? 'animate-swap-left'
            : '';

  const ballBadgeBg = ball === 2 ? 'bg-amber-500 text-dark-bg' : 'bg-team-a text-white';

  return (
    <div className={`z-[2] flex flex-col items-center justify-center gap-1 ${animClass}`}>
      <div
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 backdrop-blur-sm transition-all duration-300 ${
          isServing ? servingBorder : borderColor
        }`}
      >
        <span className="max-w-[75px] sm:max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {name}
        </span>
        {isServing && (
          <span className="relative inline-flex flex-shrink-0 animate-shuttle-bob text-base sm:text-lg">
            🏸
            <span
              className={`absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-black/40 font-mono text-[0.52rem] font-extrabold shadow-sm ${ballBadgeBg}`}
            >
              {ball}
            </span>
          </span>
        )}
      </div>
      <span
        className={`text-[0.6rem] font-bold uppercase tracking-[0.1em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
          isServing ? 'text-accent font-extrabold' : 'text-white/60'
        }`}
      >
        {posLabel}
      </span>
    </div>
  );
}
