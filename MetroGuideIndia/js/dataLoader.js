/**
 * dataLoader.js
 * Loads all JSON data files and makes them available globally.
 */

const DataLoader = (() => {
  const BASE = './data/';
  const FILES = ['systems', 'lines', 'stations', 'connections', 'interchanges'];

  async function loadAll() {
    const results = await Promise.all(
      FILES.map(f => fetch(`${BASE}${f}.json`).then(r => r.json()))
    );
    return {
      systems:      results[0],
      lines:        results[1],
      stations:     results[2],
      connections:  results[3],
      interchanges: results[4],
    };
  }

  return { loadAll };
})();
