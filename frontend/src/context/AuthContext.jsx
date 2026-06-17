import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export  const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be in AuthProvider');
    return context;
};

// Helper function to decode JWT token payload in the browser
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('clearhead_token')
        const storedUser = localStorage.getItem('clearhead_user')

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // API call to authenticate user
            const res = await api.post('/auth/login', { email, password });
            const { token: jwtToken } = res.data;

            // Decode token payload containing { userId, email }
            const payload = decodeToken(jwtToken);
            if (!payload) throw new Error('Failed to parse authentication token');

            // Generate a user display name from email since server does not return it in token payload
            const localName = email.split('@')[0];
            const displayName = localName.charAt(0).toUpperCase() + localName.slice(1);

            const userData = {
                id: payload.userId,
                name: displayName,
                email: payload.email
            };

            localStorage.setItem('clearhead_token', jwtToken);
            localStorage.setItem('clearhead_user', JSON.stringify(userData));

            setToken(jwtToken);
            setUser(userData);
            return userData;
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || 'Incorrect credentials';
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    const signup = async (name, email, password) => {
    setLoading(true);
    try {
      // API call to create user account
      await api.post('/auth/signup', { name, email, password });

      // Automatically sign in upon successful registration
      return await login(email, password);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('clearhead_token');
    localStorage.removeItem('clearhead_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );


}
