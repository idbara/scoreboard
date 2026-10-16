import { useState, useEffect, useCallback } from 'react';
import CourtHeader from './CourtHeader';
import Scoreboard from './Scoreboard';
import CourtField from './CourtField';
import ActionButtons from './ActionButtons';
import IntervalOverlay from './IntervalOverlay';
import WinnerOverlay from './WinnerOverlay';
import MenuOverlay from './MenuOverlay';
import type { GameState, TeamId } from '../types/badminton';

interface CourtViewProps {
  state: GameState;
  history: GameState[];
  events: string[];
  formattedDuration: string;
  onRally: (team: TeamId) => void;
  onUndo: () => void;
  onReset: () => void;
  onEndMatch: () => void;
  onSwapSides: () => void;
  onSwapTeamPlayers?: (team: TeamId) => void;
  onClearEvents: () => void;
  onOpenHistory: () => void;
}

export default function CourtView({
  state,
  history,
  events,
  formattedDuration,
  onRally,
  onUndo,
  onReset,
  onEndMatch,
  onSwapSides,
  onSwapTeamPlayers,
  onClearEvents,
  onOpenHistory,
}: CourtViewProps) {
  const [showInterval, setShowInterval] = useState<boolean>(false);
  const [showWinner, setShowWinner] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [swapAnimTeam, setSwapAnimTeam] = useState<TeamId | null>(null);
  const [scorePop, setScorePop] = useState<TeamId | null>(null);
  const [courtFlip, setCourtFlip] = useState<boolean>(false);

  // React to game events
  useEffect(() => {
    if (!events || events.length === 0) return;

    if (events.includes('scored')) {
      const team = events.find((e) => e.startsWith('swap-'))?.replace('swap-', '') as TeamId | undefined;
      if (team) {
        setTimeout(() => {
          setSwapAnimTeam(team);
          setScorePop(team);
        }, 0);
        setTimeout(() => {
          setSwapAnimTeam(null);
          setScorePop(null);
        }, 550);
      }
    }

    if (events.includes('interval')) {
      setTimeout(() => setShowInterval(true), 600);
    }

    if (events.includes('win')) {
      setTimeout(() => setShowWinner(true), 600);
    }

    onClearEvents();
  }, [events, onClearEvents]);

  const handleIntervalContinue = useCallback((swapSides: boolean) => {
    setShowInterval(false);
    if (swapSides) {
      onSwapSides();
      setCourtFlip(true);
      setTimeout(() => setCourtFlip(false), 800);
    }
  }, [onSwapSides]);

  const handleNewMatch = useCallback(() => {
    setShowWinner(false);
    onEndMatch();
  }, [onEndMatch]);

  const handleMenuReset = useCallback(() => {
    setShowMenu(false);
    onReset();
  }, [onReset]);

  const handleMenuNew = useCallback(() => {
    setShowMenu(false);
    onEndMatch();
  }, [onEndMatch]);

  const handleMenuHistory = useCallback(() => {
    setShowMenu(false);
    onOpenHistory();
  }, [onOpenHistory]);

  return (
    <div className="fixed inset-0 flex flex-col bg-dark-bg">
      <CourtHeader
        state={state}
        formattedDuration={formattedDuration}
        canUndo={history.length > 0}
        onUndo={onUndo}
        onMenuOpen={() => setShowMenu(true)}
      />
      <Scoreboard state={state} scorePop={scorePop} />
      <CourtField
        state={state}
        swapAnimTeam={swapAnimTeam}
        courtFlip={courtFlip}
        onRally={onRally}
      />
      <ActionButtons
        state={state}
        onRally={onRally}
      />

      {/* Overlays */}
      <IntervalOverlay
        show={showInterval}
        scoreA={state.scoreA}
        scoreB={state.scoreB}
        intervalScore={state.intervalScore}
        onContinue={handleIntervalContinue}
      />
      <WinnerOverlay
        show={showWinner}
        state={state}
        formattedDuration={formattedDuration}
        onNewMatch={handleNewMatch}
        onOpenHistory={() => {
          setShowWinner(false);
          onOpenHistory();
        }}
      />
      <MenuOverlay
        show={showMenu}
        matchType={state.matchType}
        onClose={() => setShowMenu(false)}
        onReset={handleMenuReset}
        onNewMatch={handleMenuNew}
        onOpenHistory={handleMenuHistory}
        onSwapSides={onSwapSides}
        onSwapTeamPlayers={onSwapTeamPlayers}
      />
    </div>
  );
}
