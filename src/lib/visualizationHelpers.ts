
/**
 * Helper functions for visualizations
 */

/**
 * Generate a random node for network graphs
 * @param id Unique identifier
 * @param groupCount Number of possible groups
 * @returns Node object
 */
export const generateRandomNode = (id: string, groupCount = 5) => {
  return {
    id,
    group: Math.floor(Math.random() * groupCount) + 1,
    size: 5 + Math.random() * 15,
    label: `Node ${id}`
  };
};

/**
 * Create a link between two nodes
 * @param source Source node id
 * @param target Target node id
 * @param value Strength of connection
 * @returns Link object
 */
export const createLink = (source: string, target: string, value = 1) => {
  return {
    source,
    target,
    value
  };
};

/**
 * Generate a random network
 * @param nodeCount Number of nodes
 * @param density Link density (0-1)
 * @returns Graph data with nodes and links
 */
export const generateRandomNetwork = (nodeCount = 10, density = 0.3) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => 
    generateRandomNode(`node-${i}`)
  );
  
  const links = [];
  
  // Create links with specified density
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < density) {
        links.push(createLink(`node-${i}`, `node-${j}`, 1 + Math.random() * 5));
      }
    }
  }
  
  return { nodes, links };
};

/**
 * Color scale for agent types
 */
export const agentColors = {
  coordinator: "#2563eb", // blue
  knowledge: "#7c3aed",   // purple
  processor: "#db2777",   // pink
  action: "#16a34a",      // green
  utility: "#ea580c"      // orange
};

/**
 * Format a number as a percentage
 * @param value Number to format
 * @param decimals Decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Animate a value from start to end
 * @param start Starting value
 * @param end Ending value
 * @param duration Duration in ms
 * @param callback Callback function receiving current value
 */
export const animateValue = (
  start: number, 
  end: number, 
  duration: number, 
  callback: (value: number) => void
) => {
  const startTime = performance.now();
  
  const updateValue = (timestamp: number) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = start + (end - start) * progress;
    
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  };
  
  requestAnimationFrame(updateValue);
};
