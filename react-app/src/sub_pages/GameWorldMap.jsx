import { useState } from "react";
import WorldMap from "../components/worldMap";
import Rules from "../components/Rules";


function WorldMapPage() {
  const [showRules, setShowRules] = useState(false);

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
              Scroll the map, trust your instincts, and click. How many can you get right in a row?
            </p>
            <div className="mt-4 flex gap-4 sm:mt-6">
              <button 
                onClick={() => setShowRules(!showRules)}
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                href="#"
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
        <p className="text-base text-gray-700 dark:text-gray-200 mb-8 sm:text-lg/relaxed">
          The interactive world map.
        </p>
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <WorldMap />
        </div>
      </section>

    </div>
  );
}

export default WorldMapPage;