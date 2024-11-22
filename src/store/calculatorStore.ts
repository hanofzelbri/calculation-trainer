import { create } from 'zustand';
import { Operation, GameState, Settings } from '../types';
import { useStatisticsStore } from './statisticsStore';

// Load settings from localStorage or use initial settings
const loadSettings = (): Settings => {
    const savedSettings = localStorage.getItem('calculatorSettings');
    return savedSettings ? JSON.parse(savedSettings) : initialSettings;
};

// Load history from localStorage or use empty array
const loadHistory = (): GameState['history'] => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
};

const generateTaskUpdated = (operation: Operation, settings: Settings): { numbers: number[], correctAnswer: number, maxDigits: number } => {
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

    // Calculate maxDigits based on the largest possible number
    const maxDigits = Math.max(
        ...numbers.map(n => n.toString().length),
        correctAnswer.toString().length
    );

    return { numbers, correctAnswer, maxDigits };
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
    isFirstAttempt: boolean;
    currentTask: boolean;
    historyFilter: {
        showFirstAttempts: boolean;
        showMultipleAttempts: boolean;
        operations: Operation[];
    };
    startNewTask: () => void;
    checkAnswer: (answer: number) => boolean;
    setSettings: (newSettings: Partial<Settings>) => void;
    setHistoryFilter: (filter: Partial<CalculatorStore['historyFilter']>) => void;
    getFilteredHistory: () => GameState['history'][];
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
    maxDigits: 1,
    currentOperation: Operation.Addition,
    history: loadHistory(),
    taskStartTime: null,
    showResultPopup: false,
    settings: loadSettings(),
    isFirstAttempt: true,
    currentTask: false,
    historyFilter: {
        showFirstAttempts: true,
        showMultipleAttempts: true,
        operations: [Operation.Addition, Operation.Subtraction],
    },

    startNewTask: () => {
        const state = get();
        const newOperation = getRandomOperation(state.settings);
        const { numbers, correctAnswer, maxDigits } = generateTaskUpdated(newOperation, state.settings);
        set({
            currentOperation: newOperation,
            currentNumbers: numbers,
            correctAnswer,
            maxDigits,
            taskStartTime: Date.now(),
            showResultPopup: false,
            isFirstAttempt: true,
            currentTask: true
        });
    },

    checkAnswer: (answer: number) => {
        const state = get();
        const isCorrect = answer === state.correctAnswer;
        const endTime = Date.now();
        const duration = state.taskStartTime ? endTime - state.taskStartTime : 0;

        const historyEntry = {
            operation: state.currentOperation,
            numbers: state.currentNumbers,
            userAnswer: answer,
            correctAnswer: state.correctAnswer,
            timestamp: new Date().toISOString(),
            duration,
            isCorrect,
            isFirstAttempt: state.isFirstAttempt,
        };

        const newHistory = [...state.history, historyEntry];
        localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));

        // Record statistics
        useStatisticsStore.getState().recordProblemAttempt(
            state.currentOperation,
            duration,
            isCorrect,
            state.isFirstAttempt,
            true  // Always treat it as final attempt to reset streak on wrong answers
        );

        if (isCorrect) {
            // First update UI to show success
            set({ 
                showResultPopup: true, 
                history: newHistory
            });
            
            // Use minimal delay to ensure smooth state transition
            setTimeout(() => {
                set({ 
                    currentNumbers: [], // Clear the old task
                    maxDigits: 1,
                    currentTask: false, // Only set currentTask to false when we're ready for a new task
                });
            }, 50); // Reduced to 50ms for quick transition while maintaining state consistency
        } else {
            set({ isFirstAttempt: false, history: newHistory });
        }

        return isCorrect;
    },

    setSettings: (newSettings: Partial<Settings>) => {
        const currentSettings = get().settings;
        const updatedSettings = {
            ...currentSettings,
            addition: { ...currentSettings.addition, ...newSettings.addition },
            subtraction: { ...currentSettings.subtraction, ...newSettings.subtraction },
        };
        localStorage.setItem('calculatorSettings', JSON.stringify(updatedSettings));
        set({ settings: updatedSettings });
    },

    setHistoryFilter: (filter: Partial<CalculatorStore['historyFilter']>) => {
        set((state) => ({
            historyFilter: {
                ...state.historyFilter,
                ...filter,
            },
        }));
    },

    getFilteredHistory: () => {
        const state = get();
        
        // Group entries by task (based on numbers, operation and timestamp within 1 minute)
        const groupedEntries = state.history.reduce((groups, entry) => {
            // Find a matching group within 1 minute of the entry
            const matchingGroup = groups.find(group => {
                const firstEntry = group[0];
                return firstEntry.numbers.join(',') === entry.numbers.join(',') &&
                       firstEntry.operation === entry.operation &&
                       Math.abs(new Date(firstEntry.timestamp).getTime() - new Date(entry.timestamp).getTime()) < 60000;
            });

            if (matchingGroup) {
                matchingGroup.push(entry);
            } else {
                groups.push([entry]);
            }
            return groups;
        }, [] as GameState['history'][]);

        // Filter groups based on filter settings
        const filteredGroups = groupedEntries.filter(group => {
            const isFirstAttemptSuccess = group.length === 1 && group[0].isCorrect && group[0].isFirstAttempt;
            
            // Filter by attempt type
            if (isFirstAttemptSuccess && !state.historyFilter.showFirstAttempts) return false;
            if (!isFirstAttemptSuccess && !state.historyFilter.showMultipleAttempts) return false;
            
            // Filter by operation
            if (!state.historyFilter.operations.includes(group[0].operation)) return false;
            
            return true;
        });

        // Sort groups by timestamp of first attempt (newest first)
        filteredGroups.sort((a, b) => 
            new Date(b[0].timestamp).getTime() - new Date(a[0].timestamp).getTime()
        );

        return filteredGroups;
    },
}));
