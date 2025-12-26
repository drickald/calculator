const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Theme Toggle
const themeBtns = document.querySelectorAll('.theme-btn');
const html = document.documentElement;

// Load saved theme or default to 'day'
const savedTheme = localStorage.getItem('theme') || 'day';
html.setAttribute('data-theme', savedTheme);
updateThemeButtonStates();

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeButtonStates();
    });
});

function updateThemeButtonStates() {
    themeBtns.forEach(btn => {
        const theme = btn.getAttribute('data-theme');
        if (theme === html.getAttribute('data-theme')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateDisplay() {
    if (operator !== null && !shouldResetDisplay) {
        display.value = `${previousInput} ${operator} ${currentInput}`;
    } else if (operator !== null && shouldResetDisplay) {
        display.value = `${previousInput} ${operator}`;
    } else {
        display.value = currentInput;
    }
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLastChar() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function handleNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0') {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function handlePercentage() {
    const num = parseFloat(currentInput);
    currentInput = String(num / 100);
    updateDisplay();
}

function calculate() {
    if (operator === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case 'x':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    currentInput = String(result);
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (value === 'C') {
            clearDisplay();
        } else if (value === 'DEL') {
            deleteLastChar();
        } else if (value === '.') {
            handleDecimal();
        } else if (value === '%') {
            handlePercentage();
        } else if (value === '=' || value === '+' || value === '-' || value === 'x' || value === '/') {
            if (value === '=') {
                calculate();
            } else {
                handleOperator(value);
            }
        } else {
            handleNumber(value);
        }
    });
});

// Initialize display
updateDisplay();
