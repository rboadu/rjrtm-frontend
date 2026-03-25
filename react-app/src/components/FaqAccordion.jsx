// import React from "react";

// const FaqAccordion = () => (
//   <div className="text-left space-y-2 max-w-3xl mx-auto mt-8">
//     <details className="w-full group rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 [&_summary::-webkit-details-marker]:hidden">
//       <summary className="flex cursor-pointer items-center justify-between gap-4 px-12 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//         <span>What are the basic features?</span>
//         <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//         </svg>
//       </summary>
//       <div className="px-12 py-3 border-t border-gray-200 dark:border-gray-700">
//         <p className="text-gray-700 dark:text-gray-200">
//           Users will be able to create, read, update Countries, States and
//           Cities. On top of this functionality, we give users the opportunity to
//           play a fun game with the map.
//         </p>
//       </div>
//     </details>

//     <details className="w-full group rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 [&_summary::-webkit-details-marker]:hidden">
//       <summary className="flex cursor-pointer items-center justify-between gap-4 px-12 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//         <span>How do I get started?</span>
//         <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//         </svg>
//       </summary>
//       <div className="px-12 py-3 border-t border-gray-200 dark:border-gray-700">
//         <p className="text-gray-700 dark:text-gray-200">
//           You can go to the navigation bar and try out the site by using the
//           load script. After that, we recommend moving on and trying to create
//           your own entity. Once you create an entity try to view it and ensure
//           everything is there. From then on, you can play around with it and
//           have fun!
//         </p>
//       </div>
//     </details>

//     <details className="w-full group rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 [&_summary::-webkit-details-marker]:hidden">
//       <summary className="flex cursor-pointer items-center justify-between gap-4 px-12 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//         <span>What support options are available?</span>
//         <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//         </svg>
//       </summary>
//       <div className="px-12 py-3 border-t border-gray-200 dark:border-gray-700">
//         <p className="text-gray-700 dark:text-gray-200">
//           For now the support options are limited to the basic CRUD functionality.
//         </p>
//       </div>
//     </details>
//   </div>
// );

// export default FaqAccordion;


import React, { useState } from "react";

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: "What are the basic features?",
      answer: "Users will be able to create, read, update Countries, States and Cities. On top of this functionality, we give users the opportunity to play a fun game with the map.",
    },
    {
      question: "How do I get started?",
      answer: "You can go to the navigation bar and try out the site by using the load script. After that, we recommend moving on and trying to create your own entity. Once you create an entity try to view it and ensure everything is there. From then on, you can play around with it and have fun!",
    },
    {
      question: "What support options are available?",
      answer: "For now the support options are limited to the basic CRUD functionality.",
    },
  ];

  return (
    <div className="text-left space-y-2 max-w-3xl mx-auto mt-8">
      {faqs.map((faq, index) => (
        <div key={index} className="w-full max-w-3xl">
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-6 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span>{faq.question}</span>
            <svg
              className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openIndex === index ? "-rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="w-full px-6 py-3 border border-t-0 border-gray-200 rounded-b-lg dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-200">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;