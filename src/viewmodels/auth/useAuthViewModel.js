import { useEffect, useState, useCallback } from 'react';
// import { loginApi, getCurrentUserApi } from '../../services/authService';

const STORAGE_KEY = 'tanerp_auth';

export default function useAuthViewModel() {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    loading: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setAuthState((s) => ({ ...s, loading: false }));
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setAuthState({
        user: parsed.user,
        token: parsed.token,
        loading: false,
      });
    } catch (e) {
      console.error('Failed to parse auth from storage', e);
      localStorage.removeItem(STORAGE_KEY);
      setAuthState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);

    // TODO: yaha real API call lagayenge
    // const { token, user } = await loginApi({ email, password });

    // abhi dummy login:
    if (email === 'admin@tanerp.com' && password === '123456') {
      const user = {
        id: 1,
        name: 'Tan-ERP Admin',
        email,
        role: 'Admin',
        permissions: [],
      };
      const token = 'dummy-token';

      const newState = { user, token, loading: false };
      setAuthState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return true;
    } else {
      setError('Invalid email or password');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null, loading: false });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    // future: /auth/me se user refresh karenge
  }, []);

  return {
    user: authState.user,
    token: authState.token,
    loading: authState.loading,
    error,
    login,
    logout,
    refreshUser,
  };
}
