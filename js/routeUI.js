/**
 * routeUI.js
 * Renders route results into the DOM.
 */

const RouteUI = (() => {

  const LINE_COLORS = {
    rrts_main:          { bg: '#E63946', label: 'Namo Bharat RRTS', badge: 'rrts' },
    meerut_metro_main:  { bg: '#39FF14', label: 'Meerut Metro',     badge: 'metro' },
    interchange:        { bg: '#A0AEC0', label: 'Interchange',       badge: 'interchange' },
  };

  /**
   * Render the full route into a container element.
   * @param {string}  containerId  - DOM element id
   * @param {Array}   path         - BFS path [{station_id, line_id}]
   * @param {Array}   stations     - All station objects
   * @param {Array}   interchanges - All interchange objects
   * @param {number}  distance     - Total distance km
   * @param {number}  fare         - Estimated fare INR
   * @param {number}  time         - Estimated time mins
   */
  function renderRoute(containerId, path, stations, interchanges, distance, fare, time) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stationMap = {};
    stations.forEach(s => stationMap[s.station_id] = s);

    const interchangeMap = {};
    interchanges.forEach(i => interchangeMap[i.station_id] = i);

    // Build enriched steps
    const steps = path.map((step, idx) => {
      const station = stationMap[step.station_id] || {};
      const isInterchange = step.line_id === 'interchange';
      const lineInfo = LINE_COLORS[step.line_id] || LINE_COLORS['rrts_main'];
      const intData = interchangeMap[step.station_id];

      return { step, station, isInterchange, lineInfo, intData, idx };
    });

    // Detect line segments
    let currentLine = steps.find(s => !s.isInterchange)?.step.line_id || 'rrts_main';

    const html = `
      <div class="route-result-card">
        <div class="route-summary-bar">
          <div class="summary-item">
            <span class="summary-icon">📍</span>
            <span class="summary-value">${distance} km</span>
            <span class="summary-label">Distance</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-icon">₹</span>
            <span class="summary-value">${fare}</span>
            <span class="summary-label">Est. Fare</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-icon">⏱</span>
            <span class="summary-value">${time} min</span>
            <span class="summary-label">Est. Time</span>
          </div>
        </div>

        <div class="route-stations">
          ${steps.map((s, i) => renderStep(s, i, steps)).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';

    // Animate in
    requestAnimationFrame(() => {
      container.querySelector('.route-result-card')?.classList.add('visible');
    });
  }

  function renderStep({ step, station, isInterchange, lineInfo, intData }, i, steps) {
    const isFirst = i === 0;
    const isLast  = i === steps.length - 1;
    const name    = station.station_name || step.station_id;

    // Determine the line of THIS station display
    // Use the line_id of the next step if this is a transition
    let displayLine = step.line_id;
    if (!displayLine || displayLine === 'interchange') {
      // Use previous non-interchange line
      for (let j = i - 1; j >= 0; j--) {
        if (steps[j].step.line_id && steps[j].step.line_id !== 'interchange') {
          displayLine = steps[j].step.line_id;
          break;
        }
      }
    }

    const lineColor = LINE_COLORS[displayLine]?.bg || '#E63946';
    const lineBadge = LINE_COLORS[displayLine]?.label || 'RRTS';

    if (isInterchange && intData) {
      // Render interchange node
      return `
        <div class="route-step interchange-step">
          <div class="step-connector">
            <div class="connector-line" style="background:${lineColor}"></div>
            <div class="step-dot interchange-dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4"/></svg>
            </div>
            <div class="connector-line after" style="background:${LINE_COLORS[steps[i+1]?.step.line_id]?.bg || '#39FF14'}"></div>
          </div>
          <div class="step-info interchange-info">
            <div class="interchange-badge">Change Train</div>
            <div class="interchange-title">${name}</div>
            <div class="interchange-detail">
              <span class="platform-tag">${intData.change_platform}</span>
              <span class="interchange-instruction">${intData.instructions}</span>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="route-step ${isFirst ? 'first-step' : ''} ${isLast ? 'last-step' : ''}">
        <div class="step-connector">
          ${!isFirst ? `<div class="connector-line" style="background:${lineColor}"></div>` : ''}
          <div class="step-dot ${isFirst ? 'origin-dot' : isLast ? 'dest-dot' : 'mid-dot'}" style="border-color:${lineColor}">
            ${isFirst ? '<span>A</span>' : isLast ? '<span>B</span>' : ''}
          </div>
          ${!isLast ? `<div class="connector-line after" style="background:${lineColor}"></div>` : ''}
        </div>
        <div class="step-info">
          <div class="step-name">${name}</div>
          <div class="step-meta">
            <span class="line-badge" style="background:${lineColor}20; color:${lineColor}; border-color:${lineColor}40">${lineBadge}</span>
            ${station.city ? `<span class="city-tag">${station.city}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function renderError(containerId, msg) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="route-error"><span class="error-icon">⚠️</span><p>${msg}</p></div>`;
    container.style.display = 'block';
  }

  function clearResult(containerId) {
    const container = document.getElementById(containerId);
    if (container) { container.innerHTML = ''; container.style.display = 'none'; }
  }

  return { renderRoute, renderError, clearResult };
})();
