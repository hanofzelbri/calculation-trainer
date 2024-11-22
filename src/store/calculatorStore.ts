import { create } from 'zustand';
import { Operation, GameState, Settings } from '../types';
import { getRandomNumber, getRandomNumberForAddition } from '@/utils/math';

const generateTask = (operation: Operation, maxDigits: number): { numbers: number[], correctAnswer: number } => {
    let numbers: number[] = [];
    let correctAnswer = 0;

    switch (operation) {
        case Operation.Addition:
            const firstNumber = getRandomNumberForAddition(maxDigits);
            const secondNumber = getRandomNumberForAddition(maxDigits, firstNumber);
            numbers = [firstNumber, secondNumber];
            correctAnswer = firstNumber + secondNumber;
            break;
        case Operation.Subtraction:
            numbers = Array(2).fill(0).map(() => getRandomNumber(maxDigits));
            correctAnswer = numbers[0] - numbers[1];
            break;
        case Operation.Multiplication:
            numbers = Array(2).fill(0).map(() => getRandomNumber(maxDigits));
            correctAnswer = numbers[0] * numbers[1];
            break;
        case Operation.Division:
            numbers = Array(2).fill(0).map(() => getRandomNumber(maxDigits));
            correctAnswer = numbers[0] / numbers[1];
            break;
    }

    return { numbers, correctAnswer };
};

const generateSubtractionNumbers = (maxDigits: number): [number, number] => {
    const max = Math.pow(10, maxDigits) - 1;
    const firstNumber = getRandomNumber(maxDigits);
    // Ensure second number is smaller than first number to get positive result
    const secondNumber = Math.floor(Math.random() * firstNumber);
    return [firstNumber, secondNumber];
};

const generateTaskUpdated = (operation: Operation, maxDigits: number): { numbers: number[], correctAnswer: number } => {
    let numbers: number[] = [];
    let correctAnswer = 0;

    switch (operation) {
        case Operation.Addition:
            const firstNumber = getRandomNumberForAddition(maxDigits);
            const secondNumber = getRandomNumberForAddition(maxDigits, firstNumber);
            numbers = [firstNumber, secondNumber];
            correctAnswer = firstNumber + secondNumber;
            break;
        case Operation.Subtraction:
            const [minuend, subtrahend] = generateSubtractionNumbers(maxDigits);
            numbers = [minuend, subtrahend];
            correctAnswer = minuend - subtrahend;
            break;
        case Operation.Multiplication:
            numbers = Array(2).fill(0).map(() => getRandomNumber(maxDigits));
            correctAnswer = numbers[0] * numbers[1];
            break;
        case Operation.Division:
            numbers = Array(2).fill(0).map(() => getRandomNumber(maxDigits));
            correctAnswer = numbers[0] / numbers[1];
            break;
    }

    return { numbers, correctAnswer };
};

const getRandomOperation = (settings: Settings): Operation => {
    const enabledOperations = [];
    if (settings.addition.enabled) enabledOperations.push(Operation.Addition);
    if (settings.subtraction.enabled) enabledOperations.push(Operation.Subtraction);
    
    if (enabledOperations.length === 0) return Operation.Addition; // Fallback
    return enabledOperations[Math.floor(Math.random() * enabledOperations.length)];
};

interface CalculatorStore {
    currentNumbers: number[];
    correctAnswer: number;
    maxDigits: number;
    currentOperation: Operation;
    history: GameState['history'];
    taskStartTime: number | null;
    showResultPopup: boolean;
    settings: Settings;
    startNewTask: () => void;
    checkAnswer: (answer: number) => boolean;
    setSettings: (newSettings: Partial<Settings>) => void;
}

const initialSettings: Settings = {
    addition: {
        enabled: true,
        maxNumber: 100,
        numberCount: 2,
    },
    subtraction: {
        enabled: true,
        maxNumber: 100,
        numberCount: 2,
    },
};

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
    currentNumbers: [],
    correctAnswer: 0,
    maxDigits: 2,
    currentOperation: Operation.Addition,
    history: [],
    taskStartTime: null,
    showResultPopup: false,
    settings: initialSettings,

    startNewTask: () => {
        const state = get();
        const newOperation = getRandomOperation(state.settings);
        const { numbers, correctAnswer } = generateTaskUpdated(newOperation, state.maxDigits);
        set({
            currentOperation: newOperation,
            currentNumbers: numbers,
            correctAnswer,
            taskStartTime: Date.now(),
            showResultPopup: false
        });
    },

    checkAnswer: (answer: number) => {
        const state = get();
        const isCorrect = answer === state.correctAnswer;
        const taskEndTime = Date.now();

        const historyEntry = {
            timestamp: taskEndTime,
            taskStartTime: state.taskStartTime || taskEndTime,
            numbers: state.currentNumbers,
            userAnswer: answer,
            correctAnswer: state.correctAnswer,
            correct: isCorrect,
            operation: state.currentOperation
        };

        set(state => ({
            history: [...state.history, historyEntry],
            showResultPopup: true
        }));

        return isCorrect;
    },

    setSettings: (newSettings: Partial<Settings>) => {
        set(state => ({
            settings: {
                ...state.settings,
                ...newSettings
            }
        }));
    }
}));
