/**
 * routeUI.js - Version 2.0
 * Features: Hindi Support, Premium Fare Toggle, Interchange Logic, and Ticker.
 */

const RouteUI = (() => {
  const LINE_COLORS = {
    rrts_main: { bg: '#E63946', label: 'Namo Bharat (Express)', badge: 'rrts' },
    meerut_metro_main: { bg: '#39FF14', label: 'Meerut Metro (Local)', badge: 'metro' },
    interchange: { bg: '#2563eb', label: 'Transfer', badge: 'interchange' },
  };

  // State to track preferences
  let currentLanguage = 'en'; // 'en' or 'hi'
  let isPremium = false;

  /**
   * Main Render Function
   */
  function renderRoute(containerId, path, stations, interchanges, distance, standardFare, time) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stationMap = {};
    stations.forEach(s => (stationMap[s.station_id] = s));

    // Calculate premium fare using the new RouteFinder logic
    const premiumFare = RouteFinder.calcPremiumFare(standardFare);
    const displayFare = isPremium ? premiumFare : standardFare;

    const html = `
      <div class="route-result-card animate-in">
        <div class="announcement-ticker">
          <div class="ticker-content">
            ⚠️ Namo Bharat services now active SKK to Modipuram • Trains every 10 mins • Standard & Premium coaches available.
          </div>
        </div>

        <div class="class-selector">
          <button class="class-btn ${!isPremium ? 'active' : ''}" id="btn-standard">Standard</button>
          <button class="class-btn premium ${isPremium ? 'active' : ''}" id="btn-premium">Premium Class</button>
        </div>

        <div class="route-summary-bar">
          <div class="summary-item">
            <span class="summary-value">${distance} km</span>
            <span class="summary-label">${currentLanguage === 'hi' ? 'दूरी' : 'Distance'}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-value">₹${displayFare}</span>
            <span class="summary-label">${currentLanguage === 'hi' ? 'किराया' : 'Est. Fare'}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-value">${time} min</span>
            <span class="summary-label">${currentLanguage === 'hi' ? 'समय' : 'Est. Time'}</span>
          </div>
        </div>

        <div class="route-timeline">
          ${renderSteps(path, stationMap)}
        </div>
        
        <div class="route-disclaimer">
          * Fare and time are estimates. Prices based on 2026 NCRTC slabs.
        </div>
      </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';

    // Re-attach event listeners for the toggle
    document.getElementById('btn-standard').onclick = () => { isPremium = false; renderRoute(containerId, path, stations, interchanges, distance, standardFare, time); };
    document.getElementById('btn-premium').onclick = () => { isPremium = true; renderRoute(containerId, path, stations, interchanges, distance, standardFare, time); };
  }

  function renderSteps(path, stationMap) {
    return path.map((step, i) => {
      const station = stationMap[step.station_id];
      const name = currentLanguage === 'hi' ? station.station_name_hi : station.station_name;
      const isInterchange = i > 0 && path[i].line_id !== path[i - 1].line_id && path[i - 1].line_id !== null;
      
      let interchangeHTML = "";
      if (isInterchange) {
        interchangeHTML = `
          <div class="interchange-alert">
            <div class="alert-icon">🔄</div>
            <div class="alert-text">
              <strong>${currentLanguage === 'hi' ? 'ट्रेन बदलें' : 'Transfer Point'}</strong><br>
              ${currentLanguage === 'hi' ? 'मेरठ मेट्रो में बदलें' : 'Switch to Meerut Metro Local'}
            </div>
          </div>
        `;
      }

      const lineConfig = LINE_COLORS[step.line_id] || LINE_COLORS.rrts_main;

      return `
        ${interchangeHTML}
        <div class="timeline-step">
          <div class="node" style="background: ${lineConfig.bg}"></div>
          <div class="step-details">
            <div class="station-name">${name}</div>
            <div class="line-tag" style="color: ${lineConfig.bg}">${lineConfig.label}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function setLanguage(lang) {
    currentLanguage = lang;
  }

  return { renderRoute, setLanguage };
})();
