import { useState, useEffect, useRef } from 'react';

const JobStatus = ({ jobId, status, onRefresh }) => {
    const [autoRefresh, setAutoRefresh] = useState(true);
    const startTimeRef = useRef(Date.now());
    const timeoutId = useRef(null);

    const progress = status?.result ? 100 : (status?.progress || 0);
    const isComplete = progress === 100;

    useEffect(() => {
        const refreshStatus = () => {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTimeRef.current) / 1000;

            if (elapsedTime > 300) {
                setAutoRefresh(false);
                alert("Process exceeded 5 minutes time limit");
                return;
            }

            if (autoRefresh && !isComplete) {
                onRefresh();
                timeoutId.current = setTimeout(refreshStatus, 5000);
            }
        };

        if (autoRefresh && !isComplete) {
            timeoutId.current = setTimeout(refreshStatus, 5000);
        }

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [autoRefresh, isComplete, onRefresh]);

    if (!jobId) return null;

    return (
        <div className="job-status">
            <div className="job-status-header">
                <h3>Analysis Result:</h3>
                {!isComplete && (
                    <button 
                        onClick={() => onRefresh()} 
                        className="refresh-btn"
                        disabled={!autoRefresh}
                    >
                        Refresh Status
                    </button>
                )}
            </div>
            <div className="job-details">
                <p><strong>Job ID:</strong> {jobId}</p>
                <div className="progress-bar-wrapper">
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        />
                        <span className="progress-text">{progress}%</span>
                    </div>
                </div>
                <div className="status-content">
                    <pre>{JSON.stringify(status, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default JobStatus;
