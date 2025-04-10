import { useState, useEffect } from 'react';
import useCache from '../hooks/useCache';

const UserProfile = () => {
    // Get saved profile from cache
    const [savedProfile, setSavedProfile] = useCache('userProfile', {
        age: '',
        sex: '',
        occupation: ''
    });

    // Local state for form inputs that won't affect cache until submission
    const [formData, setFormData] = useState(savedProfile);

    // Update local form data when cached profile changes
    useEffect(() => {
        setFormData(savedProfile);
    }, [savedProfile]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Only update the cache when form is submitted
        setSavedProfile(formData);
        console.log('Profile updated:', formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Only update the local state, not the cache
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="profile-container">
            <div style={{ width: '600px', margin: '0 auto' }}>
                <h2>User Profile</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sex">Sex:</label>
                        <select
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                        >
                            <option value="">Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="occupation">Occupation:</label>
                        <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="update-btn">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
