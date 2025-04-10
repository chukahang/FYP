import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="side-navigation">
            <div className="nav-header">
                <h1>Stress Analyser</h1>
            </div>
            <div className="nav-links">
                <ul>
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'active-link' : ''}`
                            }
                            end
                        >
                            <span className="nav-icon">📹</span>
                            <span>Video Recorder</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/consultant" 
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'active-link' : ''}`
                            }
                        >
                            <span className="nav-icon">👨‍⚕️</span>
                            <span>Consultant</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/profile" 
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'active-link' : ''}`
                            }
                        >
                            <span className="nav-icon">👤</span>
                            <span>User Profile</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
