/**
 * dataLoader.js - Final Root-Relative Version
 * Ensures data is fetched from the correct root path regardless of the URL.
 */
const DataLoader = (() => {
  async function loadJSON(file) {
    // Adding a timestamp (?t=...) prevents the browser from loading old, cached errors
    const cacheBuster = `?t=${new Date().getTime()}`;
    const path = `data/${file}${cacheBuster}`;
    
    console.log(`System: Fetching from path: ${path}`);

    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`404: File not found at ${path}`);
      }

      const data = await response.json();
      console.log(`System: ✅ Successfully loaded ${file}`);
      return data;
    } catch (error) {
      console.error(`Critical Error: Could not load ${file}.`, error);
      throw error;
    }
  }

  async function loadAll() {
    try {
      // Note: We are only loading the 4 files you actually have in your /data/ folder
      const [systems, lines, stations, connections] = await Promise.all([
        loadJSON('systems.json'),
        loadJSON('lines.json'),
        loadJSON('stations.json'),
        loadJSON('connections.json')
      ]);

      return { systems, lines, stations, connections };
    } catch (e) {
      // Injects a visible error if data fails to load
      const errorDiv = document.getElementById('data-error-overlay');
      if (!errorDiv) {
        document.body.insertAdjacentHTML('afterbegin', 
          `<div id="data-error-overlay" style="background:#fff7ed; color:#9a3412; padding:20px; text-align:center; font-weight:600; border-bottom:2px solid #fdba74; position:relative; z-index:9999;">
            ⚠️ Configuration Update: Please refresh the page (Ctrl + F5). <br>
            <small style="font-weight:400; opacity:0.8;">If this persists, ensure your 'data' folder is in the root directory.</small>
          </div>`
        );
      }
      throw e;
    }
  }

  return { loadAll };
})();
