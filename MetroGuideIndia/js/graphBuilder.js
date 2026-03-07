/**
 * graphBuilder.js
 * Builds a bidirectional adjacency graph from connections data.
 * Each node is a station_id. Each edge stores line_id and distance_km.
 */

const GraphBuilder = (() => {

  /**
   * Build the graph.
   * @param {Array} connections - Array of connection objects
   * @returns {Object} adjacency map: { station_id: [ { neighbor, line_id, distance_km }, ... ] }
   */
  function build(connections) {
    const graph = {};

    connections.forEach(conn => {
      const { from_station, to_station, line_id, distance_km } = conn;

      if (!graph[from_station]) graph[from_station] = [];
      if (!graph[to_station])   graph[to_station]   = [];

      // Add both directions (undirected)
      graph[from_station].push({ neighbor: to_station, line_id, distance_km });
      graph[to_station].push({ neighbor: from_station, line_id, distance_km });
    });

    return graph;
  }

  return { build };
})();
