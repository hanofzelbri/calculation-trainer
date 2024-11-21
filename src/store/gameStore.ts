import { create } from 'zustand';
import { GameState, GameMode, Settings, HistoryEntry } from '../types';

interface GameStore extends GameState {
    settings: Settings;
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
    history: [],
    
    // Settings
    settings: {
        maxNumber: 10000,
        numberCount: 4,
        testDuration: 5,
    },

    // Actions
    setMode: (mode) => set({ currentMode: mode, testStarted: false }),
    
    setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),
    
    startNewTask: () => {
        const { settings } = get();
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
            taskStartTime: Date.now(),
        });
    },
    
    checkAnswer: (answer) => {
        const { correctAnswer } = get();
        const isCorrect = answer === correctAnswer;
        
        if (!isCorrect && get().currentMode === 'test') {
            get().decreaseHeart();
        }
        
        return isCorrect;
    },
    
    updateScore: (points) => set((state) => ({ score: state.score + points })),
    
    resetHearts: () => set({ hearts: 3 }),
    
    decreaseHeart: () => set((state) => ({ 
        hearts: state.hearts - 1,
        testStarted: state.hearts > 1 // End test if no hearts left
    })),
    
    startTest: () => {
        set({
            testStarted: true,
            hearts: 3,
            score: 0,
        });
    },
    
    endTest: () => set({ testStarted: false }),

    addToHistory: (entry) => set((state) => ({
        history: [entry, ...(state.history || [])].slice(0, 10) // Keep last 10 entries
    })),
}));
