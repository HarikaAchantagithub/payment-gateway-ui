import { getCardType } from './card';

// Card Number Validation
export const validateCardNumber = (number) => {
  const clearValue = number.replace(/\s+/g, '');
  const type = getCardType(clearValue);
  
  if (type === 'amex') {
    return clearValue.length === 15;
  }
  return clearValue.length === 16;
};

// Expiry Date Validation
export const validateExpiryDate = (date) => {
  if (!date || date.length !== 5) return false;
  const [month, year] = date.split('/');
  if (!month || !year) return false;
  const numMonth = parseInt(month, 10);
  const numYear = parseInt(year, 10);
  if (numMonth < 1 || numMonth > 12) return false;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100; // Get last 2 digits

  if (numYear < currentYear) return false;
  if (numYear === currentYear && numMonth < currentMonth) return false;
  
  return true;
};

// CVV Validation
export const validateCVV = (cvv, cardNumber = '') => {
  const type = getCardType(cardNumber);
  if (type === 'amex') {
    return cvv.length === 4;
  }
  return cvv.length === 3;
};

// Cardholder Name Validation
export const validateCardHolder = (name) => {
  return name.trim().length > 2;
};

// Amount Validation
export const validateAmount = (amount) => {
  if (!amount) return false;
  const parsed = parseFloat(amount);
  return !isNaN(parsed) && parsed > 0;
};
