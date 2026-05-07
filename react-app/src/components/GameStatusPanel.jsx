
import AnalogTimerClock from "./AnalogTimerClock";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

function GameStatusPanel({
  targetCountry,
  timeLeft,
  streak,
  bestStreak,
  score,
  onStopGame,
  selectedLocation,
  onSubmitGuess,
  onClearSelection,
  feedback,
}) {
  const countryLabel =
    typeof targetCountry === "string" ? targetCountry : targetCountry?.name ?? "Unknown";

  const timerStateClass =
    timeLeft <= 10 ? "urgent" : timeLeft <= 20 ? "warning" : "normal";

  // Confetti state: show for 2s after correct answer
  const [showConfetti, setShowConfetti] = useState(false);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (feedback && feedback.correct) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(t);
    } else {
      setShowConfetti(false);
    }
  }, [feedback]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className={`game-status-card ${timerStateClass}`} style={{ position: "relative", overflow: "visible" }}>
      {showConfetti && (
        <Confetti
          numberOfPieces={180}
          recycle={false}
          style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1000 }}
        />
      )}
      <p className="game-status-label">Find this country before time runs out</p>
      <div className="game-status-row">
        <div>
          <p className="target-country-label">Target Country</p>
          <h3 className="target-country-name">{countryLabel}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="score-chip">
            <span className="timer-label">Score</span>
            <strong className="timer-value">{score}</strong>
          </div>
          {streak > 0 && (
            <div className="streak-chip">
              <span className="timer-label">Streak</span>
              <strong className="timer-value">{streak}</strong>
            </div>
          )}
          {bestStreak > 0 && (
            <div className="score-chip">
              <span className="timer-label">Best</span>
              <strong className="timer-value">{bestStreak}</strong>
            </div>
          )}
          <AnalogTimerClock
            timeLeft={timeLeft}
            totalTime={30}
            timerStateClass={timerStateClass}
          />
          <button
            type="button"
            className="btn-secondary btn-stop-game"
            style={{ marginLeft: 0 }}
            onClick={onStopGame}
          >
            Stop Game
          </button>
        </div>
      </div>

      <div className="game-status-actions-row">
        <button
          type="button"
          onClick={onSubmitGuess}
          disabled={!selectedLocation}
          className="btn-submit"
        >
          Submit Guess
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          className="btn-secondary"
        >
          Clear
        </button>
      </div>

      {feedback && (
        <div className={`inline-feedback ${feedback.correct ? "success" : "error"}`}>
          <h3 className="inline-feedback-heading">
            {feedback.correct ? "Correct!" : "Incorrect"}
          </h3>
          <p className="inline-feedback-message">{feedback.message}</p>
          {!feedback.correct && feedback.distanceKm != null && (
            <p className="inline-feedback-detail">Your guess was {feedback.distanceKm.toLocaleString()} km away.</p>
          )}
          {!feedback.correct && feedback.correctCountry && (
            <p className="inline-feedback-detail">Correct answer: {feedback.correctCountry}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default GameStatusPanel;
