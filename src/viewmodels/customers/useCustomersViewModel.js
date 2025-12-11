import { useEffect, useState, useCallback } from 'react';
import fetchCustomersApi from '../../services/customerService.js';


export function useCustomersViewModel() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCustomersApi();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    customers,
    loading,
    error,
    reload: load,
  };
}
