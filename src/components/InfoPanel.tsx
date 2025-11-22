import React from 'react';

interface InfoPanelProps {
    node: any;
    allNodes: any[];
    onClose: () => void;
}

const REAL_DATA: Record<string, { revenue: string; year: string; source: string }> = {
    "P001": { revenue: "€13.44B", year: "2024", source: "Ryanair FY24 Report" },
    "P010": { revenue: "$44B (~€40B)", year: "2024", source: "Uber FY24" },
    "P007": { revenue: "$23.7B (~€21.8B)", year: "2024", source: "Booking Holdings FY24" },
    "P005": { revenue: "$25.1B (~€23B)", year: "2024", source: "Marriott FY24" },
    "P153": { revenue: "$6.2B (Proj.)", year: "2024", source: "Trip.com Group Analysis" },
    "P154": { revenue: "$6.8M", year: "2023", source: "Virgin Galactic FY23" }
};

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
    "Infrastructure Integrators": "Builds and manages the core physical and digital rails of travel.",
    "Vertical Specialists": "Focuses on deep expertise in specific travel niches.",
    "Experience Designers": "Creates unique, end-to-end travel moments and journeys.",
    "Facilitators & Enablers": "Provides the financial, technical, and logistical tools to make travel happen.",
    "Community Builders": "Connects travelers, fosters engagement, and drives demand through social proof.",
    "Regulators & Standards Setters": "Sets the rules, safety standards, and policies for the industry.",
    "Market Aggregators": "Brings supply and demand together at scale, often acting as the primary search interface."
};

const InfoPanel: React.FC<InfoPanelProps> = ({ node, allNodes, onClose }) => {
    if (!node) return null;

    const realData = REAL_DATA[node.id];

    // Helper to get name from ID
    const getName = (id: string) => {
        const found = allNodes.find(n => n.id === id);
        return found ? found.name : id;
    };

    return (
        <div className="glass-panel animate-fade-in" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '400px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '32px',
            zIndex: 1000,
            borderLeft: `6px solid ${node.color}`,
            color: '#e0e0e0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '28px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)',
                    transition: 'color 0.2s',
                    lineHeight: 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
                ×
            </button>

            {/* Header Section */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: node.color,
                    fontWeight: 700,
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {node.segment}
                    {realData && (
                        <span style={{
                            backgroundColor: 'rgba(0, 255, 100, 0.1)',
                            color: '#00ff64',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            border: '1px solid rgba(0, 255, 100, 0.3)'
                        }}>
                            VERIFIED
                        </span>
                    )}
                </div>

                <h2 style={{
                    margin: 0,
                    fontSize: '32px',
                    fontWeight: 800,
                    lineHeight: '1.1',
                    background: `linear-gradient(180deg, #fff, #aaa)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '16px'
                }}>
                    {node.name}
                </h2>

                {/* Archetypes with Context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {node.archetype.map((arch: string) => (
                        <div key={arch} style={{
                            background: `rgba(255,255,255,0.05)`,
                            border: `1px solid rgba(255,255,255,0.1)`,
                            borderRadius: '12px',
                            padding: '10px 14px'
                        }}>
                            <div style={{
                                color: node.color,
                                fontWeight: 600,
                                fontSize: '13px',
                                marginBottom: '4px'
                            }}>
                                {arch}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                                {ARCHETYPE_DESCRIPTIONS[arch] || "Plays a key role in the ecosystem."}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overview */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '1px' }}>Overview</h3>
                <p style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: 'rgba(255,255,255,0.9)',
                    margin: 0,
                    fontWeight: 300
                }}>
                    {node.description}
                </p>
            </div>

            {/* Financials */}
            <div style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '32px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💰</span> Market Scale
                </h3>

                {realData ? (
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#00ff64', marginBottom: '4px' }}>{realData.revenue}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            Verified {realData.year} Revenue • Source: {realData.source}
                        </div>
                        {node.market_size && node.market_size !== realData.revenue && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                                Original Model Estimate: {node.market_size}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{node.market_size || 'Data Unavailable'}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            Estimated Market Size
                        </div>
                    </div>
                )}
            </div>

            {/* Business Model */}
            {node.business_model && (
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '1px' }}>Revenue Model</h3>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '16px',
                        borderRadius: '12px',
                        borderLeft: '2px solid rgba(255,255,255,0.2)'
                    }}>
                        <p style={{ margin: 0, lineHeight: '1.5', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{node.business_model}</p>
                    </div>
                </div>
            )}

            {/* Connections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <div>
                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Connects To ({node.outbound.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {node.outbound.map((id: string) => (
                            <div key={id} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: node.color, opacity: 0.8 }}>→</span> {getName(id)}
                            </div>
                        ))}
                        {node.outbound.length === 0 && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No direct outbound links</span>}
                    </div>
                </div>
                <div>
                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Referenced By ({node.inbound.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {node.inbound.map((id: string) => (
                            <div key={id} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: node.color, opacity: 0.8 }}>←</span> {getName(id)}
                            </div>
                        ))}
                        {node.inbound.length === 0 && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No inbound references</span>}
                    </div>
                </div>
            </div>

            {/* Footer ID */}
            <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>ID: {node.id}</span>
            </div>

        </div>
    );
};

export default InfoPanel;
