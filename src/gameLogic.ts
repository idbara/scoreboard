/**
 * Papan Skor Badminton — Engine Logika Pertandingan
 * Mendukung:
 * 1. Kategori: Ganda (2 vs 2) atau Tunggal (1 vs 1)
 * 2. Sistem Skor: 30 Pindah Bola (Klasik / Tarkam) atau Rally Point (Modern / BWF)
 */

import type {
  GameState,
  GameMode,
  MatchType,
  TeamId,
  ServerIndex,
  BallNumber,
  RallyResult,
} from './types/badminton';

/**
 * Inisialisasi state awal pertandingan.
 */
export function createInitialState(
  a1: string,
  a2: string,
  b1: string,
  b2: string,
  firstServe: TeamId = 'A',
  gameMode: GameMode = 'pindah_bola',
  targetScore: number = 30,
  matchType: MatchType = 'ganda'
): GameState {
  const isRally = gameMode === 'rally_point';
  const resolvedTarget = isRally ? (targetScore === 21 ? 21 : 30) : 30;
  const intervalScore = resolvedTarget === 21 ? 11 : 15;
  const isTunggal = matchType === 'tunggal';

  return {
    matchType,
    gameMode,
    targetScore: resolvedTarget,
    intervalScore,
    teamA: isTunggal ? [a1] : [a1, a2],
    teamB: isTunggal ? [b1] : [b1, b2],
    scoreA: 0,
    scoreB: 0,
    servingTeam: firstServe,
    ball: 1 as BallNumber, // Bola 1 or Bola 2 (hanya dipakai di sistem pindah bola ganda)
    serverIndex: 0 as ServerIndex, // 0 = right/kanan, 1 = left/kiri
    isFirstServe: true,
    sidesSwapped: false,
    gameOver: false,
    intervalShown: false,
    stats: {
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
}

/**
 * Pemrosesan reli pertandingan dan menghasilkan state baru + events animasi.
 */
export function processRally(prev: GameState, winningTeam: TeamId): RallyResult {
  if (prev.gameOver) return { state: prev, events: [] };

  // Deep clone
  const state: GameState = JSON.parse(JSON.stringify(prev));
  const events: string[] = [];

  state.stats.totalRallies++;

  if (state.matchType === 'tunggal') {
    processTunggalRally(state, winningTeam, events);
  } else if (state.gameMode === 'rally_point') {
    processGandaRallyPoint(state, winningTeam, events);
  } else {
    processGandaPindahBola(state, winningTeam, events);
  }

  // Update streak metrics
  updateStreak(state, winningTeam);

  // Check win condition
  checkWinCondition(state, events);

  return { state, events };
}

/**
 * Logika reli Tunggal (Singles)
 */
function processTunggalRally(state: GameState, winningTeam: TeamId, events: string[]): void {
  const { servingTeam, gameMode } = state;

  if (gameMode === 'rally_point') {
    // === Rally Point Tunggal ===
    if (winningTeam === 'A') {
      state.scoreA++;
    } else {
      state.scoreB++;
    }
    events.push('scored');

    if (winningTeam === servingTeam) {
      if (winningTeam === 'A') state.stats.servicePointsA++;
      else state.stats.servicePointsB++;

      const score = winningTeam === 'A' ? state.scoreA : state.scoreB;
      state.serverIndex = (score % 2 === 0 ? 0 : 1) as ServerIndex;
      events.push(`swap-${servingTeam}`);
    } else {
      if (winningTeam === 'A') state.stats.receiverPointsA++;
      else state.stats.receiverPointsB++;
      state.stats.pindahBolaCount++;

      state.servingTeam = winningTeam;
      const score = winningTeam === 'A' ? state.scoreA : state.scoreB;
      state.serverIndex = (score % 2 === 0 ? 0 : 1) as ServerIndex;
      events.push('pindah-bola');
    }
  } else {
    // === 30 Pindah Bola Tunggal ===
    if (winningTeam === servingTeam) {
      if (servingTeam === 'A') {
        state.scoreA++;
        state.stats.servicePointsA++;
      } else {
        state.scoreB++;
        state.stats.servicePointsB++;
      }
      events.push('scored');

      const score = servingTeam === 'A' ? state.scoreA : state.scoreB;
      state.serverIndex = (score % 2 === 0 ? 0 : 1) as ServerIndex;
      events.push(`swap-${servingTeam}`);
    } else {
      state.stats.pindahBolaCount++;
      state.servingTeam = winningTeam;
      state.isFirstServe = false;
      state.ball = 1;

      const score = winningTeam === 'A' ? state.scoreA : state.scoreB;
      state.serverIndex = (score % 2 === 0 ? 0 : 1) as ServerIndex;
      events.push('pindah-bola');
    }
  }

  // Check interval
  if (!state.intervalShown && (state.scoreA === state.intervalScore || state.scoreB === state.intervalScore)) {
    state.intervalShown = true;
    events.push('interval');
  }
}

/**
 * Logika reli Ganda Sistem 30 Pindah Bola
 */
function processGandaPindahBola(state: GameState, winningTeam: TeamId, events: string[]): void {
  const { servingTeam, ball, isFirstServe } = state;

  if (winningTeam === servingTeam) {
    if (servingTeam === 'A') {
      state.scoreA++;
      state.stats.servicePointsA++;
    } else {
      state.scoreB++;
      state.stats.servicePointsB++;
    }

    swapTeamPositions(state, servingTeam);
    state.isFirstServe = false;
    state.serverIndex = (state.serverIndex === 0 ? 1 : 0) as ServerIndex;

    events.push('scored');
    events.push(`swap-${servingTeam}`);

    if (!state.intervalShown && (state.scoreA === state.intervalScore || state.scoreB === state.intervalScore)) {
      state.intervalShown = true;
      events.push('interval');
    }
  } else {
    state.stats.pindahBolaCount++;

    if (isFirstServe) {
      state.ball = 1;
      state.servingTeam = winningTeam;
      state.isFirstServe = false;
      state.serverIndex = 0 as ServerIndex; // Servis pertama selalu dari kotak kanan
      events.push('pindah-bola');
    } else if (ball === 1) {
      state.ball = 2;
      state.serverIndex = (state.serverIndex === 0 ? 1 : 0) as ServerIndex;
      events.push('bola-2');
    } else {
      state.ball = 1;
      state.servingTeam = winningTeam;
      state.isFirstServe = false;
      state.serverIndex = 0 as ServerIndex; // Servis pertama selalu dari kotak kanan
      events.push('pindah-bola');
    }
  }
}

/**
 * Logika reli Ganda Sistem Rally Point (BWF)
 */
function processGandaRallyPoint(state: GameState, winningTeam: TeamId, events: string[]): void {
  const { servingTeam } = state;

  if (winningTeam === 'A') {
    state.scoreA++;
  } else {
    state.scoreB++;
  }
  events.push('scored');

  if (winningTeam === servingTeam) {
    if (winningTeam === 'A') {
      state.stats.servicePointsA++;
    } else {
      state.stats.servicePointsB++;
    }

    swapTeamPositions(state, servingTeam);
    state.serverIndex = (state.serverIndex === 0 ? 1 : 0) as ServerIndex;
    events.push(`swap-${servingTeam}`);
  } else {
    if (winningTeam === 'A') {
      state.stats.receiverPointsA++;
    } else {
      state.stats.receiverPointsB++;
    }
    state.stats.pindahBolaCount++;

    state.servingTeam = winningTeam;
    const newScore = winningTeam === 'A' ? state.scoreA : state.scoreB;
    state.serverIndex = (newScore % 2 === 0 ? 0 : 1) as ServerIndex;
    events.push('pindah-bola');
  }

  if (!state.intervalShown && (state.scoreA === state.intervalScore || state.scoreB === state.intervalScore)) {
    state.intervalShown = true;
    events.push('interval');
  }
}

function updateStreak(state: GameState, winningTeam: TeamId): void {
  const isPointScored =
    state.gameMode === 'rally_point' || winningTeam === state.servingTeam;

  if (isPointScored) {
    if (state.stats.currentStreakTeam === winningTeam) {
      state.stats.currentStreakCount++;
    } else {
      state.stats.currentStreakTeam = winningTeam;
      state.stats.currentStreakCount = 1;
    }

    if (winningTeam === 'A') {
      state.stats.maxStreakA = Math.max(state.stats.maxStreakA, state.stats.currentStreakCount);
    } else {
      state.stats.maxStreakB = Math.max(state.stats.maxStreakB, state.stats.currentStreakCount);
    }
  } else {
    state.stats.currentStreakTeam = null;
    state.stats.currentStreakCount = 0;
  }
}

function checkWinCondition(state: GameState, events: string[]): void {
  const { scoreA, scoreB, targetScore, gameMode } = state;

  if (gameMode === 'rally_point' && targetScore === 21) {
    if (scoreA >= 21 && scoreA - scoreB >= 2) {
      state.gameOver = true;
      events.push('win');
    } else if (scoreB >= 21 && scoreB - scoreA >= 2) {
      state.gameOver = true;
      events.push('win');
    } else if (scoreA === 30 || scoreB === 30) {
      state.gameOver = true;
      events.push('win');
    }
  } else {
    if (scoreA >= targetScore || scoreB >= targetScore) {
      state.gameOver = true;
      events.push('win');
    }
  }
}

export function swapTeamPositions(state: GameState, team: TeamId): void {
  if (team === 'A') {
    const p0 = state.teamA[0];
    const p1 = state.teamA[1];
    if (p0 !== undefined && p1 !== undefined) {
      state.teamA[0] = p1;
      state.teamA[1] = p0;
    }
  } else {
    const p0 = state.teamB[0];
    const p1 = state.teamB[1];
    if (p0 !== undefined && p1 !== undefined) {
      state.teamB[0] = p1;
      state.teamB[1] = p0;
    }
  }
}

export function getServerInfo(state: GameState): {
  team: TeamId;
  playerName: string;
  position: 'right' | 'left';
} {
  const team = state.servingTeam;
  const players = team === 'A' ? state.teamA : state.teamB;
  const playerName = players[state.serverIndex] ?? players[0] ?? '';
  return {
    team,
    playerName,
    position: state.serverIndex === 0 ? 'right' : 'left',
  };
}
