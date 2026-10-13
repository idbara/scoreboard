/**
 * Utility untuk penyimpanan data pertandingan (Local Storage)
 * dan kalkulasi statistik pemain, pasangan, serta lawan.
 * Mendukung kategori Ganda (2 vs 2) dan Tunggal (1 vs 1).
 */

import type { MatchRecord, PlayerStats, PartnerStats, OpponentStats } from '../types/badminton';

const STORAGE_KEY = 'badminton_match_history_v1';

/**
 * Ambil semua riwayat pertandingan dari localStorage dengan validasi skema defensif
 */
export function getMatches(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    // Validasi skema defensif agar data rusak di localStorage tidak menyebabkan runtime crash
    return list.filter((item): item is MatchRecord => {
      if (!item || typeof item !== 'object') return false;
      const r = item as Record<string, unknown>;
      return (
        typeof r.id === 'string' &&
        Array.isArray(r.teamA) &&
        Array.isArray(r.teamB) &&
        typeof r.scoreA === 'number' &&
        typeof r.scoreB === 'number' &&
        (r.winner === 'A' || r.winner === 'B')
      );
    });
  } catch (err) {
    console.error('Gagal membaca data pertandingan:', err);
    return [];
  }
}

/**
 * Simpan pertandingan baru ke localStorage
 */
export function saveMatch(matchData: Partial<MatchRecord> & Pick<MatchRecord, 'teamA' | 'teamB' | 'scoreA' | 'scoreB' | 'winner'>): MatchRecord {
  try {
    const matches = getMatches();
    const newRecord: MatchRecord = {
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      matchType: matchData.matchType || (matchData.teamA.length === 1 ? 'tunggal' : 'ganda'),
      gameMode: matchData.gameMode || 'pindah_bola',
      targetScore: matchData.targetScore || 30,
      teamA: matchData.teamA,
      teamB: matchData.teamB,
      scoreA: matchData.scoreA,
      scoreB: matchData.scoreB,
      winner: matchData.winner,
      winnerNames: matchData.winnerNames || [],
      loserNames: matchData.loserNames || [],
      durationSeconds: matchData.durationSeconds || 0,
      durationFormatted: matchData.durationFormatted || '0:00',
      stats: matchData.stats || {
        totalRallies: 0,
        servicePointsA: 0,
        servicePointsB: 0,
        receiverPointsA: 0,
        receiverPointsB: 0,
        currentStreakTeam: null,
        currentStreakCount: 0,
        maxStreakA: 0,
        maxStreakB: 0,
        pindahBolaCount: 0,
      },
    };
    matches.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
    return newRecord;
  } catch (err) {
    console.error('Gagal menyimpan pertandingan:', err);
    return matchData as MatchRecord;
  }
}

/**
 * Hapus 1 pertandingan berdasarkan ID
 */
export function deleteMatch(id: string): MatchRecord[] {
  try {
    const matches = getMatches().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
    return matches;
  } catch (err) {
    console.error('Gagal menghapus pertandingan:', err);
    return [];
  }
}

/**
 * Hapus seluruh riwayat pertandingan
 */
export function clearAllMatches(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Gagal mengosongkan riwayat:', err);
    return false;
  }
}

/**
 * Format detik ke format menit:detik (contoh: 24:15)
 */
export function formatDuration(seconds: number = 0): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

interface MutablePlayerStats extends Omit<PlayerStats, 'partnerList' | 'opponentList'> {
  partners: Map<string, PartnerStats>;
  opponents: Map<string, OpponentStats>;
}

/**
 * Hitung agregat statistik pemain dari list pertandingan.
 * Menggunakan Map murni untuk mencegah prototype collision & prototype pollution (__proto__, constructor, toString).
 */
export function computePlayerStats(matches: MatchRecord[] = []): PlayerStats[] {
  if (!Array.isArray(matches) || matches.length === 0) return [];

  const playerMap = new Map<string, MutablePlayerStats>();

  function initPlayer(name: string): MutablePlayerStats | null {
    const trimmed = name.trim();
    if (!trimmed) return null;

    let existing = playerMap.get(trimmed);
    if (!existing) {
      existing = {
        name: trimmed,
        totalMatches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        pointsScored: 0,
        pointsConceded: 0,
        partners: new Map<string, PartnerStats>(),
        opponents: new Map<string, OpponentStats>(),
        recentMatches: [],
      };
      playerMap.set(trimmed, existing);
    }
    return existing;
  }

  matches.forEach((m) => {
    if (!m) return;
    const {
      teamA = [],
      teamB = [],
      scoreA = 0,
      scoreB = 0,
      winner = 'A',
      createdAt,
      gameMode = 'pindah_bola',
      matchType = 'ganda',
      durationSeconds = 0,
      id,
    } = m;

    const isWinA = winner === 'A';
    const isWinB = winner === 'B';

    const playersA = (Array.isArray(teamA) ? teamA : [teamA]).map((p) => (p ? String(p).trim() : '')).filter(Boolean);
    const playersB = (Array.isArray(teamB) ? teamB : [teamB]).map((p) => (p ? String(p).trim() : '')).filter(Boolean);

    const isTunggal = matchType === 'tunggal' || (playersA.length <= 1 && playersB.length <= 1);

    function recordPlayer(
      player: string,
      partner: string | null,
      oppList: string[],
      isWinner: boolean,
      myScore: number,
      oppScore: number
    ): void {
      const stats = initPlayer(player);
      if (!stats) return;

      stats.totalMatches++;
      stats.pointsScored += Number(myScore) || 0;
      stats.pointsConceded += Number(oppScore) || 0;
      if (isWinner) {
        stats.wins++;
      } else {
        stats.losses++;
      }

      if (partner) {
        const partnerTrimmed = String(partner).trim();
        if (partnerTrimmed) {
          let pStats = stats.partners.get(partnerTrimmed);
          if (!pStats) {
            pStats = {
              name: partnerTrimmed,
              matches: 0,
              wins: 0,
              losses: 0,
              winRate: 0,
            };
            stats.partners.set(partnerTrimmed, pStats);
          }
          pStats.matches++;
          if (isWinner) pStats.wins++;
          else pStats.losses++;
        }
      }

      (oppList || []).forEach((opp) => {
        if (!opp) return;
        const oppTrimmed = String(opp).trim();
        if (!oppTrimmed) return;

        let oStats = stats.opponents.get(oppTrimmed);
        if (!oStats) {
          oStats = {
            name: oppTrimmed,
            matches: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
          };
          stats.opponents.set(oppTrimmed, oStats);
        }
        oStats.matches++;
        if (isWinner) oStats.wins++;
        else oStats.losses++;
      });

      stats.recentMatches.push({
        id,
        createdAt,
        matchType: isTunggal ? 'tunggal' : 'ganda',
        partner: partner || null,
        opponents: oppList,
        isWinner,
        myScore,
        oppScore,
        gameMode,
        durationSeconds,
      });
    }

    if (isTunggal) {
      const pA = playersA[0] || 'Tim A';
      const pB = playersB[0] || 'Tim B';
      recordPlayer(pA, null, [pB], isWinA, scoreA, scoreB);
      recordPlayer(pB, null, [pA], isWinB, scoreB, scoreA);
    } else {
      const pA1 = playersA[0];
      const pA2 = playersA[1];
      const pB1 = playersB[0];
      const pB2 = playersB[1];

      if (pA1) recordPlayer(pA1, pA2 || null, [pB1, pB2].filter((p): p is string => Boolean(p)), isWinA, scoreA, scoreB);
      if (pA2) recordPlayer(pA2, pA1 || null, [pB1, pB2].filter((p): p is string => Boolean(p)), isWinA, scoreA, scoreB);
      if (pB1) recordPlayer(pB1, pB2 || null, [pA1, pA2].filter((p): p is string => Boolean(p)), isWinB, scoreB, scoreA);
      if (pB2) recordPlayer(pB2, pB1 || null, [pA1, pA2].filter((p): p is string => Boolean(p)), isWinB, scoreB, scoreA);
    }
  });

  const players: PlayerStats[] = Array.from(playerMap.values()).map((player) => {
    const winRate = player.totalMatches > 0
      ? Math.round((player.wins / player.totalMatches) * 100)
      : 0;

    const partnerList: PartnerStats[] = Array.from(player.partners.values())
      .map((p) => ({
        ...p,
        winRate: p.matches > 0 ? Math.round((p.wins / p.matches) * 100) : 0,
      }))
      .sort((a, b) => b.matches - a.matches || b.winRate - a.winRate);

    const opponentList: OpponentStats[] = Array.from(player.opponents.values())
      .map((o) => ({
        ...o,
        winRate: o.matches > 0 ? Math.round((o.wins / o.matches) * 100) : 0,
      }))
      .sort((a, b) => b.matches - a.matches || b.winRate - a.winRate);

    return {
      name: player.name,
      totalMatches: player.totalMatches,
      wins: player.wins,
      losses: player.losses,
      winRate,
      pointsScored: player.pointsScored,
      pointsConceded: player.pointsConceded,
      partnerList,
      opponentList,
      recentMatches: player.recentMatches,
    };
  });

  return players.sort((a, b) => b.totalMatches - a.totalMatches || b.wins - a.wins);
}
