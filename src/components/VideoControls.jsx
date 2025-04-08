const VideoControls = ({
    permission,
    recordingStatus,
    onCameraPermission,
    onStartRecording,
    onStopRecording,
    onFileUpload
}) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'video/mp4') {
            const videoUrl = URL.createObjectURL(file);
            // Pass both the URL and timestamp
            onFileUpload(videoUrl, new Date().toLocaleString());
        } else {
            alert('Please upload an MP4 file');
        }
    };

    return (
        <div className="video-controls">
            {!permission ? (
                <>
                    <button onClick={onCameraPermission} type="button">
                        Get Camera
                    </button>
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleFileUpload}
                        id="file-upload"
                        style={{ display: 'none' }}
                    />
                    <button onClick={() => document.getElementById('file-upload').click()}>
                        Upload Video
                    </button>
                </>
            ) : null}
            {permission && recordingStatus === "inactive" ? (
                <button onClick={onStartRecording} type="button">
                    Start Recording
                </button>
            ) : null}
            {recordingStatus === "recording" ? (
                <button onClick={onStopRecording} type="button">
                    Stop Recording
                </button>
            ) : null}
        </div>
    );
};

export default VideoControls;
