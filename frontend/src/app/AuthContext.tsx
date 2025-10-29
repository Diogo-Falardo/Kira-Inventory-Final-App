import { createContext, useContext, useState, useEffect } from "react";

import type { ReactNode } from "react";

// get user
import { getUserLogged } from "./endpoints/user";

type AuthUser = {
  email: string;
  username: string | null;
  avatar: string | null;
  last_login: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;

  login: (data: { access_token: string; refresh_token: string }) => void;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // internal state
  const [user, setUser] = useState<AuthUser>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // mount auth for the first time
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // load tokens from local storage
  useEffect(() => {
    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);

    if (storedAccess) {
      getUserLogged()
        .then((profile) => {
          setUser(profile);
          setIsBootstrapping(false);
        })
        .catch(() => {
          logout();
          setIsBootstrapping(false);
        });
    } else {
      setIsBootstrapping(false);
    }
  }, []);

  function login(data: { access_token: string; refresh_token: string }) {
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);

    setIsBootstrapping(false);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    getUserLogged()
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        logout();
      });
  }

  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    isBootstrapping,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
}
