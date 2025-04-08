import { useState, useEffect, useRef } from 'react';
import StressAnalysis from './StressAnalysis';

const JobStatus = ({ jobId, status, onRefresh }) => {
    const [autoRefresh, setAutoRefresh] = useState(true);
    const startTimeRef = useRef(Date.now());
    const timeoutId = useRef(null);

    const progress = status?.result ? 100 : (status?.progress || 0);
    const isComplete = progress === 100;

    const handleRefresh = () => {
        onRefresh();
        // Only reset timer if auto-refresh is still enabled
        if (autoRefresh) {
            startTimeRef.current = Date.now();
        }
    };

    useEffect(() => {
        const checkTimeAndRefresh = () => {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTimeRef.current) / 1000;

            if (elapsedTime > 300) {
                setAutoRefresh(false);
                alert("Auto-refresh disabled: Process exceeded 5 minutes time limit. You can still refresh manually.");
                return;
            }

            if (autoRefresh && !isComplete) {
                handleRefresh();
                timeoutId.current = setTimeout(checkTimeAndRefresh, 5000);
            }
        };

        if (autoRefresh && !isComplete) {
            timeoutId.current = setTimeout(checkTimeAndRefresh, 5000);
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
                        onClick={handleRefresh} 
                        className="refresh-btn"
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
                {status?.result && (
                    <StressAnalysis result={status.result} />
                )}
            </div>
        </div>
    );
};

export default JobStatus;
