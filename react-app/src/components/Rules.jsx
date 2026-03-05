import React from "react";

const rules = [
  {
    step: "01",
    title: "Start the Game",
    description: "Hit the start button to receive your randomly assigned country.",
  },
  {
    step: "02",
    title: "Read the Country",
    description: "You'll be given the name of a country. That's all you get.",
  },
  {
    step: "03",
    title: "Navigate the Map",
    description: "Scroll and explore the interactive world map to locate it.",
  },
  {
    step: "04",
    title: "Make Your Pick",
    description: "Click on the country you believe is the correct one.",
  },
  {
    step: "05",
    title: "Get Feedback",
    description: "Find out immediately whether you were right or wrong.",
  },
  {
    step: "06",
    title: "Keep Going",
    description: "Each round is a new country. How many can you get right in a row?",
  },
];

const Rules = () => (
  <div>
    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
      How It <strong className="text-indigo-600">Works</strong>
    </h2>
    <p className="mt-2 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200 mb-10">
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rules.map((rule) => (
        <div
          key={rule.step}
          className="rounded border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
        >
          <span className="text-5xl font-extrabold text-indigo-100 dark:text-indigo-900 select-none">
            {rule.step}
          </span>
          <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white">
            {rule.title}
          </h3>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            {rule.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default Rules;