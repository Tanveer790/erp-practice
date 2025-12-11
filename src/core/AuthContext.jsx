import { createContext, useContext } from 'react';
import useAuthViewModel from '../viewmodels/auth/useAuthViewModel';

// React context
const AuthContext = createContext(null);

// Provider component – yeh hi main.jsx me use ho raha hai
export function AuthProvider({ children }) {
  const vm = useAuthViewModel();
  return <AuthContext.Provider value={vm}>{children}</AuthContext.Provider>;
}

// Custom hook – sirf naam change kar raha hoon conflict avoid karne ke liye
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
}

// default export as plain context (optionally useful)
export default AuthContext;
