// GameWorldMap.jsx
import { useEffect, useRef, useState } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
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
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [countriesGeoJson, setCountriesGeoJson] = useState(null);
  const mapSectionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountriesGeoJson(data))
      .catch((err) => console.error("Failed to load countries GeoJSON:", err));
  }, []);

  function findClickedCountry(lat, lng) {
    if (!countriesGeoJson) return null;
    const pt = { type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] } };
    for (const feature of countriesGeoJson.features) {
      if (booleanPointInPolygon(pt, feature)) {
        return feature.properties;
      }
    }
    return null;
  }

    function stopGame() {
      setGameStarted(false);
      setTargetCountry(null);
      setStreak(0);
      setTimeLeft(30);
      setSelectedLocation(null);
      setFeedback(null);
    }

  function getRandomCountry() {
    const rand = countries[Math.floor(Math.random() * countries.length)];
    setTargetCountry(rand);
  }

  function startGame() {
    setStreak(0);
    setFeedback(null);
    setSelectedLocation(null);
    setTimeLeft(30);
    setGameStarted(true);
    getRandomCountry();
  }

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (!gameStarted || timeLeft > 0) return;

    setStreak(0);
    setFeedback({ correct: false, message: "Time's up! Moving to the next country..." });

    const advance = setTimeout(() => {
      getRandomCountry();
      setTimeLeft(30);
      setSelectedLocation(null);
      setFeedback(null);
    }, 2000);

    return () => clearTimeout(advance);
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

  const handleSubmitGuess = () => {
    if (!selectedLocation) return;

    const clickedProps = findClickedCountry(selectedLocation.lat, selectedLocation.lng);
    const targetName = targetCountry?.name ?? "";

    let correct = false;
    let clickedName = null;

    if (clickedProps) {
      console.log("GeoJSON feature properties:", clickedProps);
      // Natural Earth 3.3.0 uses lowercase property names
      clickedName =
        clickedProps.name ?? clickedProps.NAME ??
        clickedProps.admin ?? clickedProps.ADMIN ??
        clickedProps.sovereignt ?? clickedProps.SOVEREIGNT ??
        "Unknown";
      const normalize = (s) => s.toLowerCase().trim();
      const geoNames = [
        clickedProps.name, clickedProps.NAME,
        clickedProps.admin, clickedProps.ADMIN,
        clickedProps.sovereignt, clickedProps.SOVEREIGNT,
      ].filter(Boolean).map(normalize);
      correct = geoNames.includes(normalize(targetName));
    }

    if (correct) {
      clearInterval(timerRef.current);
      setStreak((prev) => prev + 1);
      setFeedback({ correct: true, message: `Correct! That's ${targetName}.` });
      setTimeout(() => {
        getRandomCountry();
        setTimeLeft(30);
        setSelectedLocation(null);
        setFeedback(null);
      }, 2000);
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        message: clickedName
          ? `That's ${clickedName}. Try again!`
          : `You clicked the ocean! Try again!`,
      });
      setSelectedLocation(null);
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
                type="button"
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
      <section id="map-section" ref={mapSectionRef} className="section-container map-section">
        <h2 className="section-heading">
          <strong className="highlight">The Map</strong>
        </h2>
        {gameStarted && targetCountry ? (
          <GameStatusPanel
            targetCountry={targetCountry}
            timeLeft={timeLeft}
            streak={streak}
            onStopGame={stopGame}
            selectedLocation={selectedLocation}
            onSubmitGuess={handleSubmitGuess}
            onClearSelection={clearSelection}
            feedback={feedback}
          />
        ) : (
          <>
            <p className="instruction-text">
              Double-click anywhere on the map to make your guess.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="btn-primary start-game-btn"
            >
              Start Game
            </button>
          </>
        )}


        <div className="map-container">
          <WorldMap
            onLocationSelect={handleLocationSelect}
            selectedPosition={selectedLocation}
            countriesGeoJson={countriesGeoJson}
          />
        </div>

      </section>

    </div>
  );
}

export default WorldMapPage;
