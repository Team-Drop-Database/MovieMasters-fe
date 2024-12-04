import {useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {refreshToken} from "@/services/AuthService";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<{ username?: string; userId?: number } | null>(null);

  useEffect(() => {
    async function initAuth() {
      let token = Cookies.get("jwt");

      if (!token) {
        const refreshTokenFromCookies = Cookies.get("refresh_token");
        if (refreshTokenFromCookies) {
          try {
            token = await refreshToken(); // Refresh the token if refresh token exists
            if (token) Cookies.set("jwt", token, { expires: 1, secure: true, sameSite: "Strict" });
          } catch (error) {
            console.error("Error refreshing token", error);
            setIsLoggedIn(false);
            setUserDetails(null);
            return;
          }
        }
      }

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setIsLoggedIn(true);
          setUserDetails({username: decoded.sub, userId: parseInt(decoded.userId, 10)});
        } catch (error) {
          console.error("Error decoding JWT", error);
          setIsLoggedIn(false);
          setUserDetails(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserDetails(null);
      }
    }

    initAuth();
  }, []);

  return {isLoggedIn, userDetails};
}