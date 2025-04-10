import { useRef } from "react";
import { useMediaRecorder } from './hooks/useMediaRecorder';
import useCache from './hooks/useCache';
import { processVideoApi, getJobStatus } from './services/api';
import VideoControls from './components/VideoControls';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
import ApiResponse from './components/ApiResponse';
import JobStatus from './components/JobStatus';
import Progress from './components/Progress';
import UploadStatus from './components/UploadStatus';

const VideoRecorder = () => {
    const [recordedVideo, setRecordedVideo] = useCache('recordedVideo', null);
    const [videoList, setVideoList] = useCache('videoList', []);
    const [apiResponse, setApiResponse] = useCache('apiResponse', null);
    const [currentJobId, setCurrentJobId] = useCache('currentJobId', null);
    const [jobStatus, setJobStatus] = useCache('jobStatus', null);
    const [progress, setProgress] = useCache('uploadProgress', 0);
    const [uploadSuccess, setUploadSuccess] = useCache('uploadSuccess', false);
    const [isProcessing, setIsProcessing] = useCache('isProcessing', false);
    const liveVideoFeed = useRef(null);

    const {
        permission,
        recordingStatus,
        getCameraPermission,
        startRecording,
        stopRecording,
    } = useMediaRecorder();

    const handleCameraPermission = async () => {
        try {
            setRecordedVideo(null); // Clear any recorded video
            const stream = await getCameraPermission();
            if (liveVideoFeed.current) {
                liveVideoFeed.current.srcObject = stream;
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStopRecording = async () => {
        const videoUrl = await stopRecording();
        setRecordedVideo(videoUrl);
        setVideoList(prev => [...prev, {
            url: videoUrl,
            timestamp: new Date().toLocaleString()
        }]);
    };

    const handleProcessVideo = async (videoUrl) => {
        try {
            setIsProcessing(true);
            setUploadSuccess(false);
            setProgress(0); // Reset progress
            const response = await fetch(videoUrl);
            const videoBlob = await response.blob();
            setApiResponse(null); // Clear previous response
            setProgress(10); // Start progress
            const data = await processVideoApi(videoBlob);
            
            if (data.job_id) {
                setCurrentJobId(data.job_id);
                setJobStatus(data);
                setApiResponse(data);
                setProgress(data.progress || 0);
                setUploadSuccess(true);
            }
        } catch (error) {
            setApiResponse({ error: error.message });
            setProgress(0);
            setUploadSuccess(false);
        }
    };

    const refreshJobStatus = async () => {
        if (!currentJobId) return;
        
        try {
            const status = await getJobStatus(currentJobId);
            setJobStatus(status);
            setProgress(status.progress || 0);
        } catch (error) {
            console.error('Error fetching job status:', error);
        }
    };

    const handleFileUpload = (videoUrl, timestamp) => {
        setRecordedVideo(videoUrl);
        setVideoList(prev => [...prev, {
            url: videoUrl,
            timestamp: timestamp
        }]);
    };

    return (
        <div className="recorder-container">
            <div className="recorder-main" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
                <h2>Stress Detection</h2>
                <VideoControls
                    permission={permission}
                    recordingStatus={recordingStatus}
                    onCameraPermission={handleCameraPermission}
                    onStartRecording={startRecording}
                    onStopRecording={handleStopRecording}
                    onFileUpload={handleFileUpload}
                />
                <VideoPlayer
                    liveVideoFeed={liveVideoFeed}
                    recordedVideo={recordedVideo}
                    onProcess={handleProcessVideo}
                />
                <div className="results-section">
                    {isProcessing && (
                        <>
                            <UploadStatus 
                                isSuccess={uploadSuccess} 
                                message={uploadSuccess ? "Video uploaded successfully!" : "Uploading video..."}
                            />
                            <div className="progress-section">
                                <Progress progress={progress} isLoading={!jobStatus?.result} />
                            </div>
                        </>
                    )}
                    {apiResponse && currentJobId && jobStatus && (
                        <JobStatus 
                            jobId={currentJobId}
                            status={jobStatus}
                            onRefresh={refreshJobStatus}
                        />
                    )}
                </div>
            </div>
            <VideoList
                videos={videoList}
                onVideoSelect={setRecordedVideo}
                onVideoDelete={(index) => {
                    setVideoList(prev => prev.filter((_, i) => i !== index));
                    if (videoList[index].url === recordedVideo) {
                        setRecordedVideo(null);
                    }
                }}
            />
        </div>
    );
};

export default VideoRecorder;
