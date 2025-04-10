import StressLevelBar from './StressLevelBar';

const StressAnalysis = ({ result }) => {
    const { text_analysis, acoustic_analysis, visual_analysis } = result?.detailed_results || {};
    const models = [
        {
            name: 'Text Analysis',
            data: text_analysis,
            icon: '📝',
            color: '#4CAF50'
        },
        {
            name: 'Acoustic Analysis',
            data: acoustic_analysis,
            icon: '🎤',
            color: '#2196F3'
        },
        {
            name: 'Visual Analysis',
            data: visual_analysis,
            icon: '👁️',
            color: '#9C27B0'
        }
    ];

    if (!result) return null;

    return (
        <div className="stress-analysis">
            <h4>Stress Analysis Results</h4>
            <div className="analysis-grid">
                {models.map((model, index) => (
                    <div key={index} className="analysis-card">
                        <div className="card-header" style={{ backgroundColor: model.color }}>
                            <span className="model-icon">{model.icon}</span>
                            <h5>{model.name}</h5>
                        </div>
                        <div className="card-content">
                            {model.data?.error ? (
                                <div className="error-message">{model.data.error}</div>
                            ) : (
                                <>
                                    <div className="metric">
                                        <span>Status:</span>
                                        <span className={`prediction ${model.data?.prediction === 1 ? 'stress' : 'no-stress'}`}>
                                            {model.data?.prediction === 1 ? 'Under Stress' : 'No Stress'}
                                        </span>
                                    </div>
                                    <div className="metric">
                                        <span>Stress Level:</span>
                                        <StressLevelBar percentage={model.data?.probability || 0} />
                                        
                                        {model.data?.confidence_level && (
                                            <div className="confidence-level">
                                                Confidence: <span className={`confidence-${model.data.confidence_level.toLowerCase()}`}>
                                                    {model.data.confidence_level}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="overall-summary">
                <h5>Overall Assessment</h5>
                <div className="summary-details">
                    <div className="combined-score">
                        Combined Stress Score: {(result.summary.combined_score * 100).toFixed(1)}%
                    </div>
                    <div className="risk-level">
                        Risk Level: <span className={`risk-${result.summary.risk_level.toLowerCase()}`}>
                            {result.summary.risk_level}
                        </span>
                    </div>
                    <p>{result.summary.interpretation}</p>
                </div>
            </div>
        </div>
    );
};

export default StressAnalysis;