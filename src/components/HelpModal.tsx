import React from 'react';

// Props for the HelpModal component
interface HelpModalProps {
    isOpen: boolean; // Controls visibility of the modal
    onClose: () => void; // Callback to close the modal
}

/**
 * HelpModal Component
 * Displays a modal overlay with instructions on how to use the application.
 * Explains the map legend, interactions, and tips.
 */
const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    return (
        // Modal Overlay (Dark background with blur)
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }} onClick={onClose}>
            {/* Modal Content Container */}
            <div
                className="glass-panel animate-fade-in"
                style={{
                    width: '600px',
                    maxWidth: '90%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    padding: '32px',
                    borderRadius: '24px',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.5)',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                    ×
                </button>

                <h2 style={{
                    marginTop: 0,
                    fontSize: '28px',
                    background: 'linear-gradient(90deg, #4A90E2, #BD10E0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '24px'
                }}>
                    How to Read the Map
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

                    {/* Section 1: The Basics */}
                    <div>
                        <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                            The Basics
                        </h3>

                        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#F5A623', border: '2px solid #fff', boxShadow: '0 0 10px #F5A623' }}></div>
                            <div>
                                <strong style={{ color: '#e0e0e0', display: 'block' }}>Nodes (Circles)</strong>
                                <span style={{ color: '#aaa', fontSize: '13px' }}>Represent players in the ecosystem (Companies, Banks, etc.).</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <div style={{ width: '40px', height: '2px', background: '#555', marginTop: '8px', position: 'relative' }}>
                                <div style={{ position: 'absolute', right: 0, top: '-4px', width: 0, height: 0, borderLeft: '5px solid #555', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }}></div>
                            </div>
                            <div>
                                <strong style={{ color: '#e0e0e0', display: 'block' }}>Links (Lines)</strong>
                                <span style={{ color: '#aaa', fontSize: '13px' }}>Show business relationships. Arrows point to who they connect TO.</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(45deg, #1F8C7D, #BD10E0)' }}></div>
                            <div>
                                <strong style={{ color: '#e0e0e0', display: 'block' }}>Colors</strong>
                                <span style={{ color: '#aaa', fontSize: '13px' }}>Indicate the "Archetype" or role of the player (e.g., Teal = Infrastructure).</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Controls */}
                    <div>
                        <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                            Interactions
                        </h3>

                        <ul style={{ paddingLeft: '20px', color: '#aaa', fontSize: '14px', lineHeight: '1.8' }}>
                            <li><strong style={{ color: '#fff' }}>Click a Node</strong> to see detailed stats, revenue, and connections.</li>
                            <li><strong style={{ color: '#fff' }}>Drag Nodes</strong> to rearrange the map and explore clusters.</li>
                            <li><strong style={{ color: '#fff' }}>Scroll</strong> to Zoom in/out.</li>
                            <li><strong style={{ color: '#fff' }}>Search</strong> to find specific companies instantly.</li>
                            <li><strong style={{ color: '#fff' }}>Filter</strong> by clicking archetypes in the legend to focus on specific sectors.</li>
                        </ul>
                    </div>

                </div>

                <div style={{
                    marginTop: '32px',
                    padding: '16px',
                    background: 'rgba(74, 144, 226, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(74, 144, 226, 0.2)'
                }}>
                    <strong style={{ color: '#4A90E2', display: 'block', marginBottom: '4px' }}>💡 Pro Tip</strong>
                    <span style={{ color: '#ccc', fontSize: '13px' }}>
                        Look for the <span style={{ color: '#00ff64' }}>Green Text</span> in the Info Panel. This shows <strong>Real World Data</strong> contrasts for major players like Uber and Ryanair!
                    </span>
                </div>

            </div>
        </div>
    );
};

export default HelpModal;
