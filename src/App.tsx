import { useState } from 'react';
import Graph from './components/Graph';
import InfoPanel from './components/InfoPanel';
import Controls from './components/Controls';
import HelpModal from './components/HelpModal';
import data from './data.json';
import './App.css';

/**
 * Main Application Component
 * Orchestrates the state and layout of the application.
 */
function App() {
  // State for the currently selected node (displayed in InfoPanel)
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // State for the active archetype filter
  const [filterArchetype, setFilterArchetype] = useState<string | null>(null);
  
  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the help modal visibility
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  /**
   * Handler for node clicks in the Graph component.
   * Updates the selected node state.
   */
  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="App">
      {/* Controls: Search bar and Archetype filter legend */}
      <Controls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterArchetype={filterArchetype}
        onFilterChange={setFilterArchetype}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Graph: The main force-directed graph visualization */}
      <Graph
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNode ? selectedNode.id : null}
        filterArchetype={filterArchetype}
        searchTerm={searchTerm}
      />

      {/* InfoPanel: Details of the selected node (Slide-over on desktop, Fullscreen on mobile) */}
      <InfoPanel
        node={selectedNode}
        allNodes={data.nodes}
        onClose={() => setSelectedNode(null)}
      />

      {/* HelpModal: Instructions and legend explanation */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Footer / Watermark */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: '#999',
        fontSize: '12px',
        pointerEvents: 'none'
      }}>
        Travel & Tourism Ecosystem Map
      </div>
    </div>
  );
}

export default App;
