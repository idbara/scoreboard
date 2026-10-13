/**
 * Definisi Type & Interface untuk Papan Skor Badminton
 */

export type GameMode = 'pindah_bola' | 'rally_point';
export type MatchType = 'ganda' | 'tunggal';
export type TeamId = 'A' | 'B';
export type ServerIndex = 0 | 1;
export type BallNumber = 1 | 2;

export interface MatchStats {
  totalRallies: number;
  servicePointsA: number;
  servicePointsB: number;
  receiverPointsA: number;
  receiverPointsB: number;
  currentStreakTeam: TeamId | null;
  currentStreakCount: number;
  maxStreakA: number;
  maxStreakB: number;
  pindahBolaCount: number;
}

export interface GameState {
  matchType: MatchType;
  gameMode: GameMode;
  targetScore: number;
  intervalScore: number;
  teamA: string[];
  teamB: string[];
  scoreA: number;
  scoreB: number;
  servingTeam: TeamId;
  ball: BallNumber;
  serverIndex: ServerIndex;
  isFirstServe: boolean;
  sidesSwapped: boolean;
  gameOver: boolean;
  intervalShown: boolean;
  stats: MatchStats;
}

export interface RallyResult {
  state: GameState;
  events: string[];
}

export interface MatchRecord {
  id: string;
  createdAt: string;
  matchType: MatchType;
  gameMode: GameMode;
  targetScore: number;
  teamA: string[];
  teamB: string[];
  scoreA: number;
  scoreB: number;
  winner: TeamId;
  winnerNames: string[];
  loserNames: string[];
  durationSeconds: number;
  durationFormatted: string;
  stats: MatchStats;
}

export interface PlayerMatch {
  id: string;
  createdAt: string;
  matchType: MatchType;
  partner: string | null;
  opponents: string[];
  isWinner: boolean;
  myScore: number;
  oppScore: number;
  gameMode: GameMode;
  durationSeconds: number;
}

export interface PartnerStats {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface OpponentStats {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface PlayerStats {
  name: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  pointsScored: number;
  pointsConceded: number;
  partnerList: PartnerStats[];
  opponentList: OpponentStats[];
  recentMatches: PlayerMatch[];
}
