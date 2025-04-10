const API_BASE_URL = 'http://localhost:8000'; // Keep this for your existing API
const RAG_API_URL = 'http://localhost:5000';  // Add this for the RAG LLM API

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

// Actual API call to the RAG LLM backend
export const sendChatMessage = async (message) => {
    try {
        const response = await fetch(`${RAG_API_URL}/api/v1/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query: message,
                history: [] // You can implement chat history if needed
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw new Error(`Failed to get response: ${error.message}`);
    }
};
