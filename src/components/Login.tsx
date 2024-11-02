import { UserContext } from "@/context/UserContext";
import { User } from "@/types/user.types";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface Token {
  user: User
  accessToken: string
  refreshToken: string
}

export const Login = () => {
  const { setAuthenticated, isAuthenticated, userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        console.log(codeResponse)
        const res = await axios.post<Token>('http://localhost:3000/auth/login', {
          access_token: codeResponse.access_token
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("auth", 'true');
        setAuthenticated("true")
        setUserData(res.data.user)
        navigate('/dashboard');
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  console.log(userData, isAuthenticated)
  return (
    <div className="shadow-2xl">
      <button
        type="button"
        className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
        onClick={() => login()}
      >
        Sign in with Google
      </button>
    </div>
  );
};
