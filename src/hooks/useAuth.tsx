import {useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {refreshToken} from "@/services/AuthService";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<{ username: string; userId: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to initialize or refresh auth state
  async function initAuth() {
    let token = Cookies.get("jwt");

    if (!token) {
      const refreshTokenCookie = Cookies.get("refresh_token");
      if (refreshTokenCookie) {
        try {
          token = await refreshToken();
          if (token) Cookies.set("jwt", token, { expires: 1, secure: true, sameSite: "Strict" });
        } catch (error) {
          console.error("Error refreshing token:", error);
          setIsLoggedIn(false);
          setUserDetails(null);
          setLoading(false);
          return;
        }
      }
    }

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsLoggedIn(true);
        setUserDetails({ username: decoded.sub, userId: parseInt(decoded.userId, 10) });
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setIsLoggedIn(false);
        setUserDetails(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserDetails(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    initAuth();
  }, []);

  return { isLoggedIn, userDetails, loading, initAuth };
}