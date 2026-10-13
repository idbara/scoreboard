import type { GameState, TeamId } from '../types/badminton';

interface ScoreboardProps {
  state: GameState;
  scorePop?: TeamId | null;
}

export default function Scoreboard({ state, scorePop }: ScoreboardProps) {
  const { scoreA, scoreB, sidesSwapped, teamA, teamB } = state;

  const leftTeam: TeamId = sidesSwapped ? 'B' : 'A';
  const rightTeam: TeamId = sidesSwapped ? 'A' : 'B';

  const leftPlayers = sidesSwapped ? teamB : teamA;
  const rightPlayers = sidesSwapped ? teamA : teamB;

  const leftScore = sidesSwapped ? scoreB : scoreA;
  const rightScore = sidesSwapped ? scoreA : scoreB;

  const leftColor = leftTeam === 'A' ? 'text-team-a-light' : 'text-team-b-light';
  const rightColor = rightTeam === 'A' ? 'text-team-a-light' : 'text-team-b-light';

  return (
    <div className="flex items-center justify-center border-b border-white/[0.04] bg-dark-card py-2">
      {/* Sisi Kiri Wasit */}
      <div className="flex flex-1 flex-col items-center gap-0.5 px-2">
        <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${leftColor}`}>
          Tim {leftTeam}
        </span>
        <span
          className={`font-mono text-[2.5rem] font-bold leading-none tracking-tight ${leftColor} ${
            scorePop === leftTeam ? 'animate-score-pop' : ''
          }`}
        >
          {leftScore}
        </span>
        <span className="max-w-[130px] truncate text-[0.62rem] text-slate-400 font-medium">
          {Array.isArray(leftPlayers) ? leftPlayers.filter(Boolean).join(' & ') : leftPlayers}
        </span>
      </div>

      {/* Divider */}
      <div className="px-2">
        <span className="text-2xl font-light text-slate-600">—</span>
      </div>

      {/* Sisi Kanan Wasit */}
      <div className="flex flex-1 flex-col items-center gap-0.5 px-2">
        <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${rightColor}`}>
          Tim {rightTeam}
        </span>
        <span
          className={`font-mono text-[2.5rem] font-bold leading-none tracking-tight ${rightColor} ${
            scorePop === rightTeam ? 'animate-score-pop' : ''
          }`}
        >
          {rightScore}
        </span>
        <span className="max-w-[130px] truncate text-[0.62rem] text-slate-400 font-medium">
          {Array.isArray(rightPlayers) ? rightPlayers.filter(Boolean).join(' & ') : rightPlayers}
        </span>
      </div>
    </div>
  );
}
