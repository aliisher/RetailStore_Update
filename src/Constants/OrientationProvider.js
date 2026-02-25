import React, { createContext, useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
    const { width, height } = useWindowDimensions();
    const [isLandscape, setIsLandscape] = useState(width > height);

    useEffect(() => {
        setIsLandscape(width > height);
    }, [width, height]);

    return (
        <OrientationContext.Provider value={{ width, height, isLandscape }}>
            {children}
        </OrientationContext.Provider>
    );
};
