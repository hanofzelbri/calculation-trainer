import { create } from 'zustand';
import { Operation, GameState, Settings } from '../types';



const generateTaskUpdated = (operation: Operation, settings: Settings): { numbers: number[], correctAnswer: number } => {
    let numbers: number[] = [];
    let correctAnswer = 0;

    const operationSettings = operation === Operation.Addition ? settings.addition : settings.subtraction;
    const maxNumber = operationSettings.maxNumber;
    const numberCount = operationSettings.numberCount;

    switch (operation) {
        case Operation.Addition:
            numbers = Array(numberCount).fill(0).map(() => Math.floor(Math.random() * (maxNumber + 1)));
            correctAnswer = numbers.reduce((sum, num) => sum + num, 0);
            break;
        case Operation.Subtraction:
            // For subtraction, ensure first number is largest to avoid negative results
            const firstNumber = Math.floor(Math.random() * (maxNumber + 1));
            const remainingNumbers = Array(numberCount - 1)
                .fill(0)
                .map(() => Math.floor(Math.random() * (firstNumber + 1)));
            numbers = [firstNumber, ...remainingNumbers];
            correctAnswer = numbers.reduce((result, num, index) => 
                index === 0 ? num : result - num, 0);
            break;
        default:
            throw new Error(`Operation ${operation} not supported`);
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
        const { numbers, correctAnswer } = generateTaskUpdated(newOperation, state.settings);
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
