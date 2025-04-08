import { useState, useRef } from 'react';

const mimeType = 'video/mp4';

export const useMediaRecorder = () => {
    const [permission, setPermission] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [videoChunks, setVideoChunks] = useState([]);
    const mediaRecorder = useRef(null);

    const getCameraPermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                // Stop any existing streams
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                const videoStream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: true,
                });
                const audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });

                const combinedStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...audioStream.getAudioTracks(),
                ]);

                setPermission(true);
                setStream(combinedStream);
                return combinedStream;
            } catch (err) {
                setPermission(false);
                throw new Error(err.message);
            }
        } else {
            throw new Error("MediaRecorder not supported");
        }
    };

    const startRecording = () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 2500000,
            audioBitsPerSecond: 128000
        });

        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localVideoChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                localVideoChunks.push(event.data);
            }
        };

        setVideoChunks(localVideoChunks);
    };

    const stopRecording = () => {
        return new Promise((resolve) => {
            setRecordingStatus("inactive");
            mediaRecorder.current.stop();

            mediaRecorder.current.onstop = () => {
                const videoBlob = new Blob(videoChunks, { type: mimeType });
                const videoUrl = URL.createObjectURL(videoBlob);
                setVideoChunks([]);
                
                // Stop all tracks
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                setPermission(false);
                setStream(null);
                
                resolve(videoUrl);
            };
        });
    };

    return {
        permission,
        recordingStatus,
        getCameraPermission,
        startRecording,
        stopRecording,
    };
};
