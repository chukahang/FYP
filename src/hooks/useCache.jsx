import { useState, useEffect } from 'react';

const useCache = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        try {
            // Get from localStorage on component mount
            const cachedValue = localStorage.getItem(key);
            return cachedValue !== null ? JSON.parse(cachedValue) : defaultValue;
        } catch (error) {
            console.error(`Error retrieving ${key} from cache:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        // Update localStorage when value changes
        try {
            if (value !== null && value !== undefined) {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error saving ${key} to cache:`, error);
        }
    }, [key, value]);

    return [value, setValue];
};

export default useCache;

// Helper functions to directly access cached values
export const getCachedValue = (key, defaultValue = null) => {
    try {
        const cachedValue = localStorage.getItem(key);
        return cachedValue !== null ? JSON.parse(cachedValue) : defaultValue;
    } catch (error) {
        console.error(`Error retrieving ${key} from cache:`, error);
        return defaultValue;
    }
};

export const setCachedValue = (key, value) => {
    try {
        if (value !== null && value !== undefined) {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } else {
            localStorage.removeItem(key);
            return false;
        }
    } catch (error) {
        console.error(`Error saving ${key} to cache:`, error);
        return false;
    }
};