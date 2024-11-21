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

const getRandomNumber = (max: number) => Math.floor(Math.random() * max) + 1;

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
    testStartTime: null as number | null,
    correctAnswersInTest: 0,
    showResultPopup: false,
    showSettings: false,
    history: [],
    
    // Settings
    settings: {
        maxNumber: 10000,
        numberCount: 4,
        testDuration: 5,
    },

    // Actions
    setMode: (mode) => {
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
    
    setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),
    
    startNewTask: () => {
        const { settings, currentMode, testStarted } = get();
        
        // Don't start new task in test mode unless test has started
        if (currentMode === 'test' && !testStarted) {
            return;
        }

        const numbers = Array(settings.numberCount)
            .fill(0)
            .map(() => getRandomNumber(settings.maxNumber));
            
        const answer = numbers.reduce((sum, num) => sum + num, 0);
        const maxDigits = Math.max(
            ...numbers.map(num => String(num).length),
            String(answer).length
        );
        
        set({
            currentNumbers: numbers,
            correctAnswer: answer,
            maxDigits,
            taskStartTime: (currentMode === 'practice' || (currentMode === 'test' && testStarted)) ? Date.now() : null,
        });
    },
    
    checkAnswer: (answer) => {
        const { correctAnswer, currentNumbers, taskStartTime, currentMode, testStarted, settings } = get();
        const isCorrect = answer === correctAnswer;
        
        if (isCorrect) {
            // Add to history when answer is correct
            const timeTaken = taskStartTime ? Date.now() - taskStartTime : 0;
            const task = currentNumbers.join(' + ') + ' = ' + correctAnswer;
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
    
    updateScore: (points) => set((state) => ({ score: state.score + points })),
    
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
    
    addToHistory: (entry) => set((state) => ({
        history: [entry, ...(state.history || [])].slice(0, 10) // Keep last 10 entries
    })),
}));
