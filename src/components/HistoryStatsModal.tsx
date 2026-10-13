import { useState, useMemo, type MouseEvent } from 'react';
import { getMatches, deleteMatch, clearAllMatches, computePlayerStats, formatDuration } from '../utils/storage';
import type { MatchRecord, PlayerStats, GameMode, MatchType } from '../types/badminton';

interface HistoryStatsModalProps {
  show: boolean;
  onClose: () => void;
}

export default function HistoryStatsModal({ show, onClose }: HistoryStatsModalProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'players'>('history');
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchPlayer, setSearchPlayer] = useState<string>('');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Ambil data pertandingan terkini setiap kali modal aktif
  const matches = useMemo<MatchRecord[]>(() => {
    if (!show || dataVersion < 0) return [];
    return getMatches();
  }, [show, dataVersion]);

  const handleDeleteMatch = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Hapus pertandingan ini dari riwayat?')) {
      deleteMatch(id);
      setDataVersion((v) => v + 1);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Yakin ingin menghapus SELURUH riwayat pertandingan?')) {
      clearAllMatches();
      setDataVersion((v) => v + 1);
      setSelectedPlayer(null);
    }
  };

  // Filtered matches
  const filteredMatches = useMemo<MatchRecord[]>(() => {
    return matches.filter((m) => {
      const modeMatch = filterMode === 'all' || m.gameMode === (filterMode as GameMode);
      const typeMatch =
        filterType === 'all' ||
        (m.matchType || (m.teamA.length === 1 ? 'tunggal' : 'ganda')) === (filterType as MatchType);
      return modeMatch && typeMatch;
    });
  }, [matches, filterMode, filterType]);

  // Aggregated player statistics
  const playerStatsList = useMemo<PlayerStats[]>(() => {
    return computePlayerStats(matches);
  }, [matches]);

  // Filtered player search
  const filteredPlayerList = useMemo<PlayerStats[]>(() => {
    if (!searchPlayer.trim()) return playerStatsList;
    return playerStatsList.filter((p) =>
      p.name.toLowerCase().includes(searchPlayer.toLowerCase().trim())
    );
  }, [playerStatsList, searchPlayer]);

  // Active player stats detail
  const activePlayerDetail = useMemo<PlayerStats | null>(() => {
    if (!selectedPlayer) {
      return playerStatsList.length > 0 ? playerStatsList[0] ?? null : null;
    }
    return playerStatsList.find((p) => p.name === selectedPlayer) ?? playerStatsList[0] ?? null;
  }, [selectedPlayer, playerStatsList]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-dark-bg/95 backdrop-blur-xl animate-overlay-in">
      {/* Header Modal */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.08] bg-dark-card/90 px-4 py-3 pt-[max(env(safe-area-inset-top,0px),12px)]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div>
            <h2 className="text-base font-extrabold text-white">Riwayat & Statistik</h2>
            <p className="text-[0.68rem] text-slate-400">Analisis Pertandingan & Profil Pemain</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-white/10 active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Tab Switcher */}
      <div className="flex flex-shrink-0 border-b border-white/[0.06] bg-dark-surface1/60 p-2">
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-black/30 p-1">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-team-a to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📜 Riwayat Pertandingan</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[0.65rem]">
              {matches.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-team-b to-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏸 Statistik Pemain</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[0.65rem]">
              {playerStatsList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 pb-8">
        {/* TAB 1: RIWAYAT PERTANDINGAN */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3">
            {/* Filter bar */}
            <div className="flex flex-col gap-2 rounded-xl bg-dark-card/60 p-2.5 border border-white/[0.06]">
              {/* Filter Kategori Tunggal / Ganda */}
              <div className="flex items-center justify-between text-[0.7rem] font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Kategori:</span>
                  <button
                    onClick={() => setFilterType('all')}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      filterType === 'all'
                        ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setFilterType('ganda')}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      filterType === 'ganda'
                        ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    👥 Ganda
                  </button>
                  <button
                    onClick={() => setFilterType('tunggal')}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      filterType === 'tunggal'
                        ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    👤 Tunggal
                  </button>
                </div>

                {matches.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-[0.65rem] font-bold text-red-400 hover:text-red-300 underline"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {/* Filter Mode Permainan */}
              <div className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-slate-400">
                <span className="text-slate-500">Sistem:</span>
                <button
                  onClick={() => setFilterMode('all')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    filterMode === 'all'
                      ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterMode('pindah_bola')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    filterMode === 'pindah_bola'
                      ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  30 Pindah Bola
                </button>
                <button
                  onClick={() => setFilterMode('rally_point')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    filterMode === 'rally_point'
                      ? 'bg-accent/20 text-accent border border-accent/40 font-bold'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  Rally Point
                </button>
              </div>
            </div>

            {/* List pertandingan */}
            {filteredMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <span className="text-4xl mb-2">🏸</span>
                <p className="text-sm font-semibold text-slate-400">Belum ada riwayat pertandingan</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
                  Selesaikan sebuah pertandingan dan skor beserta statistik lengkap akan otomatis tersimpan di sini.
                </p>
              </div>
            ) : (
              filteredMatches.map((m) => {
                const isExpanded = expandedMatchId === m.id;
                const isTunggal = m.matchType === 'tunggal' || (m.teamA.length === 1 && m.teamB.length === 1);
                const dateStr = new Date(m.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={m.id}
                    onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                    className="cursor-pointer overflow-hidden rounded-xl border border-white/[0.08] bg-dark-card transition-all hover:border-white/20 hover:shadow-lg"
                  >
                    {/* Header Card */}
                    <div className="flex items-center justify-between border-b border-white/[0.04] bg-white/[0.02] px-3.5 py-2 text-[0.68rem] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-300">📅 {dateStr}</span>
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-bold text-slate-300">
                          ⏱️ {m.durationFormatted || formatDuration(m.durationSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[0.6rem] font-extrabold text-blue-300 border border-blue-500/30">
                          {isTunggal ? '👤 Tunggal' : '👥 Ganda'}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.6rem] font-extrabold uppercase ${
                            m.gameMode === 'rally_point'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {m.gameMode === 'rally_point' ? `Rally Point (${m.targetScore})` : '30 Pindah Bola'}
                        </span>
                        <button
                          onClick={(e) => handleDeleteMatch(m.id, e)}
                          title="Hapus pertandingan"
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Match Result Body */}
                    <div className="grid grid-cols-5 items-center p-3">
                      {/* Tim A */}
                      <div className="col-span-2 flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">🔵</span>
                          <span className="text-xs font-bold text-team-a-light">Tim A</span>
                          {m.winner === 'A' && (
                            <span className="rounded bg-amber-400/20 px-1.5 py-0.2 text-[0.6rem] font-black text-amber-300">
                              🏆 MENANG
                            </span>
                          )}
                        </div>
                        <div className="text-[0.75rem] font-medium text-slate-200">
                          {m.teamA.join(' & ')}
                        </div>
                      </div>

                      {/* Skor */}
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="font-mono text-xl font-black tracking-tight">
                          <span className={m.winner === 'A' ? 'text-team-a-light' : 'text-slate-400'}>
                            {m.scoreA}
                          </span>
                          <span className="mx-1 text-slate-600">:</span>
                          <span className={m.winner === 'B' ? 'text-team-b-light' : 'text-slate-400'}>
                            {m.scoreB}
                          </span>
                        </div>
                        <span className="text-[0.6rem] text-slate-500">
                          {isExpanded ? '▲ Ringkas' : '▼ Detail'}
                        </span>
                      </div>

                      {/* Tim B */}
                      <div className="col-span-2 flex flex-col items-end gap-1 text-right">
                        <div className="flex items-center gap-1">
                          {m.winner === 'B' && (
                            <span className="rounded bg-amber-400/20 px-1.5 py-0.2 text-[0.6rem] font-black text-amber-300">
                              🏆 MENANG
                            </span>
                          )}
                          <span className="text-xs font-bold text-team-b-light">Tim B</span>
                          <span className="text-xs">🔴</span>
                        </div>
                        <div className="text-[0.75rem] font-medium text-slate-200">
                          {m.teamB.join(' & ')}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Match Statistics Breakdown */}
                    {isExpanded && m.stats && (
                      <div className="border-t border-white/[0.06] bg-black/40 p-3 text-xs animate-overlay-in">
                        <h4 className="mb-2 text-[0.68rem] font-bold uppercase tracking-wider text-accent">
                          Statistik Lengkap Pertandingan
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-[0.72rem]">
                          <div className="rounded-lg border border-white/[0.05] bg-dark-surface1 p-2">
                            <span className="text-slate-400">Total Reli:</span>
                            <span className="float-right font-mono font-bold text-white">
                              {m.stats.totalRallies || m.scoreA + m.scoreB}
                            </span>
                          </div>
                          <div className="rounded-lg border border-white/[0.05] bg-dark-surface1 p-2">
                            <span className="text-slate-400">Pindah Bola:</span>
                            <span className="float-right font-mono font-bold text-white">
                              {m.stats.pindahBolaCount ?? '-'}
                            </span>
                          </div>
                          <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-2">
                            <span className="text-team-a-light">Poin Servis Tim A:</span>
                            <span className="float-right font-mono font-bold text-team-a-light">
                              {m.stats.servicePointsA ?? '-'}
                            </span>
                          </div>
                          <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-2">
                            <span className="text-team-b-light">Poin Servis Tim B:</span>
                            <span className="float-right font-mono font-bold text-team-b-light">
                              {m.stats.servicePointsB ?? '-'}
                            </span>
                          </div>
                          <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-2">
                            <span className="text-team-a-light">Streak Terbaik A:</span>
                            <span className="float-right font-mono font-bold text-team-a-light">
                              {m.stats.maxStreakA ? `${m.stats.maxStreakA} poin` : '-'}
                            </span>
                          </div>
                          <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-2">
                            <span className="text-team-b-light">Streak Terbaik B:</span>
                            <span className="float-right font-mono font-bold text-team-b-light">
                              {m.stats.maxStreakB ? `${m.stats.maxStreakB} poin` : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: STATISTIK PEMAIN, PASANGAN & LAWAN */}
        {activeTab === 'players' && (
          <div className="flex flex-col gap-3">
            {/* Search and player picker */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="🔍 Cari nama pemain..."
                value={searchPlayer}
                onChange={(e) => setSearchPlayer(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-dark-card px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:border-accent focus:outline-none"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {filteredPlayerList.map((p) => {
                  const isSelected = activePlayerDetail?.name === p.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => setSelectedPlayer(p.name)}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-accent to-cyan-500 text-dark-bg shadow-md'
                          : 'bg-dark-card text-slate-300 border border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {p.name} ({p.totalMatches})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail Pemain Terpilih */}
            {!activePlayerDetail ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <span className="text-4xl mb-2">👤</span>
                <p className="text-sm font-semibold text-slate-400">Belum ada data pemain</p>
                <p className="text-xs text-slate-500 mt-1">
                  Mainkan pertandingan untuk mulai merekam statistik individu, rekan duet, dan lawan.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Kartu Profil Utama Pemain */}
                <div className="overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-dark-card to-dark-surface1 p-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-accent">
                        Profil Pemain
                      </span>
                      <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                        {activePlayerDetail.name}
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-xs font-bold text-emerald-300">
                          Win Rate {activePlayerDetail.winRate}%
                        </span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[0.65rem] uppercase text-slate-400">Total Laga</span>
                      <div className="text-xl font-mono font-extrabold text-white">
                        {activePlayerDetail.totalMatches}
                      </div>
                    </div>
                  </div>

                  {/* Stat Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-3 text-center">
                    <div className="rounded-xl bg-black/30 p-2">
                      <span className="block text-[0.6rem] uppercase text-emerald-400 font-bold">Menang</span>
                      <span className="font-mono text-base font-extrabold text-emerald-300">
                        {activePlayerDetail.wins}
                      </span>
                    </div>
                    <div className="rounded-xl bg-black/30 p-2">
                      <span className="block text-[0.6rem] uppercase text-red-400 font-bold">Kalah</span>
                      <span className="font-mono text-base font-extrabold text-red-300">
                        {activePlayerDetail.losses}
                      </span>
                    </div>
                    <div className="rounded-xl bg-black/30 p-2">
                      <span className="block text-[0.6rem] uppercase text-cyan-400 font-bold">Poin Dibuat</span>
                      <span className="font-mono text-base font-extrabold text-cyan-300">
                        {activePlayerDetail.pointsScored}
                      </span>
                    </div>
                    <div className="rounded-xl bg-black/30 p-2">
                      <span className="block text-[0.6rem] uppercase text-amber-400 font-bold">Kebobolan</span>
                      <span className="font-mono text-base font-extrabold text-amber-300">
                        {activePlayerDetail.pointsConceded}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Daftar Pasangan */}
                <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                      <span>🤝</span>
                      <span>Pernah Berpasangan Dengan ({activePlayerDetail.partnerList?.length || 0})</span>
                    </h4>
                    <span className="text-[0.62rem] text-slate-400">Statistik Rekan Duet (Ganda)</span>
                  </div>

                  {activePlayerDetail.partnerList?.length === 0 ? (
                    <p className="py-3 text-center text-xs text-slate-500">
                      Belum pernah bermain ganda dengan pasangan.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {activePlayerDetail.partnerList.map((partner) => (
                        <div
                          key={partner.name}
                          className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-dark-surface1 px-3 py-2"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{partner.name}</span>
                              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[0.6rem] font-semibold text-slate-300">
                                {partner.matches} Pertandingan
                              </span>
                            </div>
                            <div className="text-[0.65rem] text-slate-400 mt-0.5">
                              {partner.wins} Menang &bull; {partner.losses} Kalah
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-mono text-xs font-extrabold ${
                                partner.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                            >
                              {partner.winRate}%
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10 mt-1">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                                style={{ width: `${partner.winRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Daftar Lawan */}
                <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                      <span>⚔️</span>
                      <span>Pernah Melawan ({activePlayerDetail.opponentList?.length || 0})</span>
                    </h4>
                    <span className="text-[0.62rem] text-slate-400">Head-to-Head & Rekor Lawan</span>
                  </div>

                  {activePlayerDetail.opponentList?.length === 0 ? (
                    <p className="py-3 text-center text-xs text-slate-500">Belum ada data lawan.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {activePlayerDetail.opponentList.map((opp) => (
                        <div
                          key={opp.name}
                          className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-dark-surface1 px-3 py-2"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{opp.name}</span>
                              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[0.6rem] font-semibold text-slate-300">
                                {opp.matches} Pertemuan
                              </span>
                            </div>
                            <div className="text-[0.65rem] text-slate-400 mt-0.5">
                              {opp.wins} Menang &bull; {opp.losses} Kalah (vs {opp.name})
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-mono text-xs font-extrabold ${
                                opp.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              Win {opp.winRate}%
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10 mt-1">
                              <div
                                className={`h-full rounded-full ${
                                  opp.winRate >= 50
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                                    : 'bg-gradient-to-r from-red-500 to-amber-500'
                                }`}
                                style={{ width: `${opp.winRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 3: Riwayat Pertandingan Terakhir Pemain Ini */}
                <div className="rounded-2xl border border-white/[0.08] bg-dark-card p-3">
                  <h4 className="mb-2 text-xs font-extrabold text-white">
                    🎯 Riwayat Pertandingan {activePlayerDetail.name} ({activePlayerDetail.recentMatches?.length || 0})
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {activePlayerDetail.recentMatches?.map((rm, idx) => (
                      <div
                        key={rm.id || idx}
                        className={`flex items-center justify-between rounded-lg border p-2 text-xs ${
                          rm.isWinner
                            ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-100'
                            : 'border-red-500/20 bg-red-950/20 text-red-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">{rm.isWinner ? '✅ MENANG' : '❌ KALAH'}</span>
                            <span className="text-[0.68rem] text-slate-400">
                              {rm.partner ? `(Duet: ${rm.partner})` : '(Tunggal)'}
                            </span>
                          </div>
                          <div className="text-[0.62rem] text-slate-400">
                            vs {rm.opponents?.join(' & ')}
                          </div>
                        </div>
                        <div className="text-right font-mono font-black text-sm">
                          {rm.myScore} - {rm.oppScore}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
