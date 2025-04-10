import { useState } from 'react';
import ChatInterface from './ChatInterface';

const Consultant = () => {
    const [activeSystem, setActiveSystem] = useState('chatbot'); // 'chatbot' or 'appointments'

    return (
        <div className="consultant-container">
            <div style={{ width: '800px', margin: '0 auto' }}>
                <h2>Consultant</h2>
                
                <div className="system-selector">
                    <button 
                        className={`system-button ${activeSystem === 'chatbot' ? 'active' : ''}`}
                        onClick={() => setActiveSystem('chatbot')}
                    >
                        AI Mental Health Assistant
                    </button>
                    <button 
                        className={`system-button ${activeSystem === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveSystem('appointments')}
                    >
                        Book Human Consultant
                    </button>
                </div>
                
                <div className="consultant-content">
                    {activeSystem === 'chatbot' ? (
                        <ChatInterface />
                    ) : (
                        <div className="appointment-system">
                            <p>Book an appointment with a human consultant.</p>
                            <p>This feature is coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Consultant;