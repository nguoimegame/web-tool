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

  const options = Object.entries(currencies)
    .map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`)
    .join('');

  fromSelect.innerHTML = options;
  toSelect.innerHTML = options;

  // Set default values
  fromSelect.value = 'USD';
  toSelect.value = 'EUR';
}

async function fetchExchangeRates(base: string = 'USD'): Promise<boolean> {
  const translations = getTranslations();
  try {
    updateStatus(translations.loading, 'loading');

    // Using the free ExchangeRate-API (no API key required)
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);

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

  // Calculate conversion
  // If base is USD, we need to convert from USD rates
  // rate = toRate / fromRate
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;
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
      maximumFractionDigits: 6,
    });
  }

  resultInput.value = formattedResult;

  // Display exchange rate
  if (rateDisplay) {
    rateDisplay.textContent = `${translations.rate}: 1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
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
