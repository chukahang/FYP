const VideoPlayer = ({ liveVideoFeed, recordedVideo, onProcess }) => {
    return (
        <div className="video-player">
            {!recordedVideo ? (
                <div className="video-container">
                    <video ref={liveVideoFeed} autoPlay className="live-player"></video>
                </div>
            ) : null}
            {recordedVideo && (
                <div className="recorded-player">
                    <div className="video-container">
                        <video className="recorded" src={recordedVideo} controls></video>
                    </div>
                    <div className="video-actions">
                        <button onClick={() => onProcess(recordedVideo)}>
                            Process Video
                        </button>
                        <button 
                            onClick={() => window.location.href = recordedVideo}
                            className="download-button"
                            download="recorded-video.mp4"
                        >
                            Download Recording
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
