"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { refreshToken } from "@/services/AuthService";
import {Role} from "@/models/Role";

type AuthContextType = {
  isLoggedIn: boolean;
  userDetails: { username: string; userId: number, profileUrl: string, role: Role } | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<{ username: string; userId: number; profileUrl: string; role: Role } | null>(null);
  const [loading, setLoading] = useState(true);

  const JWT_COOKIE_SECURE: boolean = process.env
  .JWT_COOKIE_SECURE?.toLowerCase() == 'true';

  const initAuth = async () => {
    setLoading(true);
    let token = Cookies.get("jwt");

    if (!token) {
      const refreshTokenCookie = Cookies.get("refresh_token");
      if (refreshTokenCookie) {
        try {
          token = await refreshToken();
          if (token) Cookies.set("jwt", token, { expires: 1, secure: JWT_COOKIE_SECURE, sameSite: "Strict" });
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        // @ts-expect-error: description here to make typescript fuck off
        setUserDetails({ username: decoded.sub as string, userId: parseInt(decoded.userId, 10), profileUrl: decoded.profileUrl, role: decoded.role});
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
  };



  useEffect(() => {
    initAuth();
  }, []);

  // Expose login/logout methods
  const login = async () => {
    await initAuth();
  };

  const logout = () => {
    Cookies.remove("jwt");
    Cookies.remove("refresh_token");
    setIsLoggedIn(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userDetails, loading, login, logout }}>
  {children}
  </AuthContext.Provider>
);

};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
