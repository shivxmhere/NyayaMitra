import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Demo users for offline/Vercel mode
const DEMO_USERS = {
  meena: { id: 1, username: 'meena', full_name: 'Meena Devi', role: 'citizen', language: 'hindi' },
  advocate: { id: 2, username: 'advocate', full_name: 'Adv. Priya Singh', role: 'lawyer', language: 'english' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nyaya_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Check if it's a demo token
      const demoUser = localStorage.getItem('nyaya_demo_user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
        setLoading(false);
        return;
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch {
      // Backend not available — try demo mode
      const demoUser = localStorage.getItem('nyaya_demo_user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await api.post('/api/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const newToken = res.data.access_token;
      localStorage.setItem('nyaya_token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);

      const userRes = await api.get('/api/auth/me');
      setUser(userRes.data);
      return userRes.data;
    } catch {
      // Fallback to demo login when backend is unavailable
      const demoUser = DEMO_USERS[username];
      if (demoUser && ((username === 'meena' && password === 'meena123') ||
                       (username === 'advocate' && password === 'adv123'))) {
        const demoToken = 'demo_token_' + username;
        localStorage.setItem('nyaya_token', demoToken);
        localStorage.setItem('nyaya_demo_user', JSON.stringify(demoUser));
        setToken(demoToken);
        setUser(demoUser);
        return demoUser;
      }
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('nyaya_token');
    localStorage.removeItem('nyaya_demo_user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
