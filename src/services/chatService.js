import { sendChatMessage } from './api';

// Store conversation history if needed
let conversationHistory = [];

export const sendMessage = async (message) => {
    try {
        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // Send message to the RAG LLM API
        const response = await sendChatMessage(message);
        
        // Add bot response to history
        conversationHistory.push({
            role: 'assistant',
            content: response.content || response.answer || response.response
        });
        
        // Return the formatted response
        return {
            content: response.content || response.answer || response.response
        };
    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
};

// Get conversation history
export const getConversationHistory = () => {
    return [...conversationHistory];
};

// Clear conversation history
export const clearConversationHistory = () => {
    conversationHistory = [];
};
