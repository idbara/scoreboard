import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { GameMode, MatchType, TeamId } from '../types/badminton';

interface SetupScreenProps {
  onStart: (
    a1: string,
    a2: string,
    b1: string,
    b2: string,
    firstServe: TeamId,
    gameMode: GameMode,
    targetScore: number,
    matchType: MatchType
  ) => void;
  onOpenHistory: () => void;
}

export default function SetupScreen({ onStart, onOpenHistory }: SetupScreenProps) {
  const [matchType, setMatchType] = useState<MatchType>('ganda');
  const [a1, setA1] = useState<string>('');
  const [a2, setA2] = useState<string>('');
  const [b1, setB1] = useState<string>('');
  const [b2, setB2] = useState<string>('');
  const [firstServe, setFirstServe] = useState<TeamId>('A');
  const [gameMode, setGameMode] = useState<GameMode>('pindah_bola');
  const [targetScore, setTargetScore] = useState<number>(30);

  const isTunggal = matchType === 'tunggal';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isTunggal) {
      onStart(
        a1.trim() || 'Pemain A',
        '',
        b1.trim() || 'Pemain B',
        '',
        firstServe,
        gameMode,
        gameMode === 'pindah_bola' ? 30 : targetScore,
        'tunggal'
      );
    } else {
      onStart(
        a1.trim() || 'A1',
        a2.trim() || 'A2',
        b1.trim() || 'B1',
        b2.trim() || 'B2',
        firstServe,
        gameMode,
        gameMode === 'pindah_bola' ? 30 : targetScore,
        'ganda'
      );
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto bg-dark-bg">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[60%] w-[60%] rounded-full bg-team-a/[0.06] blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[50%] w-[50%] rounded-full bg-team-b/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 pt-[max(env(safe-area-inset-top,0px),20px)]">
        {/* Top Bar with History Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">
            Papan Skor Digital
          </div>
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-dark-surface1 px-3 py-1.5 text-xs font-bold text-accent shadow-sm transition-all hover:bg-white/10 active:scale-95"
          >
            <span>📊</span>
            <span>Riwayat & Statistik</span>
          </button>
        </div>

        {/* Header */}
        <header className="mb-3 text-center">
          <div className="inline-block animate-float text-4xl drop-shadow-[0_4px_12px_rgba(34,211,238,0.3)]">
            🏸
          </div>
          <h1 className="mt-1 text-[1.65rem] font-extrabold leading-tight tracking-tight">
            Papan Skor
            <span className="ml-2 bg-gradient-to-br from-accent to-team-a-light bg-clip-text text-transparent">
              Badminton
            </span>
          </h1>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-slate-400">
            {isTunggal ? 'Kategori Tunggal' : 'Kategori Ganda'} &bull;{' '}
            {gameMode === 'pindah_bola' ? '30 Pindah Bola' : `Rally Point (${targetScore})`}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3" autoComplete="off">
          {/* Pilihan 1: Kategori Tunggal vs Ganda */}
          <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-3 shadow-sm">
            <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-slate-300">
              Kategori Pertandingan:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMatchType('ganda')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-center transition-all ${
                  matchType === 'ganda'
                    ? 'border-blue-400 bg-blue-500/20 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.25)] font-extrabold'
                    : 'border-white/5 bg-dark-surface1 text-slate-400 hover:border-white/20'
                }`}
              >
                <span className="text-base">👥</span>
                <div className="text-left">
                  <div className="text-xs font-bold">Ganda</div>
                  <div className="text-[0.6rem] text-slate-400">2 vs 2 Pemain</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMatchType('tunggal')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-center transition-all ${
                  matchType === 'tunggal'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)] font-extrabold'
                    : 'border-white/5 bg-dark-surface1 text-slate-400 hover:border-white/20'
                }`}
              >
                <span className="text-base">👤</span>
                <div className="text-left">
                  <div className="text-xs font-bold">Tunggal</div>
                  <div className="text-[0.6rem] text-slate-400">1 vs 1 Pemain</div>
                </div>
              </button>
            </div>
          </div>

          {/* Pilihan 2: Sistem Skor */}
          <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-3 shadow-sm">
            <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-slate-300">
              Sistem Skor:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setGameMode('pindah_bola');
                  setTargetScore(30);
                }}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  gameMode === 'pindah_bola'
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'border-white/5 bg-dark-surface1 text-slate-400 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-extrabold">30 Pindah Bola</span>
                <span className="text-[0.6rem] text-slate-400 mt-0.5">Klasik / Tarkam GOR</span>
              </button>

              <button
                type="button"
                onClick={() => setGameMode('rally_point')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  gameMode === 'rally_point'
                    ? 'border-purple-400 bg-purple-500/20 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'border-white/5 bg-dark-surface1 text-slate-400 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-extrabold">Rally Point</span>
                <span className="text-[0.6rem] text-slate-400 mt-0.5">Modern / Standar BWF</span>
              </button>
            </div>

            {gameMode === 'rally_point' && (
              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-black/30 px-3 py-2 animate-overlay-in">
                <span className="text-[0.7rem] font-bold text-slate-300">Target Skor:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTargetScore(21)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      targetScore === 21
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    21 Poin (BWF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetScore(30)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                      targetScore === 30
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    30 Poin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Input Pemain Tim A */}
          <TeamInputCard
            team="A"
            color="blue"
            icon="🔵"
            isTunggal={isTunggal}
            p1={a1}
            setP1={setA1}
            p2={a2}
            setP2={setA2}
            showHint
          />

          {/* Form Input Pemain Tim B */}
          <TeamInputCard
            team="B"
            color="red"
            icon="🔴"
            isTunggal={isTunggal}
            p1={b1}
            setP1={setB1}
            p2={b2}
            setP2={setB2}
          />

          {/* Serve toggle */}
          <div className="my-1.5 text-center">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Servis Pertama:
            </p>
            <div className="relative inline-flex rounded-full border border-white/[0.08] bg-dark-surface1 p-1">
              <button
                type="button"
                onClick={() => setFirstServe('A')}
                className={`relative z-10 rounded-full px-7 py-2 text-sm font-bold transition-colors duration-300 ${
                  firstServe === 'A' ? 'text-white' : 'text-slate-400'
                }`}
              >
                Tim A
              </button>
              <button
                type="button"
                onClick={() => setFirstServe('B')}
                className={`relative z-10 rounded-full px-7 py-2 text-sm font-bold transition-colors duration-300 ${
                  firstServe === 'B' ? 'text-white' : 'text-slate-400'
                }`}
              >
                Tim B
              </button>
              <div
                className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  firstServe === 'A'
                    ? 'left-1 bg-gradient-to-br from-team-a to-team-a-light'
                    : 'left-[calc(50%+0px)] bg-gradient-to-br from-team-b to-team-b-light'
                }`}
              />
            </div>
          </div>

          {/* Start button */}
          <button
            type="submit"
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-accent to-cyan-500 px-6 py-3.5 text-base font-bold text-dark-bg shadow-[0_4px_20px_rgba(34,211,238,0.3)] transition-transform active:translate-y-0.5"
          >
            <span>Mulai Pertandingan</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

interface TeamInputCardProps {
  team: TeamId;
  color: 'blue' | 'red';
  icon: string;
  isTunggal: boolean;
  p1: string;
  setP1: (val: string) => void;
  p2: string;
  setP2: (val: string) => void;
  showHint?: boolean;
}

function TeamInputCard({
  team,
  color,
  icon,
  isTunggal,
  p1,
  setP1,
  p2,
  setP2,
  showHint,
}: TeamInputCardProps) {
  const barBg =
    color === 'blue'
      ? 'bg-gradient-to-r from-team-a/20 to-transparent'
      : 'bg-gradient-to-r from-team-b/20 to-transparent';
  const barText = color === 'blue' ? 'text-team-a-light' : 'text-team-b-light';

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-card">
      <div className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider ${barBg} ${barText}`}>
        <span>{icon}</span>
        <span>Tim {team} {isTunggal ? '(Tunggal)' : '(Ganda)'}</span>
      </div>

      {isTunggal ? (
        <div className="px-4 pb-3 pt-2.5">
          <InputField
            id={`${team.toLowerCase()}1`}
            label={`Nama Pemain ${team}`}
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            hint={showHint ? 'Server Awal' : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-3 pt-2.5">
          <InputField
            id={`${team.toLowerCase()}1`}
            label="Pemain Kanan"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            hint={showHint ? 'Server Awal' : undefined}
          />
          <InputField
            id={`${team.toLowerCase()}2`}
            label="Pemain Kiri"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
}

function InputField({ id, label, value, onChange, hint }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder="Nama pemain"
        maxLength={16}
        required
        className="rounded-lg border-[1.5px] border-white/[0.08] bg-dark-surface1 px-3 py-2 text-sm font-semibold text-slate-200 placeholder-slate-600 transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(34,211,238,0.25)] focus:outline-none"
      />
      {hint && (
        <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-accent">{hint}</span>
      )}
    </div>
  );
}
