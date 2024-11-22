import { create } from 'zustand';
import { Operation, GameState, Settings } from '../types';
import { getRandomNumber } from '@/utils/math';

const generateTask = (operation: Operation, maxDigits: number): { numbers: number[], correctAnswer: number } => {
    const numbers = Array(2).fill(0).map(() => getRandomNumber(maxDigits));
    let correctAnswer = 0;

    switch (operation) {
        case Operation.Addition:
            correctAnswer = numbers[0] + numbers[1];
            break;
        case Operation.Subtraction:
            correctAnswer = numbers[0] - numbers[1];
            break;
        case Operation.Multiplication:
            correctAnswer = numbers[0] * numbers[1];
            break;
        case Operation.Division:
            correctAnswer = numbers[0] / numbers[1];
            break;
    }

    return { numbers, correctAnswer };
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
        const { numbers, correctAnswer } = generateTask(get().currentOperation, get().maxDigits);
        set({
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
