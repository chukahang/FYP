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

// New method to initialize chat with context from video processing reports
export const initializeChatWithContext = async (videoReport, personalInfo) => {
    try {
        // Construct a context object with all available information
        const contextData = {
            videoProcessingReport: videoReport || null,
            personalInformation: personalInfo || null,
        };
        
        // Send the initialization request to the backend
        const response = await fetch(`${RAG_API_URL}/api/v1/chat/initialize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contextData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error initializing chat with context:', error);
        throw new Error(`Failed to initialize chat: ${error.message}`);
    }
};

// Get the latest video processing report from localStorage
export const getLatestVideoReport = () => {
    try {
        // Try to get the job status from cache/localStorage
        const jobStatusJSON = localStorage.getItem('jobStatus');
        if (jobStatusJSON) {
            return JSON.parse(jobStatusJSON);
        }
        return null;
    } catch (error) {
        console.error('Error getting latest video report:', error);
        return null;
    }
};

// Get personal information from localStorage (if stored)
export const getPersonalInfo = () => {
    try {
        // Try to get personal info from localStorage (if you store it somewhere)
        const personalInfoJSON = localStorage.getItem('personalInfo');
        if (personalInfoJSON) {
            return JSON.parse(personalInfoJSON);
        }
        return null;
    } catch (error) {
        console.error('Error getting personal information:', error);
        return null;
    }
};
