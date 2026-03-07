/**
 * routeFinder.js
 * BFS-based shortest path finder on the transit graph.
 * Returns a path array of { station_id, line_id } objects.
 */

const RouteFinder = (() => {

  /**
   * Find shortest path using BFS.
   * @param {Object} graph   - Adjacency map from GraphBuilder
   * @param {string} source  - Source station_id
   * @param {string} dest    - Destination station_id
   * @returns {Array|null}   - Array of steps [{station_id, line_id}] or null
   */
  function findRoute(graph, source, dest) {
    if (source === dest) return [{ station_id: source, line_id: null }];
    if (!graph[source] || !graph[dest]) return null;

    // BFS queue: each entry is { station_id, path: [{station_id, line_id}] }
    const queue = [{ station_id: source, path: [{ station_id: source, line_id: null }] }];
    const visited = new Set([source]);

    while (queue.length > 0) {
      const { station_id, path } = queue.shift();

      const neighbors = graph[station_id] || [];
      for (const edge of neighbors) {
        if (visited.has(edge.neighbor)) continue;
        visited.add(edge.neighbor);

        const newPath = [...path, { station_id: edge.neighbor, line_id: edge.line_id }];

        if (edge.neighbor === dest) return newPath;

        queue.push({ station_id: edge.neighbor, path: newPath });
      }
    }

    return null; // No path found
  }

  /**
   * Calculate total distance for a path.
   * @param {Array} path     - Path from findRoute
   * @param {Object} graph   - Adjacency map
   * @param {Object} stationMap - Map of station_id -> station object
   * @returns {number} distance in km
   */
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

  /**
   * Estimate fare based on distance.
   * Approximate RRTS/Metro fare slab (INR).
   */
  function calcFare(distanceKm) {
    if (distanceKm <= 5)  return 20;
    if (distanceKm <= 12) return 30;
    if (distanceKm <= 20) return 40;
    if (distanceKm <= 30) return 55;
    if (distanceKm <= 45) return 70;
    if (distanceKm <= 60) return 90;
    return 110;
  }

  /**
   * Estimate travel time based on distance.
   * RRTS avg ~100 km/h, Metro avg ~40 km/h. Mixed: ~70 km/h effective.
   */
  function calcTime(distanceKm) {
    // Approx: 3 min per stop + speed factor
    return Math.ceil(distanceKm * 0.9 + 5);
  }

  return { findRoute, calcDistance, calcFare, calcTime };
})();
