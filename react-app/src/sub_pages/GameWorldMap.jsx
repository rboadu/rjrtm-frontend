// GameWorldMap.jsx
import { useState } from "react";
import WorldMap from "../components/WorldMap";
import Rules from "../components/Rules";
import countries from "../data/countries.json";

function WorldMapPage() {
  const [showRules, setShowRules] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [targetCountry, setTargetCountry] = useState(null);
  const [score, setScore] = useState(0);

  function getRandomCountry() {
    const rand = countries[Math.floor(Math.random() * countries.length)];
    setTargetCountry(rand);
  }

  function startGame() {
    setScore(0);
    setFeedback(null);
    setSelectedLocation(null);
    setGameStarted(true);
    getRandomCountry();
  }

  const handleLocationSelect = (lat, lng) => {
    if (!gameStarted) return;
    setSelectedLocation({ lat, lng });
    setFeedback(null);
  };

  const handleSubmitGuess = () => {
    if (!selectedLocation || !targetCountry) return;

    const dist = Math.sqrt(
      Math.pow(selectedLocation.lat - targetCountry.lat, 2) +
      Math.pow(selectedLocation.lng - targetCountry.lng, 2)
    );

    const correct = dist < 5;

    if (correct) {
      setScore(score + 1);

      setFeedback({
        correct: true,
        message: "Correct! Next country..."
      });

      setSelectedLocation(null);
      getRandomCountry();
    } else {
      setFeedback({
        correct: false,
        message: "Wrong location!",
        correctCountry: targetCountry.name
      });

      setGameStarted(false);
    }
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setFeedback(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">

      {/* HERO */}
      <section className="bg-white dark:bg-gray-900 w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-prose text-left">

            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
              Find It On
              <strong className="text-indigo-600"> The Map</strong>
            </h1>

            <p className="mt-4 text-base text-gray-700 sm:text-lg dark:text-gray-200">
              Press Start Game. A country will appear. Double-click where you think it is.
              How many can you get correct in a row?
            </p>

            <div className="mt-6 flex gap-4">

              <button
                onClick={startGame}
                className="rounded bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700"
              >
                Start Game
              </button>

              <button
                onClick={() => setShowRules(!showRules)}
                className="rounded border border-indigo-600 bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
              >
                How It Works
              </button>

            </div>

          </div>

          {showRules && (
            <div className="mt-10">
              <hr className="border-gray-200 dark:border-gray-700 mb-8" />
              <Rules />
            </div>
          )}
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-12">

        {gameStarted && (
          <>
            <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Score: {score}
            </div>

            {targetCountry && (
              <div className="mb-6 text-xl font-bold text-indigo-600">
                Find: {targetCountry.name}
              </div>
            )}
          </>
        )}

        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <WorldMap
            onLocationSelect={handleLocationSelect}
            selectedPosition={selectedLocation}
          />
        </div>

        {/* Selected Location */}
        {selectedLocation && gameStarted && (
          <div className="mt-6 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border">

            <div className="flex justify-between">

              <div className="font-mono text-sm">
                <p>Lat: {selectedLocation.lat.toFixed(4)}</p>
                <p>Lng: {selectedLocation.lng.toFixed(4)}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitGuess}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit Guess
                </button>

                <button
                  onClick={clearSelection}
                  className="px-6 py-2 bg-gray-300 rounded-lg"
                >
                  Clear
                </button>
              </div>

            </div>
          </div>
        )}

        {/* FEEDBACK */}
        {feedback && (
          <div className={`mt-6 p-6 rounded-lg border ${
            feedback.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}>

            <h3 className="font-semibold text-lg text-black">
              {feedback.correct ? "✅ Correct!" : "❌ Game Over"}
            </h3>

            <p className="text-black">{feedback.message}</p>

            {!feedback.correct && (
              <p className="mt-2 text-sm text-black">
                Correct answer: {feedback.correctCountry}
              </p>
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default WorldMapPage;