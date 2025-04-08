import { useState, useEffect } from 'react';

const useCache = (key, initialValue) => {
    // Get initial value from localStorage or use provided initialValue
    const [value, setValue] = useState(() => {
        try {
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : initialValue;
        } catch {
            return initialValue;
        }
    });

    // Update localStorage when value changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [key, value]);

    return [value, setValue];
};

export default useCache;