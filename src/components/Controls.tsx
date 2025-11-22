import React from 'react';

interface ControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterArchetype: string | null;
    onFilterChange: (archetype: string | null) => void;
    onOpenHelp: () => void;
}

const ARCHETYPES = [
    { name: "Infrastructure Integrators", color: "#1F8C7D" },
    { name: "Vertical Specialists", color: "#E85D75" },
    { name: "Experience Designers", color: "#F5A623" },
    { name: "Facilitators & Enablers", color: "#4A90E2" },
    { name: "Community Builders", color: "#BD10E0" },
    { name: "Regulators & Standards Setters", color: "#7ED321" },
    { name: "Market Aggregators", color: "#B8E986" }
];

const Controls: React.FC<ControlsProps> = ({ searchTerm, onSearchChange, filterArchetype, onFilterChange, onOpenHelp }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        }}>
            {/* Search */}
            <div className="glass-panel" style={{
                padding: '12px',
                borderRadius: '12px',
                width: '300px',
                display: 'flex',
                gap: '10px'
            }}>
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

            {/* Filters / Legend */}
            <div className="glass-panel" style={{
                padding: '16px',
                borderRadius: '12px',
                width: '300px'
            }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Archetypes</h3>
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
            </div>
        </div>
    );
};

export default Controls;
