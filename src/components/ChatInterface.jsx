import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import useCache from '../hooks/useCache';
import './ChatInterface.css';

const ChatInterface = ({ videoReport, personalInfo, isInitialized }) => {
    // Use cache to persist messages across page navigations
    const [messages, setMessages] = useCache('chatMessages', [
        {
            id: 1,
            sender: 'bot',
            content: 'Hello! I\'m your mental health assistant. How are you feeling today?',
            timestamp: new Date().toISOString() // Store as ISO string for serialization
        }
    ]);
    
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize with context data if available
    useEffect(() => {
        // If we just initialized and have context data, add the context message
        if (isInitialized && (videoReport || personalInfo)) {
            // Check if we already added the context message
            const hasContextMessage = messages.some(
                msg => msg.sender === 'bot' && msg.content.includes('access to your stress analysis')
            );
            
            if (!hasContextMessage) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        content: videoReport 
                            ? "I have access to your stress analysis results and can provide personalized insights." 
                            : "I'm ready to help you with your mental health questions.",
                        sender: 'bot',
                        timestamp: new Date().toISOString()
                    }
                ]);
            }
        }
    }, [isInitialized, videoReport, personalInfo, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!input.trim() || isLoading) return;
        
        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            content: input,
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input; // Store the current input
        setInput(''); // Clear input field but allow user to type new message
        setIsLoading(true);
        
        try {
            // Send message to backend and get response
            const response = await sendChatMessage(currentInput);
            
            // Add bot response to chat without any processing
            const botResponse = {
                id: Date.now() + 1,
                content: response.content,
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                content: "I'm sorry, I couldn't process your request. Please try again later.",
                sender: 'bot',
                isError: true,
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Convert ISO string timestamps back to Date objects for display
    const formattedMessages = messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp)
    }));

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Mental Health AI Assistant</h3>
            </div>
            
            <div className="messages-container">
                {formattedMessages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`message ${message.sender === 'user' ? 'user-message' : 
                                   message.sender === 'system' ? 'system-message' : 'bot-message'} 
                                   ${message.isError ? 'error-message' : ''}`}
                    >
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot-message loading">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Wait for response..." : "Type your message here..."}
                    disabled={isLoading}
                    className={`chat-input ${isLoading ? 'chat-input-waiting' : ''}`}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className={`send-button ${isLoading ? 'send-button-disabled' : ''}`}
                >
                    {isLoading ? 'Wait' : 'Send'}
                </button>
                
                {/* Add a "Reset Chat" button to clear the conversation */}
                <button 
                    type="button" 
                    onClick={() => {
                        if (window.confirm("Are you sure you want to reset this conversation? All chat history will be lost.")) {
                            setMessages([{
                                id: Date.now(),
                                sender: 'bot',
                                content: 'Hello! I\'m your mental health assistant. How are you feeling today?',
                                timestamp: new Date().toISOString()
                            }]);
                        }
                    }}
                    className="reset-button"
                >
                    Reset Chat
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
