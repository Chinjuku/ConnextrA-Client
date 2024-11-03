import { UserContext } from "@/context/UserContext";
import { User } from "@/types/user.types";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface Token {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const Login = () => {
  const { setAuthenticated, isAuthenticated, userData, setUserData } =
    useContext(UserContext);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(import.meta.env.VITE_BACKEND_URL);
      try {
        console.log(codeResponse);
        const res = await axios.post<Token>(
          `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
          {
            access_token: codeResponse.access_token,
          }
        );
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setAuthenticated(true);
        console.log(res.data.user);
        setUserData(res.data.user);
        navigate("/chat");
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  console.log(userData, isAuthenticated);
  return (
    <div className="relative z-10 p-8">
      <button
        type="button"
        className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold px-6 py-3 rounded-full flex items-center justify-center space-x-2 transition transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
        onClick={() => login()}
      >
        <div className="bg-white rounded-full p-1 flex items-center justify-center">
          <img
            src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
            alt="Google Logo"
            className="h-5 w-5"
          />
        </div>

        <span>Sign in with Google</span>
      </button>
    </div>
  );
};
