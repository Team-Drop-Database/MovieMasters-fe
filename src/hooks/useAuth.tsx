import {useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<{ username?: string } | null>(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsLoggedIn(true);
        setUserDetails({username: decoded.sub});
      } catch (error) {
        console.error("Error decoding JWT", error);
      }
    } else {
      setIsLoggedIn(false);
      setUserDetails(null);
    }
  }, []);

  return {isLoggedIn, userDetails};
}