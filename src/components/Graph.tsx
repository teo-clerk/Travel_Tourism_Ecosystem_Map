import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import data from '../data.json';

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

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    type?: string;
}

interface GraphProps {
    onNodeClick: (node: Node | null) => void;
    selectedNodeId: string | null;
    filterArchetype: string | null;
    searchTerm: string;
}

const Graph: React.FC<GraphProps> = ({ onNodeClick, selectedNodeId, filterArchetype, searchTerm }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = dimensions.width;
        const height = dimensions.height;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        // Filter nodes based on archetype
        let nodes: Node[] = data.nodes.map(d => ({ ...d })) as Node[];
        let links: Link[] = data.links.map(d => ({ ...d })) as Link[];

        if (filterArchetype) {
            const validIds = new Set(nodes.filter(n => n.archetype.includes(filterArchetype)).map(n => n.id));
            nodes = nodes.filter(n => validIds.has(n.id));
            links = links.filter(l => validIds.has(l.source as string) && validIds.has(l.target as string));
        }

        // Zoom behavior
        const g = svg.append("g");
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        svg.call(zoom);

        // Simulation
        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(30));

        // Glow filters
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

        // Arrow marker (Dark mode style)
        defs.selectAll("marker")
            .data(["end"])
            .enter().append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 28) // Adjusted for larger node border
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#555");

        // Links
        const link = g.append("g")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.3)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrow)");

        // Nodes
        const node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 6) // Smaller, sleeker nodes
            .attr("fill", "#000") // Black center
            .attr("stroke", d => d.color)
            .attr("stroke-width", 2)
            .style("filter", "url(#glow)") // Apply glow
            .style("cursor", "pointer")
            .call(d3.drag<SVGCircleElement, Node>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended) as any);

        // Labels
        const label = g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(d => d.name)
            .attr("font-size", "8px")
            .attr("fill", "#aaa")
            .style("pointer-events", "none")
            .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)");

        // Tooltip interaction
        node.on("click", (event, d) => {
            event.stopPropagation();
            onNodeClick(d);
        });

        svg.on("click", () => {
            onNodeClick(null);
        });

        // Highlight logic
        if (selectedNodeId) {
            // Dim everything
            node.attr("opacity", 0.1);
            link.attr("opacity", 0.1);
            label.attr("opacity", 0.1);

            // Highlight selected and neighbors
            const connectedIds = new Set<string>();
            connectedIds.add(selectedNodeId);

            // Find neighbors
            links.forEach(l => {
                const s = (l.source as Node).id;
                const t = (l.target as Node).id;
                if (s === selectedNodeId) connectedIds.add(t);
                if (t === selectedNodeId) connectedIds.add(s);
            });

            node.filter(d => connectedIds.has(d.id))
                .attr("opacity", 1)
                .attr("r", d => d.id === selectedNodeId ? 30 : 20); // Expand selected

            link.filter(l => {
                const s = (l.source as Node).id;
                const t = (l.target as Node).id;
                return connectedIds.has(s) && connectedIds.has(t); // Only links between highlighted nodes? 
                // Or links connected to selected?
                // Prompt: "All outbound edges highlight... All inbound edges highlight"
                // So links connected to selectedNodeId
                return s === selectedNodeId || t === selectedNodeId;
            })
                .attr("opacity", 1)
                .attr("stroke", "#555")
                .attr("stroke-width", 2);

            label.filter(d => connectedIds.has(d.id))
                .attr("opacity", 1);
        }

        // Search highlight
        if (searchTerm && !selectedNodeId) {
            const lowerTerm = searchTerm.toLowerCase();
            const matchedNodes = nodes.filter(n => n.name.toLowerCase().includes(lowerTerm));
            const matchedIds = new Set(matchedNodes.map(n => n.id));

            if (matchedIds.size > 0) {
                node.attr("opacity", d => matchedIds.has(d.id) ? 1 : 0.1);
                label.attr("opacity", d => matchedIds.has(d.id) ? 1 : 0.1);
                link.attr("opacity", 0.05);
            }
        }

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

        function dragstarted(event: any, d: Node) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: Node) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: Node) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

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
