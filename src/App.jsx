import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import UserProfile from './components/UserProfile';
import Consultant from './components/Consultant';
import Navigation from './components/Navigation';

function App() {
    const handleClearCache = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <Router>
            <div className="app-container">
                <button 
                    className="clear-cache-btn fixed"
                    onClick={handleClearCache}
                    title="Clear all cached data"
                >
                    Clear Cache
                </button>
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<VideoRecorder />} />
                        <Route path="/consultant" element={<Consultant />} />
                        <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;