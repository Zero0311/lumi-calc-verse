
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type ButtonType = 'number' | 'operator' | 'function' | 'memory' | 'equals';

interface CalculatorButtonProps {
  value: string;
  display?: string;
  type?: ButtonType;
  span?: number;
  onClick: () => void;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  display,
  type = 'number',
  span = 1,
  onClick,
}) => {
  return (
    <button
      className={cn(
        'flex items-center justify-center rounded-md p-2 font-medium transition-colors duration-200 focus:outline-none active:animate-button-press',
        type === 'number' && 'bg-calculator-button text-calculator-button-text hover:bg-calculator-button-hover active:bg-calculator-button-active',
        type === 'operator' && 'bg-calculator-operator text-calculator-operator-text hover:bg-calculator-operator-hover active:bg-calculator-operator-active',
        type === 'function' && 'bg-calculator-function text-calculator-function-text hover:bg-calculator-function-hover active:bg-calculator-function-active',
        type === 'memory' && 'bg-calculator-memory text-calculator-memory-text hover:bg-calculator-memory-hover active:bg-calculator-memory-active',
        type === 'equals' && 'bg-calculator-equals text-calculator-equals-text hover:bg-calculator-equals-hover active:bg-calculator-equals-active',
        span === 2 && 'col-span-2',
      )}
      onClick={onClick}
      aria-label={value}
    >
      {display || value}
    </button>
  );
};

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [memory, setMemory] = useState<number>(0);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (shouldResetDisplay) {
      setDisplay(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
    setCurrentValue(display === '0' ? digit : display + digit);
  };

  // Handle decimal point
  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
    setCurrentValue(display + (display.includes('.') ? '' : '.'));
  };

  // Handle operator
  const handleOperator = (op: string) => {
    if (currentValue !== null) {
      if (storedValue !== null && operator) {
        // Complete the previous operation
        const result = calculate(storedValue, parseFloat(currentValue), operator);
        setHistory([...history, `${storedValue} ${operator} ${currentValue} = ${result}`]);
        setStoredValue(result);
        setDisplay(result.toString());
      } else {
        setStoredValue(parseFloat(currentValue));
      }
    } else if (storedValue === null) {
      setStoredValue(parseFloat(display));
    }
    setOperator(op);
    setShouldResetDisplay(true);
  };

  // Handle equals
  const handleEquals = () => {
    if (storedValue !== null && currentValue !== null && operator) {
      const result = calculate(storedValue, parseFloat(currentValue), operator);
      setHistory([...history, `${storedValue} ${operator} ${currentValue} = ${result}`]);
      setDisplay(result.toString());
      setStoredValue(result);
      setCurrentValue(result.toString());
      setOperator(null);
      setShouldResetDisplay(true);
    }
  };

  // Handle clear
  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setStoredValue(null);
    setOperator(null);
  };

  // Calculate result
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : NaN;
      default:
        return b;
    }
  };

  // Handle memory functions
  const handleMemory = (action: string) => {
    const currentNum = parseFloat(display);
    
    switch (action) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setCurrentValue(memory.toString());
        setShouldResetDisplay(true);
        break;
      case 'M+':
        setMemory(memory + currentNum);
        setShouldResetDisplay(true);
        break;
      case 'M-':
        setMemory(memory - currentNum);
        setShouldResetDisplay(true);
        break;
      case 'MS':
        setMemory(currentNum);
        setShouldResetDisplay(true);
        break;
    }
  };

  // Handle scientific functions
  const handleFunction = (func: string) => {
    const currentNum = parseFloat(display);
    let result: number;
    
    switch (func) {
      case 'sin':
        result = Math.sin(currentNum * (Math.PI / 180)); // Convert to radians
        break;
      case 'cos':
        result = Math.cos(currentNum * (Math.PI / 180));
        break;
      case 'tan':
        result = Math.tan(currentNum * (Math.PI / 180));
        break;
      case 'log':
        result = Math.log10(currentNum);
        break;
      case 'ln':
        result = Math.log(currentNum);
        break;
      case 'sqrt':
        result = Math.sqrt(currentNum);
        break;
      case 'x²':
        result = Math.pow(currentNum, 2);
        break;
      case 'x³':
        result = Math.pow(currentNum, 3);
        break;
      case '1/x':
        result = 1 / currentNum;
        break;
      case 'x!':
        result = factorial(currentNum);
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      case '%':
        result = currentNum / 100;
        break;
      case '+/-':
        result = -currentNum;
        break;
      default:
        return;
    }
    
    setDisplay(result.toString());
    setCurrentValue(result.toString());
    setShouldResetDisplay(true);
    
    // Add to history for some functions
    if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'x²', 'x³', '1/x', 'x!'].includes(func)) {
      setHistory([...history, `${func}(${currentNum}) = ${result}`]);
    }
  };

  // Factorial function
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    if (!Number.isInteger(n) || n < 0) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Backspace function
  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setCurrentValue(display.slice(0, -1));
    } else {
      setDisplay('0');
      setCurrentValue('0');
    }
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
      <div className="calculator-container bg-card rounded-lg shadow-lg p-4 w-full max-w-md">
        {/* Display */}
        <div className="mb-4">
          <div className="bg-calculator-display p-4 rounded-lg text-right mb-1 min-h-16 flex items-center justify-end">
            <div className="text-lg font-mono truncate max-w-full text-calculator-display-text">
              {storedValue !== null && operator ? `${storedValue} ${operator}` : ''}
            </div>
          </div>
          <div className="bg-calculator-display p-4 rounded-lg text-right overflow-x-auto">
            <div className="text-3xl font-mono truncate text-calculator-display-text">{display}</div>
          </div>
        </div>

        {/* Memory indicators */}
        <div className="flex justify-between mb-2 text-sm font-mono">
          <div className={memory !== 0 ? "text-calculator-memory" : "text-muted-foreground"}>
            {memory !== 0 ? `M: ${memory}` : 'M: 0'}
          </div>
          <button 
            className="text-calculator-function-text hover:text-calculator-function-hover"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>

        {/* Memory buttons */}
        <div className="grid grid-cols-5 gap-2 mb-2">
          <CalculatorButton value="MC" type="memory" onClick={() => handleMemory('MC')} />
          <CalculatorButton value="MR" type="memory" onClick={() => handleMemory('MR')} />
          <CalculatorButton value="MS" type="memory" onClick={() => handleMemory('MS')} />
          <CalculatorButton value="M+" type="memory" onClick={() => handleMemory('M+')} />
          <CalculatorButton value="M-" type="memory" onClick={() => handleMemory('M-')} />
        </div>

        {/* Scientific buttons */}
        <div className="grid grid-cols-5 gap-2 mb-2">
          <CalculatorButton value="sin" type="function" onClick={() => handleFunction('sin')} />
          <CalculatorButton value="cos" type="function" onClick={() => handleFunction('cos')} />
          <CalculatorButton value="tan" type="function" onClick={() => handleFunction('tan')} />
          <CalculatorButton value="log" type="function" onClick={() => handleFunction('log')} />
          <CalculatorButton value="ln" type="function" onClick={() => handleFunction('ln')} />
        </div>

        <div className="grid grid-cols-5 gap-2 mb-2">
          <CalculatorButton value="sqrt" display="√" type="function" onClick={() => handleFunction('sqrt')} />
          <CalculatorButton value="x²" type="function" onClick={() => handleFunction('x²')} />
          <CalculatorButton value="x³" type="function" onClick={() => handleFunction('x³')} />
          <CalculatorButton value="1/x" type="function" onClick={() => handleFunction('1/x')} />
          <CalculatorButton value="x!" type="function" onClick={() => handleFunction('x!')} />
        </div>

        <div className="grid grid-cols-5 gap-2 mb-2">
          <CalculatorButton value="π" type="function" onClick={() => handleFunction('π')} />
          <CalculatorButton value="e" type="function" onClick={() => handleFunction('e')} />
          <CalculatorButton value="%" type="function" onClick={() => handleFunction('%')} />
          <CalculatorButton value="C" type="function" onClick={handleClear} />
          <CalculatorButton value="⌫" type="function" onClick={handleBackspace} />
        </div>

        {/* Numbers and basic operators */}
        <div className="grid grid-cols-4 gap-2">
          <CalculatorButton value="7" onClick={() => handleDigit('7')} />
          <CalculatorButton value="8" onClick={() => handleDigit('8')} />
          <CalculatorButton value="9" onClick={() => handleDigit('9')} />
          <CalculatorButton value="÷" type="operator" onClick={() => handleOperator('÷')} />
          
          <CalculatorButton value="4" onClick={() => handleDigit('4')} />
          <CalculatorButton value="5" onClick={() => handleDigit('5')} />
          <CalculatorButton value="6" onClick={() => handleDigit('6')} />
          <CalculatorButton value="×" type="operator" onClick={() => handleOperator('×')} />
          
          <CalculatorButton value="1" onClick={() => handleDigit('1')} />
          <CalculatorButton value="2" onClick={() => handleDigit('2')} />
          <CalculatorButton value="3" onClick={() => handleDigit('3')} />
          <CalculatorButton value="-" type="operator" onClick={() => handleOperator('-')} />
          
          <CalculatorButton value="0" span={2} onClick={() => handleDigit('0')} />
          <CalculatorButton value="." onClick={handleDecimal} />
          <CalculatorButton value="+" type="operator" onClick={() => handleOperator('+')} />
          
          <CalculatorButton value="+/-" onClick={() => handleFunction('+/-')} />
          <CalculatorButton value="=" type="equals" span={2} onClick={handleEquals} />
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="calculator-history bg-card rounded-lg shadow-lg p-4 min-w-72 w-full md:max-w-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Calculation History</h3>
            <button
              className="text-sm text-destructive hover:underline"
              onClick={handleClearHistory}
            >
              Clear All
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No calculations yet</p>
            ) : (
              history.map((entry, index) => (
                <div
                  key={index}
                  className="bg-muted/50 p-2 rounded text-sm font-mono"
                >
                  {entry}
                </div>
              )).reverse()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
