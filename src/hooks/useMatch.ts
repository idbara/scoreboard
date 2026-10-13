import { useState, useCallback, useEffect, useRef } from 'react';
import { createInitialState, processRally } from '../gameLogic';
import { saveMatch, formatDuration } from '../utils/storage';
import type { GameState, GameMode, MatchType, TeamId, MatchRecord } from '../types/badminton';

/**
 * Custom hook that manages the entire match state,
 * undo history, live duration timer, and auto-saving completed matches.
 */
export function useMatch() {
  const [state, setState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [savedMatchRecord, setSavedMatchRecord] = useState<MatchRecord | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasSavedRef = useRef<boolean>(false);
  const elapsedRef = useRef<number>(0);

  // Keep elapsedRef in sync
  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  const isGameActive = Boolean(state && !state.gameOver);

  // Live timer effect
  useEffect(() => {
    if (isGameActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive]);

  const saveCurrentMatch = useCallback((currentState: GameState, durationSec: number): void => {
    if (!currentState || hasSavedRef.current) return;
    hasSavedRef.current = true;

    const winner: TeamId = currentState.scoreA > currentState.scoreB ? 'A' : 'B';
    const winnerNames = winner === 'A' ? currentState.teamA : currentState.teamB;
    const loserNames = winner === 'A' ? currentState.teamB : currentState.teamA;

    const record: Omit<MatchRecord, 'id' | 'createdAt'> = {
      matchType: currentState.matchType || (currentState.teamA.length === 1 ? 'tunggal' : 'ganda'),
      gameMode: currentState.gameMode,
      targetScore: currentState.targetScore,
      teamA: currentState.teamA,
      teamB: currentState.teamB,
      scoreA: currentState.scoreA,
      scoreB: currentState.scoreB,
      winner,
      winnerNames,
      loserNames,
      durationSeconds: durationSec,
      durationFormatted: formatDuration(durationSec),
      stats: currentState.stats,
    };

    const saved = saveMatch(record);
    setSavedMatchRecord(saved);
  }, []);

  const startMatch = useCallback(
    (
      a1: string,
      a2: string,
      b1: string,
      b2: string,
      firstServe: TeamId = 'A',
      gameMode: GameMode = 'pindah_bola',
      targetScore: number = 30,
      matchType: MatchType = 'ganda'
    ): void => {
      setState(createInitialState(a1, a2, b1, b2, firstServe, gameMode, targetScore, matchType));
      setHistory([]);
      setEvents([]);
      setElapsedSeconds(0);
      elapsedRef.current = 0;
      setSavedMatchRecord(null);
      hasSavedRef.current = false;
    },
    []
  );

  const rally = useCallback(
    (winningTeam: TeamId): void => {
      setState((prev) => {
        if (!prev || prev.gameOver) return prev;

        // Push clone to undo history
        setHistory((h) => [...h, JSON.parse(JSON.stringify(prev)) as GameState]);

        const result = processRally(prev, winningTeam);
        setEvents(result.events);

        // Synchronous match saving when match ends
        if (result.state.gameOver) {
          saveCurrentMatch(result.state, elapsedRef.current);
        }

        return result.state;
      });
    },
    [saveCurrentMatch]
  );

  const undo = useCallback((): void => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const newHistory = [...h];
      const prevState = newHistory.pop();
      if (!prevState) return h;
      setState(prevState);
      setEvents([]);
      if (!prevState.gameOver) {
        hasSavedRef.current = false;
        setSavedMatchRecord(null);
      }
      return newHistory;
    });
  }, []);

  const resetMatch = useCallback((): void => {
    if (!state) return;
    const origin = history.length > 0 ? history[0] : state;
    if (!origin) return;
    setState(
      createInitialState(
        origin.teamA[0] ?? '',
        origin.teamA[1] ?? '',
        origin.teamB[0] ?? '',
        origin.teamB[1] ?? '',
        origin.servingTeam,
        origin.gameMode,
        origin.targetScore,
        origin.matchType || 'ganda'
      )
    );
    setHistory([]);
    setEvents([]);
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    setSavedMatchRecord(null);
    hasSavedRef.current = false;
  }, [state, history]);

  const endMatch = useCallback((): void => {
    setState(null);
    setHistory([]);
    setEvents([]);
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    setSavedMatchRecord(null);
    hasSavedRef.current = false;
  }, []);

  const swapSides = useCallback((): void => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, sidesSwapped: !prev.sidesSwapped };
    });
  }, []);

  const clearEvents = useCallback((): void => setEvents([]), []);

  return {
    state,
    history,
    events,
    elapsedSeconds,
    formattedDuration: formatDuration(elapsedSeconds),
    savedMatchRecord,
    startMatch,
    rally,
    undo,
    resetMatch,
    endMatch,
    swapSides,
    clearEvents,
  };
}
