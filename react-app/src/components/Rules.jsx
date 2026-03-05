import React from 'react';

const Rules = () => (
  <section style={{ padding: '2rem', color: '#333', background:  '#f9f9f9', borderRadius: '8px', margin: '2rem 0' }}>
    <h2>Game Rules</h2>
    <ol>
      <li>Click "Start Game" to begin.</li>
      <li>A random country will be selected for you (handled by the system).</li>
      <li>Use the interactive world map to scroll and find the country.</li>
      <li>Click on the country you believe matches the one given.</li>
      <li>You’ll get instant feedback on your selection.</li>
      <li>Try to get as many correct as possible!</li>
    </ol>
    <p>Good luck and have fun exploring the world!</p>
  </section>
);

export default Rules;