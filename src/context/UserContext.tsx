import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types/user.types';

interface UserContextProps {
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
    userData: User | null;
    setUserData: (value: User | null) => void;
    refreshToken: () => Promise<void>;
    isLoading: boolean; // Add loading state
    error: string | null; // Add error state
}

const UserContextDefaultValues: UserContextProps = {
    isAuthenticated: false,
    setAuthenticated: () => {},
    userData: null,
    setUserData: () => {},
    refreshToken: async () => {},
    isLoading: false, // Default loading state
    error: null, // Default error state
};

export const UserContext = createContext<UserContextProps>(UserContextDefaultValues);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(() => 
        localStorage.getItem("auth") === 'true'
    );
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Initialize loading state
    const [error, setError] = useState<string | null>(null); // Initialize error state

    const fetchUserData = async () => {
        setIsLoading(true); // Start loading
        setError(null); // Clear previous errors
        if (isAuthenticated) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/protected-route`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setUserData(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data.'); // Set error message
                setAuthenticated(false);
                localStorage.removeItem("auth");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUserData(null);
            } finally {
                setIsLoading(false); // End loading
            }
        } else {
            setIsLoading(false); // End loading if not authenticated
        }
    };

    const refreshToken = async () => {
        if (isAuthenticated) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`, {
                    refreshToken: localStorage.getItem("refreshToken") as string,
                });
                const { accessToken } = response.data;
                console.log(accessToken);
                localStorage.setItem("accessToken", accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                await fetchUserData();
            } catch (error) {
                console.error('Error refreshing token:', error);
                setError('Failed to refresh token.'); // Set error message
                setAuthenticated(false);
                localStorage.removeItem("auth");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUserData(null);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
            const interval = setInterval(refreshToken, 1000 * 60 * 5); // Every 5 minutes
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        localStorage.setItem("auth", String(isAuthenticated));
        if (!isAuthenticated) {
            setUserData(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } else {
            fetchUserData();
        }
    }, [isAuthenticated]);

    return (
        <UserContext.Provider value={{ 
            isAuthenticated, 
            setAuthenticated, 
            userData, 
            setUserData, 
            refreshToken,
            isLoading, // Provide loading state
            error, // Provide error state
        }}>
            {children}
        </UserContext.Provider>
    );
};
