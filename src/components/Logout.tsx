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
        <Button 
            onClick={handleLogout} 
            className='bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-500 transition duration-150 ease-in-out w-15 h-7 flex items-center justify-center ml-5 mb-3 mt-3'
        >
            Logout
        </Button>
    );
};
