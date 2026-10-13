import { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import CourtView from './components/CourtView';
import HistoryStatsModal from './components/HistoryStatsModal';
import { useMatch } from './hooks/useMatch';

export default function App() {
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const {
    state,
    history,
    events,
    formattedDuration,
    startMatch,
    rally,
    undo,
    resetMatch,
    endMatch,
    swapSides,
    clearEvents,
  } = useMatch();

  return (
    <>
      {/* Main Screen: Setup or Court */}
      {!state ? (
        <SetupScreen
          onStart={startMatch}
          onOpenHistory={() => setShowHistory(true)}
        />
      ) : (
        <CourtView
          state={state}
          history={history}
          events={events}
          formattedDuration={formattedDuration}
          onRally={rally}
          onUndo={undo}
          onReset={resetMatch}
          onEndMatch={endMatch}
          onSwapSides={swapSides}
          onClearEvents={clearEvents}
          onOpenHistory={() => setShowHistory(true)}
        />
      )}

      {/* History & Statistics Modal */}
      <HistoryStatsModal
        show={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
}
