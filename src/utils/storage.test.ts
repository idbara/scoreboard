import { describe, it, expect, beforeEach } from 'vitest';
import { computePlayerStats, formatDuration, getMatches, saveMatch, clearAllMatches } from './storage';
import type { MatchRecord } from '../types/badminton';

describe('Storage & Analytics Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('formatDuration', () => {
    it('mengonversi detik ke format menit:detik dengan padding nol', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(9)).toBe('0:09');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(1445)).toBe('24:05');
    });
  });

  describe('computePlayerStats & Prototype Pollution Immunity', () => {
    it('menghitung statistik kemenangan, kekalahan, dan winRate secara akurat', () => {
      const mockMatches: MatchRecord[] = [
        {
          id: 'm1',
          createdAt: new Date().toISOString(),
          matchType: 'ganda',
          gameMode: 'pindah_bola',
          targetScore: 30,
          teamA: ['Budi', 'Andi'],
          teamB: ['Candra', 'Dedi'],
          scoreA: 30,
          scoreB: 24,
          winner: 'A',
          winnerNames: ['Budi', 'Andi'],
          loserNames: ['Candra', 'Dedi'],
          durationSeconds: 900,
          durationFormatted: '15:00',
          stats: {
            totalRallies: 54,
            servicePointsA: 18,
            servicePointsB: 12,
            receiverPointsA: 0,
            receiverPointsB: 0,
            currentStreakTeam: 'A',
            currentStreakCount: 3,
            maxStreakA: 6,
            maxStreakB: 4,
            pindahBolaCount: 12,
          },
        },
      ];

      const stats = computePlayerStats(mockMatches);
      const budi = stats.find((p) => p.name === 'Budi');
      expect(budi).toBeDefined();
      expect(budi?.totalMatches).toBe(1);
      expect(budi?.wins).toBe(1);
      expect(budi?.winRate).toBe(100);
      expect(budi?.pointsScored).toBe(30);
      expect(budi?.pointsConceded).toBe(24);
      expect(budi?.partnerList[0]?.name).toBe('Andi');
      expect(budi?.partnerList[0]?.wins).toBe(1);
      expect(budi?.opponentList.length).toBe(2);
    });

    it('kebal terhadap serangan prototype collision (constructor, toString, __proto__, valueOf)', () => {
      const mockMatches: MatchRecord[] = [
        {
          id: 'sec1',
          createdAt: new Date().toISOString(),
          matchType: 'ganda',
          gameMode: 'pindah_bola',
          targetScore: 30,
          teamA: ['constructor', 'toString'],
          teamB: ['__proto__', 'valueOf'],
          scoreA: 30,
          scoreB: 15,
          winner: 'A',
          winnerNames: ['constructor', 'toString'],
          loserNames: ['__proto__', 'valueOf'],
          durationSeconds: 600,
          durationFormatted: '10:00',
          stats: {
            totalRallies: 45,
            servicePointsA: 15,
            servicePointsB: 10,
            receiverPointsA: 0,
            receiverPointsB: 0,
            currentStreakTeam: 'A',
            currentStreakCount: 4,
            maxStreakA: 5,
            maxStreakB: 3,
            pindahBolaCount: 8,
          },
        },
      ];

      // Memastikan computePlayerStats tidak melempar TypeError dan tidak merusak Object prototype
      const stats = computePlayerStats(mockMatches);
      expect(stats.length).toBe(4);

      const protoPlayer = stats.find((p) => p.name === '__proto__');
      expect(protoPlayer).toBeDefined();
      expect(protoPlayer?.totalMatches).toBe(1);
      expect(protoPlayer?.losses).toBe(1);

      const constructorPlayer = stats.find((p) => p.name === 'constructor');
      expect(constructorPlayer).toBeDefined();
      expect(constructorPlayer?.totalMatches).toBe(1);
      expect(constructorPlayer?.wins).toBe(1);

      // Memastikan prototype dasar JavaScript tidak tercemar
      expect(({} as Record<string, unknown>).totalMatches).toBeUndefined();
    });
  });

  describe('Defensive LocalStorage Sanitization', () => {
    it('mengabaikan data korup atau injeksi berbahaya di localStorage', () => {
      localStorage.setItem(
        'badminton_match_history_v1',
        JSON.stringify([
          null,
          'string_bukan_objek',
          { id: 123 }, // id bukan string
          { id: 'valid_1', teamA: ['A'], teamB: ['B'], scoreA: 30, scoreB: 20, winner: 'A' },
        ])
      );

      const matches = getMatches();
      expect(matches.length).toBe(1);
      expect(matches[0]?.id).toBe('valid_1');
    });

    it('dapat menyimpan dan menghapus pertandingan dengan benar', () => {
      const saved = saveMatch({
        teamA: ['Pemain 1'],
        teamB: ['Pemain 2'],
        scoreA: 21,
        scoreB: 19,
        winner: 'A',
      });

      expect(saved.id).toBeDefined();
      expect(getMatches().length).toBe(1);

      clearAllMatches();
      expect(getMatches().length).toBe(0);
    });
  });
});
