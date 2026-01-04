// Currency data with full names
const currencies: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  SEK: 'Swedish Krona',
  KRW: 'South Korean Won',
  SGD: 'Singapore Dollar',
  NOK: 'Norwegian Krone',
  MXN: 'Mexican Peso',
  INR: 'Indian Rupee',
  RUB: 'Russian Ruble',
  ZAR: 'South African Rand',
  TRY: 'Turkish Lira',
  BRL: 'Brazilian Real',
  TWD: 'Taiwan Dollar',
  DKK: 'Danish Krone',
  PLN: 'Polish Zloty',
  THB: 'Thai Baht',
  IDR: 'Indonesian Rupiah',
  HUF: 'Hungarian Forint',
  CZK: 'Czech Koruna',
  ILS: 'Israeli Shekel',
  CLP: 'Chilean Peso',
  PHP: 'Philippine Peso',
  AED: 'UAE Dirham',
  COP: 'Colombian Peso',
  SAR: 'Saudi Riyal',
  MYR: 'Malaysian Ringgit',
  RON: 'Romanian Leu',
  VND: 'Vietnamese Dong',
};

// Constants for formatting
const RATE_DISPLAY_PRECISION = 6;

// Valid currency codes (3 uppercase letters)
const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

interface ExchangeRateResponse {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

let exchangeRates: Record<string, number> = {};
let lastUpdated = '';

// Get translations from the page (set via inline script with define:vars)
declare global {
  interface Window {
    currencyTranslations: {
      loading: string;
      error: string;
      rate: string;
      lastUpdated: string;
    };
    lucide?: {
      createIcons: () => void;
    };
  }
}

function getTranslations() {
  return (
    window.currencyTranslations || {
      loading: 'Loading exchange rates...',
      error: 'Failed to load exchange rates.',
      rate: 'Exchange Rate',
      lastUpdated: 'Last updated',
    }
  );
}

function updateStatus(message: string, type: 'loading' | 'error' | 'success') {
  const statusEl = document.getElementById('status-message');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = type;
  }
}

function populateCurrencySelects() {
  const fromSelect = document.getElementById('from-currency') as HTMLSelectElement;
  const toSelect = document.getElementById('to-currency') as HTMLSelectElement;

  if (!fromSelect || !toSelect) {
    return;
  }

  // Clear existing options
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  // Create options safely using DOM methods to avoid XSS
  Object.entries(currencies).forEach(([code, name]) => {
    const fromOption = document.createElement('option');
    fromOption.value = code;
    fromOption.textContent = `${code} - ${name}`;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement('option');
    toOption.value = code;
    toOption.textContent = `${code} - ${name}`;
    toSelect.appendChild(toOption);
  });

  // Set default values
  fromSelect.value = 'USD';
  toSelect.value = 'EUR';
}

async function fetchExchangeRates(base: string = 'USD'): Promise<boolean> {
  const translations = getTranslations();

  // Validate base currency code to prevent URL injection
  if (!CURRENCY_CODE_REGEX.test(base)) {
    console.error('Invalid currency code:', base);
    updateStatus(translations.error, 'error');
    return false;
  }

  try {
    updateStatus(translations.loading, 'loading');

    // Using the free ExchangeRate-API (no API key required)
    const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data: ExchangeRateResponse = await response.json();

    if (data.result !== 'success') {
      throw new Error('API returned error');
    }

    exchangeRates = data.rates;
    lastUpdated = data.time_last_update_utc;

    // Format and display last updated time
    const updateEl = document.getElementById('last-updated');
    if (updateEl) {
      const date = new Date(lastUpdated);
      updateEl.textContent = `${translations.lastUpdated}: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    updateStatus('', 'success');
    return true;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    updateStatus(translations.error, 'error');
    return false;
  }
}

function convert() {
  const translations = getTranslations();
  const amountInput = document.getElementById('amount') as HTMLInputElement;
  const fromSelect = document.getElementById('from-currency') as HTMLSelectElement;
  const toSelect = document.getElementById('to-currency') as HTMLSelectElement;
  const resultInput = document.getElementById('result') as HTMLInputElement;
  const rateDisplay = document.getElementById('rate-display');

  if (!amountInput || !fromSelect || !toSelect || !resultInput) {
    return;
  }

  const amount = parseFloat(amountInput.value) || 0;
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  if (Object.keys(exchangeRates).length === 0) {
    resultInput.value = '';
    return;
  }

  // Validate that both currencies exist in our exchange rates
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  // Check if currencies exist and fromRate is valid (non-zero to prevent division by zero)
  if (fromRate == null || toRate == null || fromRate === 0) {
    // Currency not found in exchange rates or invalid rate - show error
    resultInput.value = '';
    if (rateDisplay) {
      rateDisplay.textContent = translations.error;
    }
    return;
  }

  // Calculate conversion
  // rate = toRate / fromRate
  const rate = toRate / fromRate;

  const result = amount * rate;

  // Format result with appropriate decimal places
  let formattedResult: string;
  if (result >= 1000) {
    formattedResult = result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (result >= 1) {
    formattedResult = result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  } else {
    formattedResult = result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: RATE_DISPLAY_PRECISION,
    });
  }

  resultInput.value = formattedResult;

  // Display exchange rate
  if (rateDisplay) {
    rateDisplay.textContent = `${translations.rate}: 1 ${fromCurrency} = ${rate.toFixed(RATE_DISPLAY_PRECISION)} ${toCurrency}`;
  }
}

function swapCurrencies() {
  const fromSelect = document.getElementById('from-currency') as HTMLSelectElement;
  const toSelect = document.getElementById('to-currency') as HTMLSelectElement;

  if (!fromSelect || !toSelect) {
    return;
  }

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  convert();
}

export function initCurrencyConverter() {
  // Populate currency dropdowns
  populateCurrencySelects();

  // Fetch initial exchange rates
  fetchExchangeRates().then(() => {
    convert();
  });

  // Set up event listeners
  const amountInput = document.getElementById('amount');
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const executeBtn = document.getElementById('execute');
  const swapBtn = document.getElementById('swap-currencies');
  const autoUpdateCheckbox = document.getElementById('auto-update') as HTMLInputElement;

  const triggerConvert = () => {
    if (autoUpdateCheckbox?.checked) {
      convert();
    }
  };

  amountInput?.addEventListener('input', triggerConvert);
  fromSelect?.addEventListener('change', triggerConvert);
  toSelect?.addEventListener('change', triggerConvert);

  executeBtn?.addEventListener('click', () => {
    convert();
  });

  swapBtn?.addEventListener('click', () => {
    swapCurrencies();
  });

  // Re-initialize Lucide icons for the swap button
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
