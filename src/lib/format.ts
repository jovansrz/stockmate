export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrency = (value: number, currency: string = 'IDR') => {
  const cleanCurrency = (currency || 'IDR').toUpperCase();
  if (cleanCurrency === 'IDR') {
    return formatRupiah(value);
  }
  
  let locale = 'en-US';
  if (cleanCurrency === 'JPY') locale = 'ja-JP';
  else if (cleanCurrency === 'EUR') locale = 'de-DE';
  else if (cleanCurrency === 'HKD') locale = 'zh-HK';
  else if (cleanCurrency === 'CHF') locale = 'de-CH';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cleanCurrency,
    minimumFractionDigits: cleanCurrency === 'JPY' ? 0 : 2,
    maximumFractionDigits: cleanCurrency === 'JPY' ? 0 : 2,
  }).format(value);
};

export const formatPercent = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number) => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'M'; // Miliar
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'Jt'; // Juta
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K'; // Ribu
  }
  return value.toString();
};
