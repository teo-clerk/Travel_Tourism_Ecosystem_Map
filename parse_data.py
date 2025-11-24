import re
import json

def parse_data(filename):
    """
    Parses a raw text file containing structured data about ecosystem players
    and converts it into a JSON format suitable for the graph visualization.
    
    Args:
        filename (str): Path to the input text file.
    """
    with open(filename, 'r') as f:
        content = f.read()

    # Mapping of Archetype names to specific hex colors for visualization
    archetype_colors = {
        "Infrastructure Integrators": "#1F8C7D",
        "Vertical Specialists": "#E85D75",
        "Experience Designers": "#F5A623",
        "Facilitators & Enablers": "#4A90E2",
        "Community Builders": "#BD10E0",
        "Regulators & Standards Setters": "#7ED321",
        "Market Aggregators": "#B8E986"
    }

    nodes = []
    links = []
    
    # Split content by lines to process each entry sequentially
    lines = content.split('\n')
    
    current_node = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for the start of a new player entry
        # Matches formats like "P001: Name" or ranges "P108-P111: Name"
        range_match = re.match(r'^(P\d+)-(P\d+): (.+)', line)
        player_match = re.match(r'^(P\d+): (.+)', line)
        
        if range_match or player_match:
            # Save the previous node if it exists before starting a new one
            if current_node:
                nodes.append(current_node)
            
            if range_match:
                # Handle ID ranges (e.g., P108-P111)
                start_id = range_match.group(1)
                end_id = range_match.group(2)
                name = range_match.group(3)
                
                # Create a temporary node object representing the range
                current_node = {
                    "id": f"{start_id}-{end_id}", 
                    "is_range": True,
                    "start_id": int(start_id[1:]),
                    "end_id": int(end_id[1:]),
                    "name": name,
                    "segment": "",
                    "archetype": [],
                    "color": "#999999",
                    "description": "",
                    "market_size": "",
                    "business_model": "",
                    "outbound": [],
                    "inbound": []
                }
            else:
                # Handle single player entry
                player_id = player_match.group(1)
                player_name = player_match.group(2)
                
                current_node = {
                    "id": player_id,
                    "name": player_name,
                    "segment": "",
                    "archetype": [],
                    "color": "#999999", # Default color
                    "description": "",
                    "market_size": "",
                    "business_model": "",
                    "outbound": [],
                    "inbound": []
                }
            continue
            
        # Parse attributes for the current node
        if current_node:
            if line.startswith("- Segment:"):
                current_node["segment"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Archetype:"):
                arch_str = line.split(":", 1)[1].strip()
                
                # Identify archetypes and assign corresponding colors
                found_colors = []
                found_archs = []
                for arch, color in archetype_colors.items():
                    if arch in arch_str:
                        found_colors.append(color)
                        found_archs.append(arch)
                
                if found_colors:
                    current_node["color"] = found_colors[0] # Use the first matched color
                current_node["archetype"] = found_archs
                
            elif line.startswith("- Description:"):
                current_node["description"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Market Size:"):
                current_node["market_size"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Business Model:"):
                current_node["business_model"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Outbound Connections:") or line.startswith("- Connections:"):
                # Extract outbound connection IDs (e.g., P001, P002)
                conns_str = line.split(":", 1)[1].strip()
                conns = re.findall(r'P\d+', conns_str)
                current_node["outbound"] = conns
                
            elif line.startswith("- Inbound Connections:"):
                # Extract inbound connection IDs
                conns_str = line.split(":", 1)[1].strip()
                conns = re.findall(r'P\d+', conns_str)
                current_node["inbound"] = conns

    # Append the last node being processed
    if current_node:
        nodes.append(current_node)

    # Expand nodes that represented a range of IDs into individual nodes
    expanded_nodes = []
    for node in nodes:
        if node.get("is_range"):
            start = node["start_id"]
            end = node["end_id"]
            base_name = node["name"]
            for i in range(start, end + 1):
                new_node = node.copy()
                new_node["id"] = f"P{i:03d}"
                new_node["name"] = f"{base_name} {i}"
                # Remove range-specific temporary keys
                del new_node["is_range"]
                del new_node["start_id"]
                del new_node["end_id"]
                expanded_nodes.append(new_node)
        else:
            expanded_nodes.append(node)
            
    # Deduplicate nodes by ID (keeping the last occurrence)
    nodes_map = {}
    for node in expanded_nodes:
        node["inbound"] = [] # Reset inbound for clean recalculation based on outbound
        nodes_map[node["id"]] = node
        
    nodes = list(nodes_map.values())

    # Generate links and recalculate Inbound connections
    # We use "Outbound" connections as the source of truth for the graph structure.
    valid_links = []
    
    for node in nodes:
        source_id = node["id"]
        valid_outbound = []
        
        for target_id in node["outbound"]:
            if target_id in nodes_map:
                valid_outbound.append(target_id)
                
                # Automatically populate the target's inbound list
                if source_id not in nodes_map[target_id]["inbound"]:
                    nodes_map[target_id]["inbound"].append(source_id)
                
                # Create a link object for D3
                valid_links.append({
                    "source": source_id,
                    "target": target_id,
                    "type": "outbound"
                })
            else:
                print(f"Warning: Node {source_id} points to non-existent target {target_id}")
        
        # Update the node's outbound list to only contain valid IDs
        node["outbound"] = valid_outbound

    links = valid_links
    
    # Prepare final output structure
    output = {
        "nodes": nodes,
        "links": links
    }
    
    # Write parsed data to JSON file
    with open('src/data.json', 'w') as f:
        json.dump(output, f, indent=2)
        
    print(f"Parsed {len(nodes)} nodes and {len(links)} links.")

if __name__ == "__main__":
    parse_data('raw_data.txt')
