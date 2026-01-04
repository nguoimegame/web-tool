// Calculator state
let currentInput = '';
let expression = '';
let history: Array<{ expression: string; result: string }> = [];
let lastAnswer = '0';
let isDegreeMode = true;
let isInverseMode = false;

// DOM Elements
let resultInput: HTMLInputElement;
let expressionDisplay: HTMLElement;
let historyList: HTMLElement;
let degRadBtn: HTMLElement;
let invBtn: HTMLElement;
let historyPanel: HTMLElement;

// Settings
let soundEnabled = true;
let vibrationEnabled = true;
let scientificMode = true;

// Regex patterns
const OPERATOR_REGEX = /[+\-*/^]/;

// Constants
const PI = Math.PI;
const E = Math.E;

// Helper function to convert degrees to radians
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Helper function to convert radians to degrees
function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Factorial function
function factorial(n: number): number {
  if (n < 0) {
    throw new Error('Factorial of negative number');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  if (n > 170) {
    throw new Error('Number too large');
  }
  if (!Number.isInteger(n)) {
    // Gamma function approximation for non-integers
    return gamma(n + 1);
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Gamma function approximation (Lanczos approximation)
function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Safe math evaluation with scientific functions support
function safeEval(expr: string): number {
  // Replace display operators with actual operators
  let sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Replace scientific notation E
  sanitized = sanitized.replace(/(\d)E([+-]?\d+)/gi, '$1e$2');

  // Handle implicit multiplication (e.g., 2π, 3(4))
  sanitized = sanitized.replace(/(\d)([πe(])/g, '$1*$2');
  sanitized = sanitized.replace(/([πe)])(\d)/g, '$1*$2');
  sanitized = sanitized.replace(/(\))(\()/g, '$1*$2');
  sanitized = sanitized.replace(/([πe])([πe(])/g, '$1*$2');

  // Replace constants
  sanitized = sanitized.replace(/π/g, String(PI));
  sanitized = sanitized.replace(/(?<![a-zA-Z])e(?![a-zA-Z\d])/g, String(E));

  // Handle power operator
  sanitized = sanitized.replace(/\^/g, '**');

  // Validate the expression contains only valid characters
  const validChars = /^[\d+\-*/().e\s]+$/;
  const testExpr = sanitized.replace(/\*\*/g, '^');
  if (!validChars.test(testExpr.replace(/\^/g, ''))) {
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

function updateModeButtons(): void {
  if (degRadBtn) {
    degRadBtn.textContent = isDegreeMode ? 'Deg' : 'Rad';
    degRadBtn.classList.toggle('active', !isDegreeMode);
  }
  if (invBtn) {
    invBtn.classList.toggle('active', isInverseMode);
  }

  // Update function button labels
  const sinBtn = document.getElementById('sin-btn');
  const cosBtn = document.getElementById('cos-btn');
  const tanBtn = document.getElementById('tan-btn');
  const lnBtn = document.getElementById('ln-btn');
  const logBtn = document.getElementById('log-btn');
  const sqrtBtn = document.getElementById('sqrt-btn');
  const powerBtn = document.getElementById('power-btn');

  if (isInverseMode) {
    if (sinBtn) {
      sinBtn.textContent = 'sin⁻¹';
    }
    if (cosBtn) {
      cosBtn.textContent = 'cos⁻¹';
    }
    if (tanBtn) {
      tanBtn.textContent = 'tan⁻¹';
    }
    if (lnBtn) {
      lnBtn.textContent = 'eˣ';
    }
    if (logBtn) {
      logBtn.textContent = '10ˣ';
    }
    if (sqrtBtn) {
      sqrtBtn.textContent = 'x²';
    }
    if (powerBtn) {
      powerBtn.innerHTML = '<sup>y</sup>√x';
    }
  } else {
    if (sinBtn) {
      sinBtn.textContent = 'sin';
    }
    if (cosBtn) {
      cosBtn.textContent = 'cos';
    }
    if (tanBtn) {
      tanBtn.textContent = 'tan';
    }
    if (lnBtn) {
      lnBtn.textContent = 'ln';
    }
    if (logBtn) {
      logBtn.textContent = 'log';
    }
    if (sqrtBtn) {
      sqrtBtn.textContent = '√';
    }
    if (powerBtn) {
      powerBtn.innerHTML = 'x<sup>y</sup>';
    }
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

  // Prevent multiple operators in a row (except for parentheses and power)
  const lastChar = currentInput.slice(-1);
  const isOperator = /[+\-*/]/.test(value);
  const lastIsOperator = /[+\-*/]/.test(lastChar);

  if (isOperator && lastIsOperator && value !== '-') {
    currentInput = currentInput.slice(0, -1);
  }

  // Prevent starting with certain operators
  if (currentInput === '' && /[+*/^]/.test(value)) {
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

// Apply unary function to current input or result
function applyUnaryFunction(fn: (x: number) => number, fnName: string): void {
  if (currentInput === '' || currentInput === '-') {
    return;
  }

  try {
    const value = safeEval(currentInput);
    const result = fn(value);

    if (!isFinite(result)) {
      throw new Error('Invalid result');
    }

    expression = `${fnName}(${currentInput})`;
    currentInput = formatResult(result);
    updateDisplay();
  } catch {
    showError();
  }
  playFeedback();
}

// Scientific functions
function applySin(): void {
  if (isInverseMode) {
    applyUnaryFunction((x) => {
      const result = Math.asin(x);
      return isDegreeMode ? toDegrees(result) : result;
    }, 'sin⁻¹');
  } else {
    applyUnaryFunction((x) => Math.sin(isDegreeMode ? toRadians(x) : x), 'sin');
  }
  isInverseMode = false;
  updateModeButtons();
}

function applyCos(): void {
  if (isInverseMode) {
    applyUnaryFunction((x) => {
      const result = Math.acos(x);
      return isDegreeMode ? toDegrees(result) : result;
    }, 'cos⁻¹');
  } else {
    applyUnaryFunction((x) => Math.cos(isDegreeMode ? toRadians(x) : x), 'cos');
  }
  isInverseMode = false;
  updateModeButtons();
}

function applyTan(): void {
  if (isInverseMode) {
    applyUnaryFunction((x) => {
      const result = Math.atan(x);
      return isDegreeMode ? toDegrees(result) : result;
    }, 'tan⁻¹');
  } else {
    applyUnaryFunction((x) => Math.tan(isDegreeMode ? toRadians(x) : x), 'tan');
  }
  isInverseMode = false;
  updateModeButtons();
}

function applyLn(): void {
  if (isInverseMode) {
    applyUnaryFunction((x) => Math.exp(x), 'eˣ');
  } else {
    applyUnaryFunction((x) => Math.log(x), 'ln');
  }
  isInverseMode = false;
  updateModeButtons();
}

function applyLog(): void {
  if (isInverseMode) {
    applyUnaryFunction((x) => Math.pow(10, x), '10ˣ');
  } else {
    applyUnaryFunction((x) => Math.log10(x), 'log');
  }
  isInverseMode = false;
  updateModeButtons();
}

function applySqrt(): void {
  if (isInverseMode) {
    applyUnaryFunction((x) => x * x, 'x²');
  } else {
    applyUnaryFunction((x) => Math.sqrt(x), '√');
  }
  isInverseMode = false;
  updateModeButtons();
}

function applySquare(): void {
  applyUnaryFunction((x) => x * x, 'x²');
}

function applyReciprocal(): void {
  applyUnaryFunction((x) => 1 / x, '1/x');
}

function applyAbs(): void {
  applyUnaryFunction((x) => Math.abs(x), '|x|');
}

function applyFactorial(): void {
  applyUnaryFunction((x) => factorial(x), 'x!');
}

function applyPercent(): void {
  applyUnaryFunction((x) => x / 100, '%');
}

function applyPower(): void {
  if (isInverseMode) {
    // y-th root: add ^(1/) pattern
    currentInput += '^(1/';
  } else {
    currentInput += '^';
  }
  updateDisplay();
  playFeedback();
  isInverseMode = false;
  updateModeButtons();
}

function insertPi(): void {
  currentInput += 'π';
  updateDisplay();
  playFeedback();
}

function insertEuler(): void {
  currentInput += 'e';
  updateDisplay();
  playFeedback();
}

function insertAns(): void {
  currentInput += lastAnswer;
  updateDisplay();
  playFeedback();
}

function insertExp(): void {
  currentInput += 'E';
  updateDisplay();
  playFeedback();
}

function toggleDegRad(): void {
  isDegreeMode = !isDegreeMode;
  updateModeButtons();
  saveSettings();
  playFeedback();
}

function toggleInverse(): void {
  isInverseMode = !isInverseMode;
  updateModeButtons();
  playFeedback();
}

function showError(): void {
  resultInput.classList.add('error');
  resultInput.value = 'Error';
  setTimeout(() => {
    resultInput.classList.remove('error');
    currentInput = '';
    updateDisplay();
  }, 1500);
}

function calculate(): void {
  if (!currentInput) {
    return;
  }

  // Auto-close parentheses
  const openParens = (currentInput.match(/\(/g) || []).length;
  const closeParens = (currentInput.match(/\)/g) || []).length;
  if (openParens > closeParens) {
    currentInput += ')'.repeat(openParens - closeParens);
  }

  try {
    const result = safeEval(currentInput);
    const formattedResult = formatResult(result);

    // Add to history
    addToHistory(currentInput, formattedResult);

    // Save last answer
    lastAnswer = formattedResult;

    expression = currentInput + ' =';
    currentInput = formattedResult;
    updateDisplay();
  } catch {
    showError();
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
    const savedAnswer = localStorage.getItem('calculator-last-answer');
    if (savedAnswer) {
      lastAnswer = savedAnswer;
    }
  } catch {
    history = [];
  }
}

function saveHistory(): void {
  try {
    localStorage.setItem('calculator-history', JSON.stringify(history));
    localStorage.setItem('calculator-last-answer', lastAnswer);
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

function toggleHistoryPanel(): void {
  if (historyPanel) {
    historyPanel.classList.toggle('show');
  }
}

function handleKeyboard(event: KeyboardEvent): void {
  const key = event.key;

  // Prevent default for calculator keys
  if (/^[\d+\-*/.=()^%]$/.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
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
  } else if (key === '^') {
    applyPower();
  } else if (key === '(' || key === ')') {
    appendValue(key);
    highlightButton(key);
  } else if (key === '%') {
    applyPercent();
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
  } else if (key === 'p') {
    insertPi();
  } else if (key === 'e' && event.ctrlKey) {
    insertEuler();
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
    scientificMode = localStorage.getItem('calculator-scientific') !== 'false';
    isDegreeMode = localStorage.getItem('calculator-degree-mode') !== 'false';
  } catch {
    // Use defaults
  }
}

function saveSettings(): void {
  try {
    localStorage.setItem('calculator-sound', String(soundEnabled));
    localStorage.setItem('calculator-vibration', String(vibrationEnabled));
    localStorage.setItem('calculator-scientific', String(scientificMode));
    localStorage.setItem('calculator-degree-mode', String(isDegreeMode));
  } catch {
    // Ignore storage errors
  }
}

function updateScientificMode(): void {
  const calculator = document.querySelector('.calculator');
  if (calculator) {
    calculator.classList.toggle('scientific', scientificMode);
  }
}

export function initCalculator(): void {
  // Get DOM elements
  resultInput = document.getElementById('result') as HTMLInputElement;
  expressionDisplay = document.getElementById('expression') as HTMLElement;
  historyList = document.getElementById('history-list') as HTMLElement;
  degRadBtn = document.getElementById('deg-rad-btn') as HTMLElement;
  invBtn = document.getElementById('inv-btn') as HTMLElement;
  historyPanel = document.getElementById('history-panel') as HTMLElement;

  // Load saved data
  loadHistory();
  loadSettings();
  renderHistory();
  updateModeButtons();
  updateScientificMode();

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
          case 'toggle-deg':
            toggleDegRad();
            break;
          case 'toggle-inv':
            toggleInverse();
            break;
          case 'sin':
            applySin();
            break;
          case 'cos':
            applyCos();
            break;
          case 'tan':
            applyTan();
            break;
          case 'ln':
            applyLn();
            break;
          case 'log':
            applyLog();
            break;
          case 'sqrt':
            applySqrt();
            break;
          case 'square':
            applySquare();
            break;
          case 'power':
            applyPower();
            break;
          case 'pi':
            insertPi();
            break;
          case 'euler':
            insertEuler();
            break;
          case 'ans':
            insertAns();
            break;
          case 'exp':
            insertExp();
            break;
          case 'factorial':
            applyFactorial();
            break;
          case 'percent':
            applyPercent();
            break;
          case 'reciprocal':
            applyReciprocal();
            break;
          case 'abs':
            applyAbs();
            break;
        }
      }
    });
  });

  // History toggle button
  document.getElementById('toggle-history')?.addEventListener('click', toggleHistoryPanel);

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
  const scientificToggle = document.getElementById('scientific-mode') as HTMLInputElement;

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

  if (scientificToggle) {
    scientificToggle.checked = scientificMode;
    scientificToggle.addEventListener('change', () => {
      scientificMode = scientificToggle.checked;
      updateScientificMode();
      saveSettings();
    });
  }

  // Initial display
  updateDisplay();
}
