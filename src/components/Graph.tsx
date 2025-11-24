import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import data from '../data.json';

// Interface for Node data extending D3's simulation node datum
interface Node extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    segment: string;
    archetype: string[];
    color: string;
    description: string;
    market_size: string;
    business_model: string;
    outbound: string[];
    inbound: string[];
    x?: number;
    y?: number;
}

// Interface for Link data extending D3's simulation link datum
interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    type?: string;
}

// Props for the Graph component
interface GraphProps {
    onNodeClick: (node: Node | null) => void; // Callback when a node is clicked
    selectedNodeId: string | null; // ID of the currently selected node
    filterArchetype: string | null; // Currently active archetype filter
    searchTerm: string; // Current search term
}

/**
 * Graph Component
 * Renders a force-directed graph using D3.js.
 * Handles user interactions like zooming, panning, dragging, and clicking nodes.
 */
const Graph: React.FC<GraphProps> = ({ onNodeClick, selectedNodeId, filterArchetype, searchTerm }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    // State to track window dimensions for responsive graph resizing
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Effect to handle window resize events
    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Main D3 rendering effect
    useEffect(() => {
        if (!svgRef.current) return;

        const width = dimensions.width;
        const height = dimensions.height;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render to avoid duplicates

        // Deep copy data to avoid mutating the original import during D3 simulation
        let nodes: Node[] = data.nodes.map(d => ({ ...d })) as Node[];
        let links: Link[] = data.links.map(d => ({ ...d })) as Link[];

        // Apply Archetype Filter
        if (filterArchetype) {
            const validIds = new Set(nodes.filter(n => n.archetype.includes(filterArchetype)).map(n => n.id));
            nodes = nodes.filter(n => validIds.has(n.id));
            links = links.filter(l => validIds.has(l.source as string) && validIds.has(l.target as string));
        }

        // Initialize Zoom behavior
        const g = svg.append("g");
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4]) // Min and max zoom levels
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        svg.call(zoom);

        // Initialize Force Simulation
        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100)) // Link distance
            .force("charge", d3.forceManyBody().strength(-300)) // Repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2)) // Center gravity
            .force("collide", d3.forceCollide().radius(30)); // Collision detection to prevent overlap

        // Define Glow Filters (for visual aesthetics)
        const defs = svg.append("defs");

        const filter = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        filter.append("feGaussianBlur")
            .attr("stdDeviation", "2.5")
            .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Define Arrow Marker for directed links
        defs.selectAll("marker")
            .data(["end"])
            .enter().append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 28) // Offset to not overlap with node
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#555");

        // Render Links
        const link = g.append("g")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.3)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrow)");

        // Render Nodes
        const node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 6) // Node radius
            .attr("fill", "#000") // Node background
            .attr("stroke", d => d.color) // Node border color based on archetype
            .attr("stroke-width", 2)
            .style("filter", "url(#glow)") // Apply glow effect
            .style("cursor", "pointer")
            .call(d3.drag<SVGCircleElement, Node>() // Enable dragging
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended) as any);

        // Render Labels
        const label = g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("dy", 20) // Offset label below node
            .attr("text-anchor", "middle")
            .text(d => d.name)
            .attr("font-size", "8px")
            .attr("fill", "#aaa")
            .style("pointer-events", "none") // Allow clicks to pass through to nodes/canvas
            .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)");

        // Handle Node Click
        node.on("click", (event, d) => {
            event.stopPropagation(); // Prevent background click
            onNodeClick(d);
        });

        // Handle Background Click (Deselect)
        svg.on("click", () => {
            onNodeClick(null);
        });

        // Handle Selection Highlighting
        if (selectedNodeId) {
            // Dim all elements by default
            node.attr("opacity", 0.1);
            link.attr("opacity", 0.1);
            label.attr("opacity", 0.1);

            // Identify connected nodes
            const connectedIds = new Set<string>();
            connectedIds.add(selectedNodeId);

            // Find neighbors of the selected node
            links.forEach(l => {
                const s = (l.source as Node).id;
                const t = (l.target as Node).id;
                if (s === selectedNodeId) connectedIds.add(t);
                if (t === selectedNodeId) connectedIds.add(s);
            });

            // Highlight selected node and its neighbors
            node.filter(d => connectedIds.has(d.id))
                .attr("opacity", 1)
                .attr("r", d => d.id === selectedNodeId ? 30 : 20); // Enlarge selected node

            // Highlight links connected to the selected node
            link.filter(l => {
                const s = (l.source as Node).id;
                const t = (l.target as Node).id;
                return s === selectedNodeId || t === selectedNodeId;
            })
                .attr("opacity", 1)
                .attr("stroke", "#555")
                .attr("stroke-width", 2);

            // Highlight labels of selected node and neighbors
            label.filter(d => connectedIds.has(d.id))
                .attr("opacity", 1);
        }

        // Handle Search Highlighting
        if (searchTerm && !selectedNodeId) {
            const lowerTerm = searchTerm.toLowerCase();
            const matchedNodes = nodes.filter(n => n.name.toLowerCase().includes(lowerTerm));
            const matchedIds = new Set(matchedNodes.map(n => n.id));

            if (matchedIds.size > 0) {
                // Dim non-matching nodes
                node.attr("opacity", d => matchedIds.has(d.id) ? 1 : 0.1);
                label.attr("opacity", d => matchedIds.has(d.id) ? 1 : 0.1);
                link.attr("opacity", 0.05);
            }
        }

        // Update positions on every simulation tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as Node).x!)
                .attr("y1", d => (d.source as Node).y!)
                .attr("x2", d => (d.target as Node).x!)
                .attr("y2", d => (d.target as Node).y!);

            node
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);

            label
                .attr("x", d => d.x!)
                .attr("y", d => d.y!);
        });

        // Drag Event Handlers
        function dragstarted(event: any, d: Node) {
            if (!event.active) simulation.alphaTarget(0.3).restart(); // Re-heat simulation
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: Node) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: Node) {
            if (!event.active) simulation.alphaTarget(0); // Cool down simulation
            d.fx = null; // Release fixed position
            d.fy = null;
        }

        // Cleanup function to stop simulation on unmount
        return () => {
            simulation.stop();
        };
    }, [dimensions, filterArchetype, selectedNodeId, searchTerm]);

    return (
        <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ width: '100%', height: '100vh', display: 'block', cursor: 'grab' }}
        />
    );
};

export default Graph;
