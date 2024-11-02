import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types/user.types';

interface UserContextProps {
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
    userData: User | null;
    setUserData: (value: User | null) => void;
    refreshToken: () => Promise<void>;
}

const UserContextDefaultValues: UserContextProps = {
    isAuthenticated: false,
    setAuthenticated: () => {},
    userData: null,
    setUserData: () => {},
    refreshToken: async () => {},
};

export const UserContext = createContext<UserContextProps>(UserContextDefaultValues);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(() => 
        localStorage.getItem("auth") === 'true'
    );
    const [userData, setUserData] = useState<User | null>(null);

    const fetchUserData = async () => {
        if (isAuthenticated) {
            try {
                const response = await axios.get('http://localhost:3000/user/protected-route', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setUserData(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setAuthenticated(false);
                localStorage.removeItem("auth");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUserData(null);
            }
        }
    };

    const refreshToken = async () => {
        if (isAuthenticated) {
            try {
                const response = await axios.post('http://localhost:3000/auth/refresh-token', {
                    refreshToken: localStorage.getItem("refreshToken") as string,
                });
                const { accessToken } = response.data;
                console.log(accessToken)
                localStorage.setItem("accessToken", accessToken);
                // Set the default header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                await fetchUserData();
            } catch (error) {
                console.error('Error refreshing token:', error);
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
    }, [isAuthenticated]); // Only run when authentication status changes

    // Update localStorage when authentication status changes
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
        <UserContext.Provider value={{ isAuthenticated, setAuthenticated, userData, setUserData, refreshToken }}>
            {children}
        </UserContext.Provider>
    );
};
