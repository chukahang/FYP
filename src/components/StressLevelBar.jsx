import React from 'react';

// Convert percentage to a stress level from 1-5
const getStressLevelFromPercentage = (percentage) => {
    if (percentage <= 20) return 1;
    if (percentage <= 40) return 2;
    if (percentage <= 60) return 3;
    if (percentage <= 80) return 4;
    return 5;
};

const StressLevelBar = ({ percentage }) => {
    const level = getStressLevelFromPercentage(percentage * 100);
    
    const getColor = (level) => {
        switch(level) {
            case 1: return '#4CAF50'; // Green
            case 2: return '#8BC34A'; // Light Green
            case 3: return '#FFC107'; // Yellow
            case 4: return '#FF9800'; // Orange
            case 5: return '#F44336'; // Red
            default: return '#E0E0E0';
        }
    };

    // Inline styles to ensure they're applied
    const containerStyle = {
        margin: '10px 0'
    };
    
    const textStyle = {
        marginBottom: '5px',
        fontSize: '0.875rem',
        color: 'var(--text-light)'
    };
    
    const barContainerStyle = {
        display: 'flex',
        height: '8px',
        borderRadius: '4px',
        overflow: 'hidden'
    };

    return (
        <div style={containerStyle}>
            <div style={textStyle}>
                Stress Level: {level}/5
            </div>
            <div style={barContainerStyle}>
                {[1, 2, 3, 4, 5].map((barLevel) => (
                    <div
                        key={barLevel}
                        style={{
                            flex: 1,
                            margin: '0 2px',
                            borderRadius: '2px',
                            backgroundColor: barLevel <= level ? getColor(barLevel) : '#E0E0E0',
                            transition: 'background-color 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default StressLevelBar;
