
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  group: number;
  size: number;
  label: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const NetworkVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous visualization
    svg.selectAll("*").remove();
    
    // Sample data for the agent network
    const data: GraphData = {
      nodes: [
        { id: "central-agent", group: 1, size: 25, label: "Central Coordinator" },
        { id: "knowledge-1", group: 2, size: 18, label: "Knowledge Database" },
        { id: "processor-1", group: 3, size: 15, label: "Data Processor" },
        { id: "action-1", group: 4, size: 14, label: "Action Agent" },
        { id: "knowledge-2", group: 2, size: 16, label: "Document Analysis" },
        { id: "processor-2", group: 3, size: 13, label: "Image Processor" },
        { id: "action-2", group: 4, size: 14, label: "Email Agent" },
        { id: "processor-3", group: 3, size: 12, label: "NLP Engine" },
        { id: "action-3", group: 4, size: 15, label: "API Connector" },
        { id: "knowledge-3", group: 2, size: 17, label: "Vector Store" },
        { id: "utility-1", group: 5, size: 11, label: "Logger" },
        { id: "utility-2", group: 5, size: 12, label: "Monitor" },
      ],
      links: [
        { source: "central-agent", target: "knowledge-1", value: 5 },
        { source: "central-agent", target: "processor-1", value: 7 },
        { source: "central-agent", target: "action-1", value: 6 },
        { source: "central-agent", target: "knowledge-2", value: 5 },
        { source: "central-agent", target: "processor-2", value: 4 },
        { source: "central-agent", target: "action-2", value: 3 },
        { source: "knowledge-1", target: "processor-1", value: 4 },
        { source: "processor-1", target: "action-1", value: 3 },
        { source: "knowledge-2", target: "processor-2", value: 4 },
        { source: "processor-2", target: "action-2", value: 3 },
        { source: "knowledge-1", target: "knowledge-2", value: 2 },
        { source: "processor-1", target: "processor-2", value: 2 },
        { source: "action-1", target: "action-2", value: 1 },
        { source: "central-agent", target: "processor-3", value: 3 },
        { source: "processor-3", target: "knowledge-3", value: 4 },
        { source: "knowledge-3", target: "action-3", value: 5 },
        { source: "central-agent", target: "action-3", value: 3 },
        { source: "central-agent", target: "knowledge-3", value: 4 },
        { source: "utility-1", target: "central-agent", value: 2 },
        { source: "utility-2", target: "central-agent", value: 2 },
        { source: "utility-1", target: "utility-2", value: 1 },
      ]
    };
    
    // Create the force simulation
    const simulation = d3.forceSimulation<Node, Link>()
      .nodes(data.nodes)
      .force("link", d3.forceLink<Node, Link>()
          .id(d => (d as Node).id)
          .links(data.links)
          .distance(d => 100 - d.value * 8)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => (d.size || 10) + 10));
    
    // Color scale for different agent groups
    const color = d3.scaleOrdinal<string>()
      .domain(["1", "2", "3", "4", "5"])
      .range(["#2563eb", "#7c3aed", "#db2777", "#16a34a", "#ea580c"]);
    
    // Create graph elements
    const g = svg.append("g");
    
    // Add zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any
    );
    
    // Create links
    const link = g.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", d => {
        const sourceNode = data.nodes.find(n => n.id === d.source);
        const targetNode = data.nodes.find(n => n.id === d.target);
        return d3.interpolateRgb(
          color(`${sourceNode?.group || 1}`),
          color(`${targetNode?.group || 1}`)
        )(0.5);
      })
      .attr("stroke-width", d => Math.sqrt(d.value));
    
    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any
      );
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => color(`${d.group}`))
      .attr("stroke", d => d3.rgb(color(`${d.group}`)).darker().toString())
      .attr("stroke-width", 1.5)
      .append("title")
      .text(d => d.label);
    
    // Add labels to nodes
    node.append("text")
      .attr("dx", d => d.size + 5)
      .attr("dy", "0.35em")
      .text(d => d.label)
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .style("pointer-events", "none")
      .style("opacity", 0.7);
    
    // Add pulsing effect to nodes
    node.selectAll("circle")
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", d => `${d.size};${d.size + 2};${d.size}`)
      .attr("dur", d => `${3 + Math.random() * 2}s`)
      .attr("repeatCount", "indefinite");
    
    // Visual effect for data transmission along edges
    data.links.forEach((link, i) => {
      g.append("circle")
        .attr("r", 3)
        .attr("fill", "white")
        .attr("class", `data-packet-${i}`)
        .style("filter", "drop-shadow(0 0 2px rgba(255, 255, 255, 0.7))");
      
      animateDataFlow(link, i);
    });
    
    function animateDataFlow(link: any, index: number) {
      const sourceNode = data.nodes.find(n => n.id === link.source);
      const targetNode = data.nodes.find(n => n.id === link.target);
      
      if (!sourceNode || !targetNode) return;
      
      const packetColor = d3.interpolateRgb(
        color(`${sourceNode.group}`),
        color(`${targetNode.group}`)
      )(0.5);
      
      d3.select(`.data-packet-${index}`)
        .attr("fill", packetColor)
        .style("opacity", 1)
        .attr("cx", sourceNode.x || width / 2)
        .attr("cy", sourceNode.y || height / 2)
        .transition()
        .duration(2000 + Math.random() * 3000)
        .ease(d3.easeCubicInOut)
        .attr("cx", targetNode.x || width / 2)
        .attr("cy", targetNode.y || height / 2)
        .style("opacity", 0)
        .on("end", () => {
          setTimeout(() => animateDataFlow(link, index), Math.random() * 5000);
        });
    }
    
    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as unknown as Node).x || 0)
        .attr("y1", d => (d.source as unknown as Node).y || 0)
        .attr("x2", d => (d.target as unknown as Node).x || 0)
        .attr("y2", d => (d.target as unknown as Node).y || 0);
      
      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });
    
    // Legend
    const legendX = 20;
    const legendY = 20;
    const legendSpacing = 20;
    
    const legend = svg.append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`);
    
    const legendItems = [
      { label: "Central Agent", group: 1 },
      { label: "Knowledge Base", group: 2 },
      { label: "Processor", group: 3 },
      { label: "Action Agent", group: 4 },
      { label: "Utility", group: 5 }
    ];
    
    legendItems.forEach((item, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * legendSpacing})`);
      
      legendItem.append("circle")
        .attr("r", 6)
        .attr("fill", color(`${item.group}`));
      
      legendItem.append("text")
        .attr("x", 12)
        .attr("y", 4)
        .text(item.label)
        .attr("font-size", "12px")
        .attr("fill", "#666");
    });
    
    // Clean up
    return () => {
      simulation.stop();
    };
  }, []);
  
  return (
    <div className="w-full h-[500px] relative">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default NetworkVisualization;
