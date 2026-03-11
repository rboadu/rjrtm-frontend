// GameWorldMap.jsx
import { useState } from "react";
import WorldMap from "../components/WorldMap";
import Rules from "../components/Rules";

function WorldMapPage() {
  const [showRules, setShowRules] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Handle when user double-clicks on map
  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setFeedback(null); // Clear previous feedback
    console.log(`User selected: Lat ${lat}, Lng ${lng}`);
  };

  // Submit guess to backend
  const handleSubmitGuess = async () => {
    if (!selectedLocation) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://your-backend-url.com/api/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        }),
      });

      const result = await response.json();
      setFeedback(result); // Display backend response
      
    } catch (error) {
      console.error('Error submitting guess:', error);
      setFeedback({ error: 'Failed to submit guess' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset for next round
  const handlePlayAgain = () => {
    setSelectedLocation(null);
    setFeedback(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-prose text-left">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
              Find It On
              <strong className="text-indigo-600"> The Map</strong>
            </h1>
            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
              A country will be chosen at random. Your only job is to find it.
              Scroll the map, trust your instincts, and double-click. How many can you get right in a row?
            </p>
            <div className="mt-4 flex gap-4 sm:mt-6">
              <button 
                onClick={() => setShowRules(!showRules)}
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                How It Works
              </button>
            </div>
          </div>

          {/*  Rules Section */}
          {showRules && (
            <div className="mt-10">
              <hr className="border-gray-200 dark:border-gray-700 mb-8" />
              <Rules />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <hr className="border-gray-200 dark:border-gray-700" />
      </div>

      {/* Map Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          The <strong className="text-indigo-600">Map</strong>
        </h2>
        <p className="text-base text-gray-700 dark:text-gray-200 mb-4 sm:text-lg/relaxed">
          Double-click anywhere on the map to make your guess.
        </p>
        
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <WorldMap 
            onLocationSelect={handleLocationSelect}
            selectedPosition={selectedLocation}
          />
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-6 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  📍 Selected Location
                </h3>
                <div className="space-y-1 font-mono text-sm text-gray-700 dark:text-gray-200">
                  <p><strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}°</p>
                  <p><strong>Longitude:</strong> {selectedLocation.lng.toFixed(6)}°</p>
                </div>
              </div>
              
              <div className="flex gap-3 ml-4">
                <button
                  onClick={handleSubmitGuess}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Guess'}
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className={`mt-4 p-6 rounded-lg border ${
            feedback.correct 
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              feedback.correct 
                ? 'text-green-900 dark:text-green-100' 
                : 'text-red-900 dark:text-red-100'
            }`}>
              {feedback.correct ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p className={`${
              feedback.correct 
                ? 'text-green-700 dark:text-green-200' 
                : 'text-red-700 dark:text-red-200'
            }`}>
              {feedback.message}
            </p>
            {!feedback.correct && feedback.correctCountry && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">
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