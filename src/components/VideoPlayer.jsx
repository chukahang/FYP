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
                            className="download-button"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = recordedVideo;
                                link.download = "recorded-video.mp4";
                                link.click();
                            }}
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
