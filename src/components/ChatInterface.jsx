import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import './ChatInterface.css';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            content: 'Hello! I\'m your mental health assistant. How are you feeling today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

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
            id: messages.length + 1,
            content: input,
            sender: 'user',
            timestamp: new Date()
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
                id: messages.length + 2,
                content: response.content,
                sender: 'bot',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Add error message
            const errorMessage = {
                id: messages.length + 2,
                content: "I'm sorry, I couldn't process your request. Please try again later.",
                sender: 'bot',
                isError: true,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Mental Health AI Assistant</h3>
                <p className="chat-subtitle">
                    Powered by RAG LLM technology with mental health expertise
                </p>
            </div>
            
            <div className="messages-container">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
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
                    disabled={false} // Allow typing even during loading
                    className={`chat-input ${isLoading ? 'chat-input-waiting' : ''}`}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()} // Disable send button during loading
                    className={`send-button ${isLoading ? 'send-button-disabled' : ''}`}
                >
                    {isLoading ? 'Wait' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
