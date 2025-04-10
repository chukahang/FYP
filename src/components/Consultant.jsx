import { useState } from 'react';
import ChatInterface from './ChatInterface';

const Consultant = () => {
    return (
        <div className="consultant-container">
            <div style={{ width: '800px', margin: '0 auto' }}>
                <h2>AI Mental Health Consultant</h2>
                
                <div className="consultant-content">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
};

export default Consultant;