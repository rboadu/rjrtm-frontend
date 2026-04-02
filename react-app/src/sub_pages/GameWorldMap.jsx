// GameWorldMap.jsx
import { useEffect, useRef, useState } from "react";
import WorldMap from "../components/WorldMap";
import Rules from "../components/Rules";
import GameStatusPanel from "../components/GameStatusPanel";
import countries from "../data/countries.json";
import "./GameWorldMap.css";

function WorldMapPage() {
  const [showRules, setShowRules] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [targetCountry, setTargetCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const mapSectionRef = useRef(null);

  function getRandomCountry() {
    const rand = countries[Math.floor(Math.random() * countries.length)];
    setTargetCountry(rand);
  }

  function startGame() {
    setScore(0);
    setFeedback(null);
    setSelectedLocation(null);
    setTimeLeft(30);
    setGameStarted(true);
    getRandomCountry();
  }

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (!gameStarted) return;

    requestAnimationFrame(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [gameStarted, targetCountry]);

  const handleLocationSelect = (lat, lng) => {
    console.log(`User double-clicked at: Latitude ${lat}, Longitude ${lng}`);
    setSelectedLocation({ lat, lng });
    setFeedback(null);
  };

  const handleSubmitGuess = async () => {
    if (!selectedLocation) return;

    const payload = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };

    // Mock the API call to /api/makeGuess
    try {
      // Log the payload to show what would be sent
      console.log("POST /api/makeGuess", payload);

      // Mocked response (replace with real fetch/axios call later)
      const mockResponse = {
        correct: true,
        message: "Mocked backend response: Guess received.",
        correctCountry: "MockCountry" 
      };

      setFeedback(mockResponse);
    } catch (error) {
      setFeedback({ correct: false, message: "Network error (mocked)" });
    }
  };

  // Planning on making use of Google Maps Geocoding API to reverse geocode the lat/lng to get the country name,
  // The Api endpoint will be implemented on the backend to keep the API key secure, with request limiting to prevent abuse. 
  // You can't limit the billable account to the free tier, so I want to make sure the 
  // API key is never exposed on the frontend and that the number of requests never exceeds the free tier limits.
  // The Geocoding API is pretty accurate, even down to the address. That's unnecessary for this game, so I'll just extract the country name.
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
                type="button"
                onClick={() => setShowRules(!showRules)}
                className="btn-primary"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={startGame}
                className="btn-primary"
              >
                Start Game
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
      <section id="map-section" ref={mapSectionRef} className="section-container map-section">
        <h2 className="section-heading">
          <strong className="highlight">The Map</strong>
        </h2>
        {gameStarted && targetCountry ? (
          <GameStatusPanel targetCountry={targetCountry} timeLeft={timeLeft} />
        ) : (
          <p className="instruction-text">
            Double-click anywhere on the map to make your guess.
          </p>
        )}


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
                  type="button"
                  onClick={handleSubmitGuess}
                  disabled={!selectedLocation}
                  className="btn-submit"
                >
                  Submit Guess
                </button>

                <button
                  type="button"
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
