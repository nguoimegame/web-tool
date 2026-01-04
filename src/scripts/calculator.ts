// Calculator state
let currentInput = '';
let expression = '';
let history: Array<{ expression: string; result: string }> = [];

// DOM Elements
let resultInput: HTMLInputElement;
let expressionDisplay: HTMLElement;
let historyList: HTMLElement;

// Settings
let soundEnabled = true;
let vibrationEnabled = true;

// Regex patterns
const OPERATOR_REGEX = /[+\-*/]/;
const VALID_EXPRESSION_REGEX = /^[\d+\-*/().\s]+$/;

// Safe math evaluation
function safeEval(expr: string): number {
  // Replace display operators with actual operators
  const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Validate the expression contains only valid characters
  if (!VALID_EXPRESSION_REGEX.test(sanitized)) {
    throw new Error('Invalid expression');
  }

  // Use Function constructor for safer evaluation than eval
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const fn = new Function(`return ${sanitized}`);
  const result = fn();

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }

  return result;
}

function updateDisplay(): void {
  if (resultInput) {
    resultInput.value = currentInput;
    resultInput.classList.remove('error');
  }
  if (expressionDisplay) {
    expressionDisplay.textContent = expression;
  }
}

function appendValue(value: string): void {
  // Prevent multiple decimal points in a number
  if (value === '.') {
    const parts = currentInput.split(OPERATOR_REGEX);
    const lastNumber = parts[parts.length - 1];
    if (lastNumber.includes('.')) {
      return;
    }
  }

  // Prevent multiple operators in a row
  const lastChar = currentInput.slice(-1);
  const isOperator = OPERATOR_REGEX.test(value);
  const lastIsOperator = OPERATOR_REGEX.test(lastChar);

  if (isOperator && lastIsOperator) {
    currentInput = currentInput.slice(0, -1);
  }

  // Prevent starting with an operator (except minus)
  if (currentInput === '' && isOperator && value !== '-') {
    return;
  }

  currentInput += value;
  updateDisplay();
  playFeedback();
}

function clearAll(): void {
  currentInput = '';
  expression = '';
  updateDisplay();
  playFeedback();
}

function clearEntry(): void {
  currentInput = '';
  updateDisplay();
  playFeedback();
}

function backspace(): void {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
  playFeedback();
}

function calculate(): void {
  if (!currentInput) {
    return;
  }

  try {
    const result = safeEval(currentInput);
    const formattedResult = formatResult(result);

    // Add to history
    addToHistory(currentInput, formattedResult);

    expression = currentInput + ' =';
    currentInput = formattedResult;
    updateDisplay();
  } catch {
    resultInput.classList.add('error');
    resultInput.value = 'Error';
    setTimeout(() => {
      resultInput.classList.remove('error');
      currentInput = '';
      updateDisplay();
    }, 1500);
  }
  playFeedback();
}

function formatResult(num: number): string {
  // Handle very large or very small numbers
  if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6);
  }

  // Round to avoid floating point precision issues
  const rounded = Math.round(num * 1e10) / 1e10;

  // Format with reasonable decimal places
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }

  return rounded.toPrecision(10).replace(/\.?0+$/, '');
}

function addToHistory(expr: string, result: string): void {
  history.unshift({ expression: expr, result });

  // Keep only last 20 items
  if (history.length > 20) {
    history = history.slice(0, 20);
  }

  saveHistory();
  renderHistory();
}

function renderHistory(): void {
  if (!historyList) {
    return;
  }

  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
    return;
  }

  historyList.innerHTML = history
    .map(
      (item, index) => `
    <div class="history-item" data-index="${index}">
      <div class="history-expression">${escapeHtml(item.expression)}</div>
      <div class="history-result">= ${escapeHtml(item.result)}</div>
    </div>
  `
    )
    .join('');
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function loadHistory(): void {
  try {
    const saved = localStorage.getItem('calculator-history');
    if (saved) {
      history = JSON.parse(saved);
    }
  } catch {
    history = [];
  }
}

function saveHistory(): void {
  try {
    localStorage.setItem('calculator-history', JSON.stringify(history));
  } catch {
    // Ignore storage errors
  }
}

function clearHistory(): void {
  history = [];
  saveHistory();
  renderHistory();
  playFeedback();
}

function playFeedback(): void {
  // Vibration feedback on mobile
  if (vibrationEnabled && 'vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

function handleKeyboard(event: KeyboardEvent): void {
  const key = event.key;

  // Prevent default for calculator keys
  if (/^[\d+\-*/.=]$/.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
    event.preventDefault();
  }

  // Number and operator keys
  if (/^[\d.]$/.test(key)) {
    appendValue(key);
    highlightButton(key);
  } else if (key === '+') {
    appendValue('+');
    highlightButton('+');
  } else if (key === '-') {
    appendValue('-');
    highlightButton('-');
  } else if (key === '*') {
    appendValue('*');
    highlightButton('*');
  } else if (key === '/') {
    appendValue('/');
    highlightButton('/');
  } else if (key === 'Enter' || key === '=') {
    calculate();
    highlightButton('=');
  } else if (key === 'Backspace') {
    backspace();
    highlightButton('backspace');
  } else if (key === 'Escape') {
    clearAll();
    highlightButton('clear-all');
  } else if (key === 'Delete') {
    clearEntry();
    highlightButton('clear');
  }
}

function highlightButton(value: string): void {
  let selector = '';

  if (value === '=') {
    selector = '[data-action="calculate"]';
  } else if (value === 'backspace') {
    selector = '[data-action="backspace"]';
  } else if (value === 'clear-all') {
    selector = '[data-action="clear-all"]';
  } else if (value === 'clear') {
    selector = '[data-action="clear"]';
  } else {
    selector = `[data-value="${value}"]`;
  }

  const button = document.querySelector(selector);
  if (button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 100);
  }
}

function loadSettings(): void {
  try {
    soundEnabled = localStorage.getItem('calculator-sound') !== 'false';
    vibrationEnabled = localStorage.getItem('calculator-vibration') !== 'false';
  } catch {
    // Use defaults
  }
}

function saveSettings(): void {
  try {
    localStorage.setItem('calculator-sound', String(soundEnabled));
    localStorage.setItem('calculator-vibration', String(vibrationEnabled));
  } catch {
    // Ignore storage errors
  }
}

export function initCalculator(): void {
  // Get DOM elements
  resultInput = document.getElementById('result') as HTMLInputElement;
  expressionDisplay = document.getElementById('expression') as HTMLElement;
  historyList = document.getElementById('history-list') as HTMLElement;

  // Load saved data
  loadHistory();
  loadSettings();
  renderHistory();

  // Button click handlers
  document.querySelectorAll('.btn-calc').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      const action = button.getAttribute('data-action');

      if (value) {
        appendValue(value);
      } else if (action) {
        switch (action) {
          case 'clear-all':
            clearAll();
            break;
          case 'clear':
            clearEntry();
            break;
          case 'backspace':
            backspace();
            break;
          case 'calculate':
            calculate();
            break;
        }
      }
    });
  });

  // History item click
  historyList?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const historyItem = target.closest('.history-item') as HTMLElement;
    if (historyItem) {
      const index = parseInt(historyItem.dataset.index || '0', 10);
      if (history[index]) {
        currentInput = history[index].result;
        expression = '';
        updateDisplay();
      }
    }
  });

  // Clear history button
  document.getElementById('clear-history')?.addEventListener('click', clearHistory);

  // Keyboard support
  document.addEventListener('keydown', handleKeyboard);

  // Input field direct editing
  resultInput?.addEventListener('input', () => {
    currentInput = resultInput.value;
  });

  resultInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculate();
    }
  });

  // Settings toggles
  const soundToggle = document.getElementById('sound-enabled') as HTMLInputElement;
  const vibrationToggle = document.getElementById('vibration-enabled') as HTMLInputElement;

  if (soundToggle) {
    soundToggle.checked = soundEnabled;
    soundToggle.addEventListener('change', () => {
      soundEnabled = soundToggle.checked;
      saveSettings();
    });
  }

  if (vibrationToggle) {
    vibrationToggle.checked = vibrationEnabled;
    vibrationToggle.addEventListener('change', () => {
      vibrationEnabled = vibrationToggle.checked;
      saveSettings();
    });
  }

  // Initial display
  updateDisplay();
}
