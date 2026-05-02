import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { api, setAuthToken } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (authToken) => {
    try {
      setAuthToken(authToken);
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      console.error("Session verification failed", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  const login = async (payload) => {
    try {
      const { data } = await api.post("/auth/login", payload);
      const { token: newToken, user: newUser } = data;
      
      localStorage.setItem("token", newToken);
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success(`Welcome back, ${newUser.name.split(' ')[0]}!`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/signup", payload);
      const { token: newToken, user: newUser } = data;
      
      localStorage.setItem("token", newToken);
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAuthToken(null);
    toast.success("Signed out successfully");
  }, []);

  const value = useMemo(
    () => ({ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!token && !!user,
      refreshUser: () => fetchMe(token)
    }),
    [user, token, loading, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
