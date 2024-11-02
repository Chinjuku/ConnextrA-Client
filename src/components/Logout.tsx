import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/UserContext'; // Adjust the path as needed

export const Logout = () => {
    const { setAuthenticated, setUserData } = useContext(UserContext);
    const handleLogout = () => {
        setAuthenticated(false);
        setUserData(null);
        localStorage.removeItem("accessToken"); // Change to sessionStorage if needed
        localStorage.removeItem("refreshToken"); // Change to sessionStorage if needed
    };
    return (
        <Button onClick={handleLogout}>Logout</Button>
    );
};

