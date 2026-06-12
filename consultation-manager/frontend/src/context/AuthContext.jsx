import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'consulthub-auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const saveUser = useCallback((data) => {
    const authUser = {
      token: data.token,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return authUser;
  }, []);

  const login = useCallback(async (email, password, adminLogin = false) => {
    const data = await authApi.login({ email, password, adminLogin });
    return saveUser(data);
  }, [saveUser]);

  const signup = useCallback(async (name, email, password) => {
    const data = await authApi.signup({ name, email, password });
    return saveUser(data);
  }, [saveUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAdmin,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
