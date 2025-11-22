import re
import json

def parse_data(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Archetype color mapping
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
    
    # Split by player blocks (PXXX:)
    # We look for lines starting with P\d+: or P\d+-\d+:
    # But the format is "P001: Ryanair"
    
    # Let's iterate line by line to be safer
    lines = content.split('\n')
    
    current_node = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for new player
        # Handle ranges like P108-P111:
        range_match = re.match(r'^(P\d+)-(P\d+): (.+)', line)
        player_match = re.match(r'^(P\d+): (.+)', line)
        
        if range_match or player_match:
            if current_node:
                # If we were processing a range previously, we need to save it for all IDs
                # But simpler: we just save the current_node once, and if it was a range, we duplicate it in the 'nodes' list later?
                # No, let's just append current_node to nodes.
                # But wait, if the previous one was a range, we haven't implemented that yet.
                # Let's just append the current_node (which is a single dict) to nodes list.
                # If we are starting a NEW node, we save the OLD one.
                nodes.append(current_node)
            
            if range_match:
                start_id = range_match.group(1)
                end_id = range_match.group(2)
                name = range_match.group(3)
                
                # We'll create a special node object that we'll expand later or just flag it
                current_node = {
                    "id": f"{start_id}-{end_id}", # Placeholder
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
                player_id = player_match.group(1)
                player_name = player_match.group(2)
                
                current_node = {
                    "id": player_id,
                    "name": player_name,
                    "segment": "",
                    "archetype": [],
                    "color": "#999999",
                    "description": "",
                    "market_size": "",
                    "business_model": "",
                    "outbound": [],
                    "inbound": []
                }
            continue
            
        if current_node:
            if line.startswith("- Segment:"):
                current_node["segment"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Archetype:"):
                arch_str = line.split(":", 1)[1].strip()
                # Extract archetypes
                # Example: Infrastructure Integrators (Teal) + Vertical Specialists (Pink)
                # We just need to match the keys in our map
                found_colors = []
                found_archs = []
                for arch, color in archetype_colors.items():
                    if arch in arch_str:
                        found_colors.append(color)
                        found_archs.append(arch)
                
                if found_colors:
                    current_node["color"] = found_colors[0] # Primary color
                current_node["archetype"] = found_archs
                
            elif line.startswith("- Description:"):
                current_node["description"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Market Size:"):
                current_node["market_size"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Business Model:"):
                current_node["business_model"] = line.split(":", 1)[1].strip()
            elif line.startswith("- Outbound Connections:") or line.startswith("- Connections:"):
                # Some entries just say "Connections:" which implies outbound usually or mutual?
                # The prompt says "Connections: ..." for Training & Talent section.
                # Let's assume Connections -> Outbound for simplicity or check context.
                # Actually, looking at P056, it lists P005, etc.
                # Let's treat "Connections" as Outbound for graph purposes if not specified.
                
                conns_str = line.split(":", 1)[1].strip()
                # Extract Pxxx
                conns = re.findall(r'P\d+', conns_str)
                current_node["outbound"] = conns
                
            elif line.startswith("- Inbound Connections:"):
                conns_str = line.split(":", 1)[1].strip()
                conns = re.findall(r'P\d+', conns_str)
                current_node["inbound"] = conns

    if current_node:
        nodes.append(current_node)

    # Expand ranges
    expanded_nodes = []
    for node in nodes:
        if node.get("is_range"):
            start = node["start_id"]
            end = node["end_id"]
            base_name = node["name"]
            for i in range(start, end + 1):
                new_node = node.copy()
                new_node["id"] = f"P{i:03d}"
                # If the name was generic like "Banks", keep it or append ID?
                # The user prompt had "Banks (Intesa...)"
                # Let's keep the base name but maybe append ID if it's not unique?
                # Actually, for the graph, "Banks (Intesa...) 108" is fine.
                new_node["name"] = f"{base_name} {i}"
                del new_node["is_range"]
                del new_node["start_id"]
                del new_node["end_id"]
                expanded_nodes.append(new_node)
        else:
            expanded_nodes.append(node)
            
    # Deduplicate nodes by ID (Last one wins)
    nodes_map = {}
    for node in expanded_nodes:
        nodes_map[node["id"]] = node
        
    nodes = list(nodes_map.values())

    # Deduplicate nodes by ID (Last one wins)
    nodes_map = {}
    for node in expanded_nodes:
        # Initialize/Reset inbound to empty list for clean recalculation
        node["inbound"] = []
        nodes_map[node["id"]] = node
        
    nodes = list(nodes_map.values())

    # Generate links and recalculate Inbound connections
    # We treat "Outbound" as the source of truth for the graph structure.
    
    valid_links = []
    
    for node in nodes:
        source_id = node["id"]
        # Filter outbound to only valid targets
        valid_outbound = []
        
        for target_id in node["outbound"]:
            if target_id in nodes_map:
                valid_outbound.append(target_id)
                # Add source to target's inbound
                if source_id not in nodes_map[target_id]["inbound"]:
                    nodes_map[target_id]["inbound"].append(source_id)
                
                valid_links.append({
                    "source": source_id,
                    "target": target_id,
                    "type": "outbound"
                })
            else:
                print(f"Warning: Node {source_id} points to non-existent target {target_id}")
        
        # Update the node's outbound to only contain valid links
        node["outbound"] = valid_outbound

    links = valid_links
    
    output = {
        "nodes": nodes,
        "links": links
    }
    
    with open('src/data.json', 'w') as f:
        json.dump(output, f, indent=2)
        
    print(f"Parsed {len(nodes)} nodes and {len(links)} links.")

if __name__ == "__main__":
    parse_data('raw_data.txt')
