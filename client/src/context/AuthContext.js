import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, API } from '../api'; // Standardized API imports

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect runs once when the app starts
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('userInfo');
      if (!storedUser) {
        setLoading(false);
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse user info from localStorage", error);
        localStorage.removeItem('userInfo');
        setLoading(false);
        return;
      }

      setUser(parsedUser);

      if (!parsedUser?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${parsedUser.token}` },
        });

        const hasWalletChanged = Number(parsedUser.walletBalance) !== Number(data.walletBalance);
        const hasVerificationChanged = Boolean(parsedUser.isVerified) !== Boolean(data.isVerified);

        if (hasWalletChanged || hasVerificationChanged) {
          const updatedUser = { ...parsedUser, ...data };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          console.log("Wallet and verification state synced with DB.");
        }
      } catch (error) {
        console.error("Failed to sync user profile during auth initialization", error);

        const status = error.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (formData) => {
    const { data } = await loginUser(formData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);

    try {
      const { data: profileData } = await API.get('/api/users/profile');
      const mergedData = {
        ...data,
        ...profileData,
        token: data.token,
      };
      localStorage.setItem('userInfo', JSON.stringify(mergedData));
      setUser(mergedData);
      return mergedData;
    } catch (error) {
      console.error('Failed to fetch user profile after login', error);
      return data;
    }
  };

  // Register function
  const register = async (formData) => {
    const { data } = await registerUser(formData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Helper to manually trigger a wallet sync after payments
  const syncWallet = async () => {
    if (!user?.token) return;
    try {
      const { data } = await API.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to sync wallet manually:", err);
    }
  };

  // The value that will be available to all consuming components
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    syncWallet 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};