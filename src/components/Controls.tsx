import React, { useState, useEffect } from 'react';

// Props for the Controls component
interface ControlsProps {
    searchTerm: string; // Current search term
    onSearchChange: (term: string) => void; // Callback to update search term
    filterArchetype: string | null; // Currently selected archetype filter
    onFilterChange: (archetype: string | null) => void; // Callback to update filter
    onOpenHelp: () => void; // Callback to open the help modal
}

// List of available archetypes and their associated colors
const ARCHETYPES = [
    { name: "Infrastructure Integrators", color: "#1F8C7D" },
    { name: "Vertical Specialists", color: "#E85D75" },
    { name: "Experience Designers", color: "#F5A623" },
    { name: "Facilitators & Enablers", color: "#4A90E2" },
    { name: "Community Builders", color: "#BD10E0" },
    { name: "Regulators & Standards Setters", color: "#7ED321" },
    { name: "Market Aggregators", color: "#B8E986" }
];

/**
 * Controls Component
 * Renders the search bar, filter buttons, and archetype legend.
 * Adapts layout for mobile devices (popup legend) vs desktop (inline legend).
 */
const Controls: React.FC<ControlsProps> = ({ searchTerm, onSearchChange, filterArchetype, onFilterChange, onOpenHelp }) => {
    // State to toggle the visibility of the desktop legend
    const [isLegendExpanded, setIsLegendExpanded] = useState(true);
    
    // State to track if the device is mobile (width <= 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // State to toggle the mobile legend popup
    const [showMobileLegend, setShowMobileLegend] = useState(false);

    // Effect to handle window resize and update mobile state
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="controls-container">
            {/* Search & Filter Button Panel */}
            <div className="glass-panel controls-search-panel">
                <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                    onBlur={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.3)'}
                />

                {/* Mobile Filter Button (Hamburger Menu) */}
                {isMobile && (
                    <button
                        className="mobile-filter-btn"
                        onClick={() => setShowMobileLegend(true)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: filterArchetype ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>☰</span>
                    </button>
                )}

                {/* Help Button */}
                <button
                    onClick={onOpenHelp}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(74, 144, 226, 0.2)',
                        color: '#4A90E2',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(74, 144, 226, 0.4)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
                        e.currentTarget.style.color = '#4A90E2';
                    }}
                    title="How to use"
                >
                    ?
                </button>
            </div>

            {/* Desktop Inline Legend (Hidden on Mobile) */}
            {!isMobile && (
                <div className="glass-panel controls-legend-panel">
                    <div 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: isLegendExpanded ? '12px' : '0',
                            cursor: 'pointer'
                        }}
                        onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                    >
                        <h3 style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Archetypes
                        </h3>
                        <div style={{ 
                            transform: isLegendExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '12px'
                        }}>
                            ▼
                        </div>
                    </div>

                    {isLegendExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                                onClick={() => onFilterChange(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: filterArchetype === null ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'transparent' }} />
                                <span style={{ fontSize: '13px', color: '#e0e0e0' }}>Show All</span>
                            </div>

                            {ARCHETYPES.map(arch => (
                                <div
                                    key={arch.name}
                                    onClick={() => onFilterChange(filterArchetype === arch.name ? null : arch.name)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        cursor: 'pointer',
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        backgroundColor: filterArchetype === arch.name ? `${arch.color}33` : 'transparent',
                                        border: filterArchetype === arch.name ? `1px solid ${arch.color}66` : '1px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: arch.color,
                                        boxShadow: `0 0 8px ${arch.color}`
                                    }} />
                                    <span style={{ fontSize: '13px', color: '#e0e0e0' }}>{arch.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Legend Popup (Visible only on Mobile when toggled) */}
            {isMobile && showMobileLegend && (
                <div className="mobile-legend-overlay" onClick={() => setShowMobileLegend(false)}>
                    <div 
                        className="glass-panel mobile-legend-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Filter by Archetype
                            </h3>
                            <button 
                                onClick={() => setShowMobileLegend(false)}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', padding: 0 }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div
                                onClick={() => { onFilterChange(null); setShowMobileLegend(false); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: filterArchetype === null ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'transparent' }} />
                                <span style={{ fontSize: '14px', color: '#e0e0e0' }}>Show All</span>
                            </div>

                            {ARCHETYPES.map(arch => (
                                <div
                                    key={arch.name}
                                    onClick={() => { onFilterChange(filterArchetype === arch.name ? null : arch.name); setShowMobileLegend(false); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: filterArchetype === arch.name ? `${arch.color}33` : 'rgba(255,255,255,0.05)',
                                        border: filterArchetype === arch.name ? `1px solid ${arch.color}66` : '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: arch.color,
                                        boxShadow: `0 0 8px ${arch.color}`
                                    }} />
                                    <span style={{ fontSize: '14px', color: '#e0e0e0' }}>{arch.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Controls;
