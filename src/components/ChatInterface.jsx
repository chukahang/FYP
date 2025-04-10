import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/chatService';
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
        
        if (!input.trim()) return;
        
        // Add user message to chat
        const userMessage = {
            id: messages.length + 1,
            content: input,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        try {
            // Send message to backend and get response
            const response = await sendMessage(input);
            
            // Add bot response to chat
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
                    placeholder="Type your message here..."
                    disabled={isLoading}
                    className="chat-input"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="send-button"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
