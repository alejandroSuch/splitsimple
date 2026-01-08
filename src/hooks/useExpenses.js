import { useState, useEffect } from 'react';
import { subscribeToExpenses } from '../services/expenses';

export const useExpenses = (groupId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToExpenses(
      groupId,
      (expensesData) => {
        setExpenses(expensesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching expenses:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  return { expenses, loading, error };
};
