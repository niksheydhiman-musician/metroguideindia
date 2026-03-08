/**
 * dataLoader.js - Dynamic Version
 * Fixes path errors and ensures data is fetched before UI renders.
 */
const DataLoader = (() => {
  async function loadJSON(file) {
    // Relative path strategy: Works on GitHub Pages root and custom domains
    const path = `data/${file}`;
    console.log(`System: Attempting to fetch ${path}...`);

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} at ${path}`);
      }
      const data = await response.json();
      console.log(`System: Successfully loaded ${file}`);
      return data;
    } catch (error) {
      console.error(`Critical Error: Could not load ${file}. Ensure the 'data' folder is in the root.`, error);
      throw error;
    }
  }

  async function loadAll() {
    try {
      const [systems, lines, stations, connections] = await Promise.all([
        loadJSON('systems.json'),
        loadJSON('lines.json'),
        loadJSON('stations.json'),
        loadJSON('connections.json')
      ]);

      return { systems, lines, stations, connections };
    } catch (e) {
      // Injects a visible error if data fails to load
      document.body.insertAdjacentHTML('afterbegin', 
        `<div style="background:#fee2e2; color:#b91c1c; padding:15px; text-align:center; font-weight:bold; position:fixed; top:0; width:100%; z-index:9999;">
          Data Load Error: Please check your 'data' folder location.
        </div>`
      );
      throw e;
    }
  }

  return { loadAll };
})();
