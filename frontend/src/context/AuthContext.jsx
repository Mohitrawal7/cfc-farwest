import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('cfc_admin');
    return stored ? JSON.parse(stored) : null;
  });

  const loginFn = useCallback(async (username, password) => {
    const res = await apiLogin(username, password);
    const { token, ...adminData } = res.data;
    localStorage.setItem('cfc_token', token);
    localStorage.setItem('cfc_admin', JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cfc_token');
    localStorage.removeItem('cfc_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login: loginFn, logout, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
