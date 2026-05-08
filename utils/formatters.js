export const formatCardNumber = (value) => {
  if (!value) return value;
  const clearValue = value.replace(/\D+/g, '');
  const nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
  return nextValue.trim();
};

export const formatExpiryDate = (value) => {
  if (!value) return value;
  const clearValue = value.replace(/\D+/g, '');
  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }
  return clearValue;
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
