import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Form State
  cardNumber: '',
  cardHolderName: '',
  expiryDate: '',
  cvv: '',
  amount: '',
  currency: 'INR',
  isFlipped: false,

  // Payment Lifecycle State
  status: 'idle', // 'idle' | 'processing' | 'success' | 'failed' | 'timeout'
  currentTransaction: null,
  retryAttempts: 0,
  selectedTransaction: null,
  history: [],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Form actions
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setFlipped: (state, action) => {
      state.isFlipped = action.payload;
    },
    resetForm: (state) => {
      state.cardNumber = '';
      state.cardHolderName = '';
      state.expiryDate = '';
      state.cvv = '';
      state.amount = '';
      state.currency = 'INR';
      state.isFlipped = false;
    },

    // Lifecycle actions
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },
    incrementRetry: (state) => {
      state.retryAttempts += 1;
    },
    resetRetry: (state) => {
      state.retryAttempts = 0;
    },
    
    // History actions
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    addTransactionToHistory: (state, action) => {
      state.history.unshift(action.payload);
    },
    updateTransactionInHistory: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.history.findIndex(tx => tx.id === id);
      if (index !== -1) {
        state.history[index] = { ...state.history[index], ...updates };
      }
    },
    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = action.payload;
    },
  },
});

export const { 
  updateField, 
  setFlipped, 
  resetForm, 
  setStatus, 
  setCurrentTransaction, 
  incrementRetry, 
  resetRetry, 
  setHistory,
  addTransactionToHistory, 
  updateTransactionInHistory,
  setSelectedTransaction 
} = paymentSlice.actions;

export default paymentSlice.reducer;
