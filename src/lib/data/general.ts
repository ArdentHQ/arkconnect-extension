export type Currency = {
  label: string;
  value: string;
};

type MarketProvider = {
  label: string;
  value: string;
  unsupportedCurrencies: string[];
};

type PlatformData = {
  currencies: Currency[];
  crypto: Currency[];
  marketProviders: MarketProvider[];
};

export const general = {
  currencies: [
    { label: 'AUD (A$)', value: 'AUD' },
    { label: 'BRL (R$)', value: 'BRL' },
    { label: 'CAD (C$)', value: 'CAD' },
    { label: 'CHF (CHF)', value: 'CHF' },
    { label: 'CNY (¥)', value: 'CNY' },
    { label: 'DKK (dkr)', value: 'DKK' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' },
    { label: 'HKD (HK$)', value: 'HKD' },
    { label: 'IDR (IDR)', value: 'IDR' },
    { label: 'INR (₹)', value: 'INR' },
    { label: 'JPY (¥)', value: 'JPY' },
    { label: 'KRW (₩)', value: 'KRW' },
    { label: 'MXN (MX$)', value: 'MXN' },
    { label: 'NOK (nkr)', value: 'NOK' },
    { label: 'RUB (₽)', value: 'RUB' },
    { label: 'SEK (skr)', value: 'SEK' },
    { label: 'USD ($)', value: 'USD' },
    { label: 'VND (₫)', value: 'VND' },
  ],
  crypto: [
    { label: 'BTC (Ƀ)', value: 'BTC' },
    { label: 'ETH (Ξ)', value: 'ETH' },
    { label: 'LTC (Ł)', value: 'LTC' },
  ],
  marketProviders: [
    { label: 'CoinGecko', unsupportedCurrencies: [], value: 'coingecko' },
    { label: 'CryptoCompare', unsupportedCurrencies: ['VND'], value: 'cryptocompare' },
  ],
} as PlatformData;
