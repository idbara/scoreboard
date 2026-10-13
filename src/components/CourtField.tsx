import PlayerBox from './PlayerBox';
import type { GameState, TeamId } from '../types/badminton';

interface CourtFieldProps {
  state: GameState;
  swapAnimTeam?: string | null;
  courtFlip?: boolean;
  onRally?: (team: TeamId) => void;
}

export default function CourtField({
  state,
  swapAnimTeam,
  courtFlip,
  onRally,
}: CourtFieldProps) {
  const { teamA, teamB, servingTeam, ball, serverIndex, sidesSwapped, matchType } = state;

  const isTunggal = matchType === 'tunggal';

  // Determine which team shows on left / right (view wasit)
  const leftTeam: TeamId = sidesSwapped ? 'B' : 'A';
  const rightTeam: TeamId = sidesSwapped ? 'A' : 'B';
  const leftPlayers = sidesSwapped ? teamB : teamA;
  const rightPlayers = sidesSwapped ? teamA : teamB;

  function isServing(team: TeamId, posIndex: number): boolean {
    if (state.gameOver) return false;
    return servingTeam === team && serverIndex === posIndex;
  }

  const leftGradient =
    leftTeam === 'A'
      ? 'bg-gradient-to-r from-blue-500/[0.08] to-transparent'
      : 'bg-gradient-to-r from-red-500/[0.08] to-transparent';
  const rightGradient =
    rightTeam === 'A'
      ? 'bg-gradient-to-l from-blue-500/[0.08] to-transparent'
      : 'bg-gradient-to-l from-red-500/[0.08] to-transparent';

  const isSwappingLeft = swapAnimTeam === leftTeam;
  const isSwappingRight = swapAnimTeam === rightTeam;

  const activeSinglesIndex = serverIndex;

  const leftP0 = leftPlayers[0] ?? '';
  const leftP1 = leftPlayers[1] ?? '';
  const rightP0 = rightPlayers[0] ?? '';
  const rightP1 = rightPlayers[1] ?? '';

  return (
    <div
      className={`relative mx-2 my-1.5 flex min-h-0 flex-1 overflow-hidden rounded-2xl border-[3px] border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_60px_rgba(0,0,0,0.2)] ${
        courtFlip ? 'animate-court-flip' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #18633b 0%, #12532e 50%, #0d4224 100%)',
      }}
    >
      {/* Court markings */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div
          className={`absolute left-0 right-0 top-[9%] h-[1.5px] ${
            isTunggal ? 'bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.6)]' : 'bg-white/40'
          }`}
        />
        <div
          className={`absolute left-0 right-0 bottom-[9%] h-[1.5px] ${
            isTunggal ? 'bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.6)]' : 'bg-white/40'
          }`}
        />

        {!isTunggal && (
          <>
            <div className="absolute top-0 bottom-0 left-[7%] w-[1.5px] bg-white/40" />
            <div className="absolute top-0 bottom-0 right-[7%] w-[1.5px] bg-white/40" />
          </>
        )}

        <div className="absolute top-0 bottom-0 left-[34%] w-[1.5px] bg-white/55" />
        <div className="absolute top-0 bottom-0 right-[34%] w-[1.5px] bg-white/55" />

        <div className="absolute top-1/2 left-0 w-[34%] h-[1.5px] -translate-y-1/2 bg-white/60" />
        <div className="absolute top-1/2 right-0 w-[34%] h-[1.5px] -translate-y-1/2 bg-white/60" />
      </div>

      {/* Sisi Kiri Wasit */}
      <div
        onClick={() => onRally && onRally(leftTeam)}
        className={`relative z-[2] flex flex-1 flex-col justify-around py-3 pl-2 pr-4 cursor-pointer select-none transition-colors hover:bg-white/[0.02] active:bg-white/[0.04] ${leftGradient}`}
      >
        <div
          className={`absolute left-2.5 top-2.5 z-[3] flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-extrabold shadow-sm ${
            leftTeam === 'A'
              ? 'border border-blue-400/40 bg-blue-500/25 text-team-a-light'
              : 'border border-red-400/40 bg-red-500/25 text-team-b-light'
          }`}
        >
          <span className="text-[0.6rem]">{leftTeam === 'A' ? '🔵' : '🔴'}</span>
          <span>Tim {leftTeam} {isTunggal ? '(Tunggal)' : ''}</span>
        </div>

        {/* Top Court (Posisi Kiri) */}
        <div className="flex flex-1 items-center justify-center">
          {isTunggal ? (
            activeSinglesIndex === 1 ? (
              <PlayerBox
                name={leftP0}
                posLabel="Kiri"
                isServing={isServing(leftTeam, 1)}
                ball={ball}
                team={leftTeam}
                swapAnim={isSwappingLeft ? 'down' : null}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 px-3 py-1.5 opacity-40 text-[0.6rem] text-slate-400">
                Bidang Kiri
              </div>
            )
          ) : (
            <PlayerBox
              name={leftP1}
              posLabel="Kiri"
              isServing={isServing(leftTeam, 1)}
              ball={ball}
              team={leftTeam}
              swapAnim={isSwappingLeft ? 'down' : null}
            />
          )}
        </div>

        {/* Bottom Court (Posisi Kanan) */}
        <div className="flex flex-1 items-center justify-center">
          {isTunggal ? (
            activeSinglesIndex === 0 ? (
              <PlayerBox
                name={leftP0}
                posLabel="Kanan"
                isServing={isServing(leftTeam, 0)}
                ball={ball}
                team={leftTeam}
                swapAnim={isSwappingLeft ? 'up' : null}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 px-3 py-1.5 opacity-40 text-[0.6rem] text-slate-400">
                Bidang Kanan
              </div>
            )
          ) : (
            <PlayerBox
              name={leftP0}
              posLabel="Kanan"
              isServing={isServing(leftTeam, 0)}
              ball={ball}
              team={leftTeam}
              swapAnim={isSwappingLeft ? 'up' : null}
            />
          )}
        </div>
      </div>

      {/* NET TENGAH */}
      <div className="relative z-[5] flex w-5 flex-shrink-0 flex-col items-center justify-between py-1 pointer-events-none">
        <div className="h-2.5 w-2.5 rounded-full bg-slate-200 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />

        <div className="relative my-0.5 flex flex-1 items-center justify-center">
          <div className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          <div className="net-vertical h-full w-3 opacity-70" />
          <span className="absolute z-10 rotate-90 rounded bg-black/60 px-1 py-0.5 text-[0.55rem] font-black tracking-widest text-court-net backdrop-blur-sm">
            NET
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-200 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      {/* Kursi Wasit Indicator */}
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-[10] -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-white/20 bg-dark-bg/90 px-2 py-0.5 shadow-lg backdrop-blur-md">
          <span className="text-[0.65rem] leading-none">🪑</span>
          <span className="text-[0.52rem] font-black tracking-wider text-slate-300 uppercase">
            Wasit
          </span>
        </div>
      </div>

      {/* Sisi Kanan Wasit */}
      <div
        onClick={() => onRally && onRally(rightTeam)}
        className={`relative z-[2] flex flex-1 flex-col justify-around py-3 pl-4 pr-2 cursor-pointer select-none transition-colors hover:bg-white/[0.02] active:bg-white/[0.04] ${rightGradient}`}
      >
        <div
          className={`absolute right-2.5 top-2.5 z-[3] flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-extrabold shadow-sm ${
            rightTeam === 'A'
              ? 'border border-blue-400/40 bg-blue-500/25 text-team-a-light'
              : 'border border-red-400/40 bg-red-500/25 text-team-b-light'
          }`}
        >
          <span className="text-[0.6rem]">{rightTeam === 'A' ? '🔵' : '🔴'}</span>
          <span>Tim {rightTeam} {isTunggal ? '(Tunggal)' : ''}</span>
        </div>

        {/* Top Court (Posisi Kanan) */}
        <div className="flex flex-1 items-center justify-center">
          {isTunggal ? (
            activeSinglesIndex === 0 ? (
              <PlayerBox
                name={rightP0}
                posLabel="Kanan"
                isServing={isServing(rightTeam, 0)}
                ball={ball}
                team={rightTeam}
                swapAnim={isSwappingRight ? 'down' : null}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 px-3 py-1.5 opacity-40 text-[0.6rem] text-slate-400">
                Bidang Kanan
              </div>
            )
          ) : (
            <PlayerBox
              name={rightP0}
              posLabel="Kanan"
              isServing={isServing(rightTeam, 0)}
              ball={ball}
              team={rightTeam}
              swapAnim={isSwappingRight ? 'down' : null}
            />
          )}
        </div>

        {/* Bottom Court (Posisi Kiri) */}
        <div className="flex flex-1 items-center justify-center">
          {isTunggal ? (
            activeSinglesIndex === 1 ? (
              <PlayerBox
                name={rightP0}
                posLabel="Kiri"
                isServing={isServing(rightTeam, 1)}
                ball={ball}
                team={rightTeam}
                swapAnim={isSwappingRight ? 'up' : null}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 px-3 py-1.5 opacity-40 text-[0.6rem] text-slate-400">
                Bidang Kiri
              </div>
            )
          ) : (
            <PlayerBox
              name={rightP1}
              posLabel="Kiri"
              isServing={isServing(rightTeam, 1)}
              ball={ball}
              team={rightTeam}
              swapAnim={isSwappingRight ? 'up' : null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
