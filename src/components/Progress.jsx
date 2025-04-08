const Progress = ({ progress, isLoading }) => {
    return (
        <div className="progress-container">
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ 
                        width: `${progress}%`,
                        transition: 'width 0.3s ease-in-out'
                    }}
                />
            </div>
            <div className="progress-text">
                {isLoading ? `Processing: ${progress}%` : 'Complete'}
            </div>
        </div>
    );
};

export default Progress;