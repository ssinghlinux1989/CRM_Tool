/**
 * Currency Formatter for Bharat Solar Shakti (Indian Rupee INR ₹)
 */

export const CURRENCY_SYMBOL = '₹';

export function formatInr(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

export function formatInrPerUnit(rate: number): string {
  return '₹' + rate.toFixed(2);
}
