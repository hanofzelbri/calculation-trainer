import { create } from 'zustand';
import { GameState, GameMode, Settings, HistoryEntry } from '../types';

interface GameStore extends GameState {
    settings: Settings;
    showSettings: boolean;
    setMode: (mode: GameMode) => void;
    setSettings: (settings: Partial<Settings>) => void;
    startNewTask: () => void;
    checkAnswer: (answer: number) => boolean;
    updateScore: (points: number) => void;
    resetHearts: () => void;
    decreaseHeart: () => void;
    startTest: () => void;
    endTest: () => void;
    addToHistory: (entry: HistoryEntry) => void;
}

const getRandomNumber = (max: number) => {
    return Math.floor(Math.random() * max) + 1;
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial state
    currentNumbers: [],
    correctAnswer: 0,
    maxDigits: 0,
    currentMode: 'practice',
    hearts: 3,
    score: 0,
    taskStartTime: null,
    testStarted: false,
    testStartTime: null,
    correctAnswersInTest: 0,
    showResultPopup: false,
    showSettings: false,
    history: [],
    currentOperation: '+',
    
    // Settings
    settings: {
        addition: {
            enabled: true,
            maxNumber: 10000,
            numberCount: 2
        },
        subtraction: {
            enabled: false,
            maxNumber: 10000,
            numberCount: 2
        },
        testDuration: 5,
    },

    // Actions
    setMode: (mode: GameMode) => {
        set({ 
            currentMode: mode, 
            testStarted: false,
            testStartTime: null,
            correctAnswersInTest: 0,
            showResultPopup: false,
            showSettings: mode === 'test',
            hearts: 3,
            score: 0,
            currentNumbers: [],
            taskStartTime: null
        });
        
        if (mode === 'practice') {
            get().startNewTask();
        }
    },
    
    setSettings: (newSettings: Partial<Settings>) => {
        const currentSettings = get().settings;
        const validatedSettings = { ...currentSettings, ...newSettings };
        
        // Ensure minimum of 2 numbers
        if (validatedSettings.addition.numberCount < 2) {
            validatedSettings.addition.numberCount = 2;
        }
        if (validatedSettings.subtraction.numberCount < 2) {
            validatedSettings.subtraction.numberCount = 2;
        }

        // Ensure at least one operation is enabled
        if (!validatedSettings.addition.enabled && !validatedSettings.subtraction.enabled) {
            validatedSettings.addition.enabled = true;
        }
        
        set({ settings: validatedSettings });
    },
    
    startNewTask: () => {
        const { settings, currentMode, testStarted } = get();
        
        // Don't start new task in test mode unless test has started
        if (currentMode === 'test' && !testStarted) {
            return;
        }

        // Select random operation from enabled operations
        const operations: ('+' | '-')[] = [];
        if (settings.addition.enabled) operations.push('+');
        if (settings.subtraction.enabled) operations.push('-');
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        // Get the operation settings
        const operationSettings = operation === '+' ? settings.addition : settings.subtraction;
        
        let numbers;
        if (operation === '-') {
            // Generate first number
            const firstNumber = Math.floor(Math.random() * operationSettings.maxNumber) + 1;
            // Generate remaining numbers that are smaller than the first number
            const remainingNumbers = Array(operationSettings.numberCount - 1)
                .fill(0)
                .map(() => Math.floor(Math.random() * firstNumber));
            numbers = [firstNumber, ...remainingNumbers];
        } else {
            numbers = Array(operationSettings.numberCount)
                .fill(0)
                .map(() => Math.floor(Math.random() * operationSettings.maxNumber) + 1);
        }
        
        const answer = operation === '+' 
            ? numbers.reduce((sum, num) => sum + num, 0)
            : numbers.reduce((diff, num, idx) => idx === 0 ? num : diff - num, 0);
            
        const maxDigits = Math.max(
            ...numbers.map(num => String(num).length),
            String(Math.abs(answer)).length
        );
        
        set({
            currentNumbers: numbers,
            correctAnswer: answer,
            maxDigits,
            currentOperation: operation,
            taskStartTime: (currentMode === 'practice' || (currentMode === 'test' && testStarted)) ? Date.now() : null,
        });
    },
    
    checkAnswer: (answer: number) => {
        const { correctAnswer, currentNumbers, taskStartTime, currentMode, testStarted, settings, currentOperation } = get();
        const isCorrect = answer === correctAnswer;
        
        if (isCorrect) {
            // Add to history when answer is correct
            const timeTaken = taskStartTime ? Date.now() - taskStartTime : 0;
            const task = currentNumbers.join(` ${currentOperation} `) + ' = ' + correctAnswer;
            get().addToHistory({
                task,
                isCorrect: true,
                time: timeTaken
            });

            if (currentMode === 'test' && testStarted) {
                set(state => ({ correctAnswersInTest: state.correctAnswersInTest + 1 }));
                get().updateScore(10);
            }
        } else if (currentMode === 'test' && testStarted) {
            get().decreaseHeart();
        }

        // Check if test should end due to time
        if (currentMode === 'test' && testStarted) {
            const testStartTime = get().testStartTime;
            if (testStartTime && Date.now() - testStartTime >= settings.testDuration * 60 * 1000) {
                get().endTest();
            }
        }
        
        // Start new task if answer was correct or if in test mode
        if (isCorrect || (currentMode === 'test' && testStarted)) {
            get().startNewTask();
        }
        
        return isCorrect;
    },
    
    updateScore: (points: number) => set((state) => ({ score: state.score + points })),
    
    resetHearts: () => set({ hearts: 3 }),
    
    decreaseHeart: () => set((state) => {
        const newHearts = state.hearts - 1;
        if (newHearts <= 0 && state.currentMode === 'test') {
            get().endTest();
        }
        return { 
            hearts: newHearts,
            testStarted: newHearts > 0
        };
    }),
    
    startTest: () => {
        const testStartTime = Date.now();
        set({ 
            testStarted: true, 
            testStartTime,
            showSettings: false,
            correctAnswersInTest: 0
        });
        get().startNewTask();
        
        // End test after specified duration
        setTimeout(() => {
            get().endTest();
        }, get().settings.testDuration * 60 * 1000);
    },
    
    endTest: () => set(() => ({ 
        testStarted: false,
        showResultPopup: true,
        testStartTime: null
    })),
    
    addToHistory: (entry: HistoryEntry) => set((state) => ({
        history: [entry, ...(state.history || [])].slice(0, 10) // Keep last 10 entries
    })),
}));
