import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<VideoRecorder />} />
                        <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;