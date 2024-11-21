import { create } from 'zustand';
import { GameState, GameMode, Settings, HistoryEntry, Achievement } from '../types';
import { defaultAchievements } from '../data/achievementData';
import { createQuestSlice, QuestStore } from './questStore';

interface GameStore extends GameState, QuestStore {
    level: number;
    experience: number;
    experienceToNextLevel: number;
    achievements: Achievement[];
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
    addExperience: (exp: number) => void;
    checkAchievements: () => void;
    checkQuestProgress: () => void;
}

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
    history: JSON.parse(localStorage.getItem('gameHistory') || '[]'),
    currentOperation: '+',
    level: parseInt(localStorage.getItem('level') || '1'),
    experience: parseInt(localStorage.getItem('experience') || '0'),
    experienceToNextLevel: 100,
    achievements: JSON.parse(localStorage.getItem('achievements') || 'null') || defaultAchievements,

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
        const state = get();
        const correct = answer === state.correctAnswer;
        const endTime = Date.now();
        
        if (correct) {
            // Füge den Versuch zur History hinzu
            state.addToHistory({
                timestamp: endTime,
                taskStartTime: state.taskStartTime || endTime,
                numbers: state.currentNumbers,
                userAnswer: answer,
                correctAnswer: state.correctAnswer,
                correct,
                operation: state.currentOperation
            });
            state.updateScore(1);
            state.checkAchievements();
            state.checkQuestProgress();
        } else {
            state.decreaseHeart();
        }

        return correct;
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
    
    addToHistory: (entry: HistoryEntry) => {
        const state = get();
        const newHistory = [...state.history, entry];
        set({ history: newHistory });
        localStorage.setItem('gameHistory', JSON.stringify(newHistory));
    },
    
    addExperience: (exp: number) => {
        const state = get();
        let newExperience = state.experience + exp;
        let newLevel = state.level;
        
        while (newExperience >= state.experienceToNextLevel) {
            newExperience -= state.experienceToNextLevel;
            newLevel++;
        }

        set({ 
            experience: newExperience,
            level: newLevel
        });
        
        localStorage.setItem('experience', newExperience.toString());
        localStorage.setItem('level', newLevel.toString());
    },
    
    checkAchievements: () => {
        const state = get();
        const achievements = [...state.achievements];
        let achievementsUpdated = false;

        // Helper function to update achievement
        const updateAchievement = (id: string, progress: number) => {
            const achievement = achievements.find(a => a.id === id);
            if (achievement) {
                achievement.progress = progress;
                
                // Find the next level that hasn't been reached yet
                const nextLevel = achievement.levels.find(level => 
                    level.level === achievement.currentLevel + 1 && 
                    progress >= level.requirement
                );
                
                if (nextLevel && achievement.currentLevel < achievement.maxLevel) {
                    achievement.currentLevel = nextLevel.level;
                    achievementsUpdated = true;
                }
            }
        };

        // Check each achievement
        const currentTime = new Date();

        // Streak master is updated in checkAnswer function
        
        // Speed demon is updated in checkAnswer function
        
        // Daily solver
        const dailyTaskCount = state.history.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate.toDateString() === currentTime.toDateString();
        }).length;
        updateAchievement('daily_solver', dailyTaskCount);

        // Big numbers
        const bigNumberTasks = state.history.filter(entry =>
            entry.numbers.some(num => num > 1000)
        ).length;
        updateAchievement('big_numbers', bigNumberTasks);

        // Perfect test is updated when a test is completed

        if (achievementsUpdated) {
            set({ achievements });
            // Save to localStorage
            localStorage.setItem('achievements', JSON.stringify(achievements));
        }
    },
    ...createQuestSlice(set, get)
}));
