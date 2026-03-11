import React from "react";

const FaqAccordion = () => (
  <div className="space-y-2 max-w-3xl mx-auto mt-8">
    <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-12 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800">
        <span>What are the basic features?</span>

        <svg
          className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </summary>

      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-200">
          Users will be able to create, read, update Countries, States and
          Cities. On top of this functionality, we give users the opprotunity to
          play a fund game with the map
        </p>
      </div>
    </details>

    <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-12 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800">
        <span>How do I get started?</span>

        <svg
          className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </summary>

      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-200">
          You can go to the navigate bar and try out the site by using the load
          script. After that, we recommend moving on and trying to create your
          own entity. Once you create an entity try to view it and ensure
          everything is there. From then on, you can play around with it and
          have fun!
        </p>
      </div>
    </details>

    <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-12 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800">
        <span>What support options are available?</span>

        <svg
          className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </summary>

      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-200">
          For now the support options are limited to the basic CRUD
          functionality
        </p>
      </div>
    </details>
  </div>
);

export default FaqAccordion;
