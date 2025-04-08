import { useState } from 'react';

const VideoList = ({ videos, onVideoSelect, onVideoDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                className="video-list-trigger"
                onClick={() => setIsOpen(true)}
            >
                Show Recordings ({videos.length})
            </button>
            
            {isOpen && (
                <div className="video-list-modal-overlay">
                    <div className="video-list-modal">
                        <div className="modal-header">
                            <h3>Recorded Videos</h3>
                            <button 
                                className="close-modal-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="video-items">
                            {videos.map((video, index) => (
                                <div 
                                    key={index} 
                                    className="video-item"
                                >
                                    <button 
                                        className="delete-btn"
                                        onClick={() => onVideoDelete(index)}
                                    >
                                        ×
                                    </button>
                                    <video src={video.url} controls width="200"></video>
                                    <p>{video.timestamp}</p>
                                    <div className="video-actions">
                                        <button onClick={() => {
                                            onVideoSelect(video.url);
                                            setIsOpen(false);
                                        }}>
                                            Play
                                        </button>
                                        <button
                                            className="download-button"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = video.url;
                                                link.download = "recorded-video.mp4";
                                                link.click();
                                            }}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoList;
