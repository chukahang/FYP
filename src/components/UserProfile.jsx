import { useState } from 'react';
import useCache from '../hooks/useCache';

const UserProfile = () => {
    const [profile, setProfile] = useCache('userProfile', {
        age: '',
        sex: '',
        occupation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile updated:', profile);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
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
                            value={profile.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sex">Sex:</label>
                        <select
                            id="sex"
                            name="sex"
                            value={profile.sex}
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
                            value={profile.occupation}
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
