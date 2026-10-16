import { describe, it, expect } from 'vitest';
import { createInitialState, processRally, getServerInfo } from './gameLogic';

describe('Badminton Game Logic Engine', () => {
  describe('Sistem 30 Pindah Bola - Ganda (Doubles)', () => {
    it('menginisialisasi permainan ganda dengan benar', () => {
      const state = createInitialState('Budi', 'Andi', 'Candra', 'Dedi', 'A', 'pindah_bola', 30, 'ganda');

      expect(state.scoreA).toBe(0);
      expect(state.scoreB).toBe(0);
      expect(state.servingTeam).toBe('A');
      expect(state.ball).toBe(1);
      expect(state.serverIndex).toBe(0); // Budi di posisi kanan
      expect(state.matchType).toBe('ganda');
      expect(state.gameOver).toBe(false);
      expect(state.isFirstServe).toBe(true);
    });

    it('server menang reli: skor bertambah, pemain bertukar posisi, server yang sama tetap servis', () => {
      const state = createInitialState('Budi', 'Andi', 'Candra', 'Dedi', 'A', 'pindah_bola', 30, 'ganda');

      const { state: newState } = processRally(state, 'A');
      expect(newState.scoreA).toBe(1);
      expect(newState.scoreB).toBe(0);
      expect(newState.servingTeam).toBe('A');
      expect(newState.ball).toBe(1);
      // Pemain Tim A bertukar posisi: Budi pindah ke posisi kiri (index 1), Andi ke kanan (index 0)
      expect(newState.serverIndex).toBe(1);
      expect(newState.teamA[1]).toBe('Budi');
      expect(newState.teamA[0]).toBe('Andi');
      expect(newState.isFirstServe).toBe(false);
    });

    it('pada reli pembuka (isFirstServe true), jika server kalah langsung pindah bola ke lawan', () => {
      const state = createInitialState('Budi', 'Andi', 'Candra', 'Dedi', 'A', 'pindah_bola', 30, 'ganda');
      expect(state.isFirstServe).toBe(true);

      const { state: newState } = processRally(state, 'B'); // B menang saat reli pertama
      expect(newState.scoreA).toBe(0);
      expect(newState.scoreB).toBe(0);
      expect(newState.servingTeam).toBe('B');
      expect(newState.ball).toBe(1);
      expect(newState.isFirstServe).toBe(false);
    });

    it('setelah reli berjalan (isFirstServe false), server kalah pada Bola 1 berganti ke Bola 2', () => {
      const state = createInitialState('Budi', 'Andi', 'Candra', 'Dedi', 'A', 'pindah_bola', 30, 'ganda');

      // Reli 1: Tim A cetak skor (isFirstServe menjadi false)
      const afterScore = processRally(state, 'A').state;
      expect(afterScore.scoreA).toBe(1);
      expect(afterScore.ball).toBe(1);
      expect(afterScore.isFirstServe).toBe(false);

      // Reli 2: Tim B menang -> berganti ke Bola 2 (skor tetap 1-0)
      const afterBola2 = processRally(afterScore, 'B').state;
      expect(afterBola2.scoreA).toBe(1);
      expect(afterBola2.scoreB).toBe(0);
      expect(afterBola2.servingTeam).toBe('A');
      expect(afterBola2.ball).toBe(2);

      // Reli 3: Tim B menang lagi -> Pindah Bola ke Tim B (Bola 1)
      const afterPindah = processRally(afterBola2, 'B').state;
      expect(afterPindah.servingTeam).toBe('B');
      expect(afterPindah.ball).toBe(1);
    });

    it('game over saat target skor 30 tercapai', () => {
      let state = createInitialState('Budi', 'Andi', 'Candra', 'Dedi', 'A', 'pindah_bola', 30, 'ganda');
      state = { ...state, scoreA: 29 };

      const { state: newState } = processRally(state, 'A');
      expect(newState.scoreA).toBe(30);
      expect(newState.gameOver).toBe(true);
      const winner = newState.scoreA > newState.scoreB ? 'A' : 'B';
      expect(winner).toBe('A');
    });

    it('pindah bola saat skor ganjil SELALU servis pertama dari kotak kanan (serverIndex = 0)', () => {
      // Setup state di mana Tim B memiliki skor ganjil (skor 1)
      let state = createInitialState('Budi', 'Andi', 'Candra', 'Dedi', 'A', 'pindah_bola', 30, 'ganda');

      // 1. Tim A cetak skor 1
      state = processRally(state, 'A').state;
      expect(state.scoreA).toBe(1);

      // 2. Tim A kalah pada Bola 1 -> berganti ke Bola 2
      state = processRally(state, 'B').state;
      expect(state.ball).toBe(2);

      // 3. Tim A kalah pada Bola 2 -> Pindah Bola ke Tim B (skor B = 0)
      state = processRally(state, 'B').state;
      expect(state.servingTeam).toBe('B');
      expect(state.ball).toBe(1);
      expect(state.serverIndex).toBe(0); // Servis pertama Tim B dari kanan

      // 4. Tim B cetak skor 1 (skor B menjadi ganjil)
      state = processRally(state, 'B').state;
      expect(state.scoreB).toBe(1);
      expect(state.serverIndex).toBe(1); // Setelah dapat poin, geser ke kiri

      // 5. Tim B kalah pada Bola 1 -> Bola 2
      state = processRally(state, 'A').state;
      expect(state.ball).toBe(2);

      // 6. Tim B kalah pada Bola 2 -> Pindah Bola ke Tim A (skor A = 1, GANJIL)
      state = processRally(state, 'A').state;
      expect(state.servingTeam).toBe('A');
      expect(state.scoreA).toBe(1); // Skor ganjil
      expect(state.ball).toBe(1);
      // BUG FIX VERIFICATION:
      // Meskipun skor A ganjil (1), servis pertama (Bola 1) HARUS selalu dari kanan (0), BUKAN dari kiri (1)!
      expect(state.serverIndex).toBe(0);

      // 7. Ketika Tim A dapat poin baru -> geser ke kiri (1) dan tukar posisi
      const afterPoint = processRally(state, 'A').state;
      expect(afterPoint.scoreA).toBe(2);
      expect(afterPoint.serverIndex).toBe(1); // Geser ke kiri
    });
  });

  describe('Sistem Rally Point (Modern BWF)', () => {
    it('setiap pemenang reli selalu mendapatkan 1 poin', () => {
      const state = createInitialState('Kevin', 'Marcus', 'Ahsan', 'Hendra', 'A', 'rally_point', 21, 'ganda');

      // Tim B menang reli -> Tim B langsung dapat skor 1 dan servis pindah ke Tim B
      const { state: newState } = processRally(state, 'B');
      expect(newState.scoreA).toBe(0);
      expect(newState.scoreB).toBe(1);
      expect(newState.servingTeam).toBe('B');
      // Skor 1 ganjil -> server berada di kotak kiri (index 1)
      expect(newState.serverIndex).toBe(1);
    });
  });

  describe('Kategori Tunggal (Singles)', () => {
    it('posisi server tunggal berganti sesuai skor genap (kanan) dan ganjil (kiri)', () => {
      const state = createInitialState('Ginting', '', 'Jonatan', '', 'A', 'rally_point', 21, 'tunggal');

      // Skor 0 (genap) -> Server di kotak kanan (0)
      expect(state.serverIndex).toBe(0);
      const info0 = getServerInfo(state);
      expect(info0.playerName).toBe('Ginting');
      expect(info0.position).toBe('right');

      // A menang reli -> Skor A jadi 1 (ganjil)
      const { state: newState } = processRally(state, 'A');
      expect(newState.scoreA).toBe(1);
      expect(newState.serverIndex).toBe(1); // Kotak kiri
      const info1 = getServerInfo(newState);
      expect(info1.position).toBe('left');
    });
  });
});
