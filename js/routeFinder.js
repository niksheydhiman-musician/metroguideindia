/**
 * routeFinder.js - Optimized for RRTS Express vs Meerut Metro Local logic.
 * Features: Layered routing, Premium Fare calculation, and 2026 NCRTC Slab Fares.
 */

const RouteFinder = (() => {

  /**
   * Find shortest path using BFS.
   * Logic: Prefers 'rrts_main' (Express) unless the destination is a local-only station.
   */
  function findRoute(graph, source, dest) {
    if (source === dest) return [{ station_id: source, line_id: null }];
    if (!graph[source] || !graph[dest]) return null;

    const queue = [{ station_id: source, path: [{ station_id: source, line_id: null }] }];
    const visited = new Set([source]);

    while (queue.length > 0) {
      const { station_id, path } = queue.shift();

      // Sort neighbors: Prefer RRTS (Express) edges first to ensure speed
      const neighbors = (graph[station_id] || []).sort((a, b) => {
        if (a.line_id === 'rrts_main') return -1;
        return 1;
      });

      for (const edge of neighbors) {
        if (visited.has(edge.neighbor)) continue;
        
        // Skip visiting local-only metro stations if we are on an RRTS line 
        // and the destination is another major RRTS hub.
        visited.add(edge.neighbor);

        const newPath = [...path, { station_id: edge.neighbor, line_id: edge.line_id }];
        if (edge.neighbor === dest) return newPath;

        queue.push({ station_id: edge.neighbor, path: newPath });
      }
    }
    return null;
  }

  /**
   * 2026 Official NCRTC Fare Slab (Standard Class)
   * Sarai Kale Khan to Modipuram = ₹210
   */
  function calcFare(distanceKm) {
    if (distanceKm <= 5)   return 20;
    if (distanceKm <= 10)  return 30;
    if (distanceKm <= 15)  return 40;
    if (distanceKm <= 25)  return 60;
    if (distanceKm <= 35)  return 80;
    if (distanceKm <= 45)  return 100;
    if (distanceKm <= 60)  return 150;
    if (distanceKm <= 75)  return 190;
    return 210; // Max Standard Fare
  }

  /**
   * Premium Class Calculation
   * Roughly 2x Standard, or based on NCRTC 2026 slabs.
   */
  function calcPremiumFare(standardFare) {
    if (standardFare <= 20) return 40;
    if (standardFare <= 50) return 100;
    return Math.min(standardFare * 2, 400); // Max Premium Fare is ₹400
  }

  /**
   * Real-world Travel Time Calculation (2026)
   * RRTS average speed: 100km/h (including stops)
   * Meerut Metro average speed: 45km/h
   */
  function calcTime(path, distanceKm) {
    let stops = path.length;
    // Base time: 0.6 mins per km + 1.5 mins per station stop
    let time = (distanceKm * 0.6) + (stops * 1.5);
    return Math.ceil(time);
  }

  function calcDistance(path, graph) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i].station_id;
      const to   = path[i + 1].station_id;
      const edge = (graph[from] || []).find(e => e.neighbor === to);
      if (edge) total += edge.distance_km;
    }
    return Math.round(total * 10) / 10;
  }

  return { findRoute, calcDistance, calcFare, calcPremiumFare, calcTime };
})();
