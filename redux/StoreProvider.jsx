'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setHistory } from './paymentSlice';

export default function StoreProvider({ children }) {
  useEffect(() => {
    // Hydrate history from localStorage on mount
    const saved = localStorage.getItem('txHistory');
    if (saved) {
      try {
        store.dispatch(setHistory(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse txHistory from localStorage', e);
      }
    }

    // Subscribe to store changes to persist history
    const unsubscribe = store.subscribe(() => {
      const history = store.getState().payment.history;
      localStorage.setItem('txHistory', JSON.stringify(history));
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
