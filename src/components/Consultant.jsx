import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { getLatestVideoReport, getPersonalInfo, initializeChatWithContext } from '../services/api';
import useCache, { getCachedValue, setCachedValue } from '../hooks/useCache';
import './Consultant.css';

const Consultant = () => {
    const [videoReport, setVideoReport] = useState(null);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    // Use cache for consultation state to persist across page navigations
    const [showChat, setShowChat] = useCache('consultationStarted', false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [hasInitialized, setHasInitialized] = useCache('consultationInitialized', false);

    // Fetch the latest video report and personal information when the component mounts
    useEffect(() => {
        // Get video processing report from localStorage
        const report = getLatestVideoReport();
        setVideoReport(report);
        
        // Get personal information from localStorage
        const info = getPersonalInfo();
        setPersonalInfo(info);
        
        setDataLoaded(true);
    }, []);

    // Handle the button click to show chat interface and initialize it
    const handleStartConsultant = async () => {
        if (hasInitialized) {
            // If already initialized before, just show the chat
            setShowChat(true);
            return;
        }
        
        setIsInitializing(true);
        
        try {
            // If there's report or personal info, send it to the backend to initialize context
            if (videoReport || personalInfo) {
                await initializeChatWithContext(videoReport, personalInfo);
            }
            // Mark as initialized in the cache so we don't reinitialize on page refresh
            setHasInitialized(true);
        } catch (error) {
            console.error('Error initializing chat with context:', error);
            // We'll still show the chat interface even if initialization fails
        } finally {
            setIsInitializing(false);
            setShowChat(true); // Show the chat interface after initialization attempt
        }
    };

    return (
        <div className="consultant-container">
            <div style={{ width: '800px', margin: '0 auto' }}>
                <h2>AI Mental Health Consultant</h2>
                
                {/* Show badges only when chat is visible and data is loaded */}
                {showChat && dataLoaded && (
                    <div className="consultant-status">
                        {videoReport && (
                            <div className="data-badge video-data-available">
                                Video Analysis Available
                            </div>
                        )}
                        {personalInfo && (
                            <div className="data-badge personal-data-available">
                                Personal Info Available
                            </div>
                        )}
                    </div>
                )}
                
                {/* Hidden until button is clicked or if already started in a previous session */}
                {showChat ? (
                    <div className="consultant-content">
                        <ChatInterface
                            videoReport={videoReport}
                            personalInfo={personalInfo}
                            isInitialized={hasInitialized}
                        />
                    </div>
                ) : (
                    <div className="start-consultant-container">
                        <p>Start a conversation with our AI Mental Health Consultant</p>
                        <button 
                            className="start-consultant-button"
                            onClick={handleStartConsultant}
                            disabled={isInitializing}
                        >
                            {isInitializing ? 'Starting...' : 'Start Consultant'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultant;