import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types/user.types';

interface UserContextProps {
    isAuthenticated: "true" | "false";
    setAuthenticated: (value: "true" | "false") => void;
    userData: User | null;
    setUserData: (value: User | null) => void;
    refreshToken: () => Promise<void>;
}

const UserContextDefaultValues: UserContextProps = {
    isAuthenticated: "false",
    setAuthenticated: () => {},
    userData: null,
    setUserData: () => {},
    refreshToken: async () => {},
};

export const UserContext = createContext<UserContextProps>(UserContextDefaultValues);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState<"true" | "false">(() => 
        localStorage.getItem("auth") === 'true' ? "true" : "false"
    );
    const [userData, setUserData] = useState<User | null>(null);

    const fetchUserData = async () => {
        if (isAuthenticated === "true") {
            try {
                const response = await axios.get('/user/protected-route');
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // If we get an error fetching user data, we should probably log out
                setAuthenticated("false");
                localStorage.removeItem("auth");
                setUserData(null);
            }
        }
    };

    const refreshToken = async () => {
        if (isAuthenticated === "true") {
            try {
                const response = await axios.post('/auth/refresh-token', {
                    refreshToken: localStorage.getItem("refreshToken") as string,
                });
                const { token } = response.data;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchUserData();
            } catch (error) {
                console.error('Error refreshing token:', error);
                setAuthenticated("false");
                localStorage.removeItem("auth");
                setUserData(null);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
        // Set up refresh token interval
        const interval = setInterval(refreshToken, 1000 * 60 * 5); // Every 5 minutes
        
        return () => clearInterval(interval);
    }, [localStorage.getItem("auth")]); // Re-run when authentication status changes

    // Update localStorage when authentication status changes
    useEffect(() => {
        if (localStorage.getItem("auth")) {
            fetchUserData()
        } else {
            localStorage.removeItem("auth");
            setUserData(null);
        }
    }, [localStorage.getItem("auth")]);

    return (
        <UserContext.Provider value={{ isAuthenticated, setAuthenticated, userData, setUserData, refreshToken }}>
            {children}
        </UserContext.Provider>
    );
};