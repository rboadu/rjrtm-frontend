// GameWorldMap.jsx
import { useState } from "react";
import WorldMap from "../components/WorldMap";
import Rules from "../components/Rules";
import countries from "../data/countries.json";
import "./GameWorldMap.css";

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
    console.log(`User double-clicked at: Latitude ${lat}, Longitude ${lng}`);
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
    <div className="page-container dark">

      {/* HERO */}
      <section>
        <div className="section-container hero-section">
          <div className="max-w-prose text-left">
            <h1 className="page-title">
              Find It On
              <strong className="highlight"> The Map</strong>
            </h1>
            <p className="description-text">
              A country will be chosen at random. Your only job is to find it.
              Scroll the map, trust your instincts, and double-click. How many can you get right in a row?
            </p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowRules(!showRules)}
                className="btn-primary"
              >
                How It Works
              </button>

            </div>

          </div>

          {showRules && (
            <div className="rules-container">
              <hr className="divider divider-with-margin" />
              <Rules />
            </div>
          )}
        </div>
      </section>

      <div className="section-container">
        <hr className="divider" />
      </div>

      {/* Map Section */}
      <section className="section-container map-section">
        <h2 className="section-heading">
          The <strong className="highlight">Map</strong>
        </h2>
        <p className="instruction-text">
          Double-click anywhere on the map to make your guess.
        </p>
        
        <div className="map-container">
          <WorldMap 
            onLocationSelect={handleLocationSelect}
            selectedPosition={selectedLocation}
          />
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="location-card">
            <div className="location-card-content">
              <div className="location-info">
                <h3 className="subsection-heading">
                  📍 Selected Location
                </h3>
                <div className="coordinate-display">
                  <p><strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}°</p>
                  <p><strong>Longitude:</strong> {selectedLocation.lng.toFixed(6)}°</p>
                </div>
              </div>
              
              <div className="button-group">
                <button
                  onClick={handleSubmitGuess}
                  disabled={!selectedLocation}
                  className="btn-submit"
                >
                  Submit Guess
                </button>

                <button
                  onClick={clearSelection}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>

            </div>
          </div>
        )}

        {/* FEEDBACK */}
        {feedback && (
          <div className={`feedback-card ${
            feedback.correct ? 'success' : 'error'
          }`}>
            <h3 className="feedback-heading">
              {feedback.correct ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p className="feedback-message">
              {feedback.message}
            </p>
            {!feedback.correct && feedback.correctCountry && (
              <p className="feedback-detail">
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


/// Use geocode to reverse geocode the selected lat/lng to get country name, 
// then send that to backend for validation.