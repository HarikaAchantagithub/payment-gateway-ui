export const getCardType = (number) => {
  const clearValue = number.replace(/\D/g, '');
  if (clearValue.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(clearValue)) return 'mastercard';
  if (/^3[47]/.test(clearValue)) return 'amex';
  return 'generic';
};
