/**
 * dataLoader.js
 * Loads JSON datasets from the local data/ folder.
 */
const DataLoader = (() => {
  async function loadJSON(file) {
    // We use a relative path. This works on GitHub Pages AND custom domains.
    const response = await fetch(`data/${file}`);
    if (!response.ok) throw new Error(`Could not load ${file}`);
    return response.json();
  }

  async function loadAll() {
    const [systems, lines, stations, connections] = await Promise.all([
      loadJSON('systems.json'),
      loadJSON('lines.json'),
      loadJSON('stations.json'),
      loadJSON('connections.json')
    ]);

    return { systems, lines, stations, connections };
  }

  return { loadAll };
})();
