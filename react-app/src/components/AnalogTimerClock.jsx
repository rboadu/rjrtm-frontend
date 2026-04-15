function AnalogTimerClock({ timeLeft, totalTime = 30, timerStateClass = "normal" }) {
  const safeTotal = Math.max(totalTime, 1);
  const clampedTime = Math.max(0, Math.min(timeLeft, safeTotal));
  const progressDeg = (clampedTime / safeTotal) * 360;
  const handDeg = ((safeTotal - clampedTime) / safeTotal) * 360;

  return (
    <div
      className={`analog-timer ${timerStateClass}`}
      role="timer"
      aria-live="polite"
      aria-label={`Time left ${clampedTime} seconds`}
      title={`Time left: ${clampedTime}s`}
    >
      <span className="timer-label">Time Left</span>
      <div
        className="analog-timer-face"
        style={{
          "--progress-deg": `${progressDeg}deg`,
          "--hand-deg": `${handDeg}deg`,
        }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            // Keep static keys for consistent rendering of tick marks.
            key={`tick-${index}`}
            className="analog-timer-tick"
            style={{ "--tick-rotation": `${index * 30}deg` }}
            aria-hidden="true"
          />
        ))}
        <span className="analog-timer-center" aria-hidden="true" />
      </div>
      <strong className="timer-value">{clampedTime}s</strong>
    </div>
  );
}

export default AnalogTimerClock;
