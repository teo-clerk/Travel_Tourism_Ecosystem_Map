import { useState } from 'react';
import Graph from './components/Graph';
import InfoPanel from './components/InfoPanel';
import Controls from './components/Controls';
import HelpModal from './components/HelpModal';
import data from './data.json';
import './App.css';

function App() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterArchetype, setFilterArchetype] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="App">
      <Controls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterArchetype={filterArchetype}
        onFilterChange={setFilterArchetype}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <Graph
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNode ? selectedNode.id : null}
        filterArchetype={filterArchetype}
        searchTerm={searchTerm}
      />

      <InfoPanel
        node={selectedNode}
        allNodes={data.nodes}
        onClose={() => setSelectedNode(null)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

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
