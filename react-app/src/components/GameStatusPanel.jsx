
function GameStatusPanel({ targetCountry, timeLeft, onStopGame }) {
  const countryLabel =
    typeof targetCountry === "string" ? targetCountry : targetCountry?.name ?? "Unknown";

  const timerStateClass =
    timeLeft <= 10 ? "urgent" : timeLeft <= 20 ? "warning" : "normal";

  return (
    <div className={`game-status-card ${timerStateClass}`}>
      <p className="game-status-label">Find this country before time runs out</p>
      <div className="game-status-row">
        <div>
          <p className="target-country-label">Target Country</p>
          <h3 className="target-country-name">{countryLabel}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="timer-chip" aria-live="polite">
            <span className="timer-label">Time Left</span>
            <strong className="timer-value">{timeLeft}s</strong>
          </div>
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
    </div>
  );
}

export default GameStatusPanel;
