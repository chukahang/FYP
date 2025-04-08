const API_BASE_URL = 'http://localhost:8000';

export const processVideoApi = async (videoBlob) => {
    try {
        const formData = new FormData();
        formData.append('file', videoBlob, 'video.mp4');

        const response = await fetch(`${API_BASE_URL}/api/v1/process`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Failed to process video: ${error.message}`);
    }
};

export const getJobStatus = async (jobId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${jobId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to get job status: ${error.message}`);
    }
};
