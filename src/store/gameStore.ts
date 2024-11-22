import { create } from 'zustand';
import { GameState, GameMode, Settings, HistoryEntry, Achievement } from '../types';
import { defaultAchievements } from '../data/achievementData';
import { createQuestSlice, QuestStore } from './questStore';
import { useStatisticsStore } from './statisticsStore';

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
    settings: JSON.parse(localStorage.getItem('gameSettings') || 'null') || {
        addition: {
            enabled: true,
            maxNumber: 10,
            numberCount: 2
        },
        subtraction: {
            enabled: false,
            maxNumber: 100,
            numberCount: 2
        },
        testDuration: 5
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
        set((state) => {
            const updatedSettings = { ...state.settings, ...newSettings };
            localStorage.setItem('gameSettings', JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
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

        // Check achievements and quests when starting new task
        get().checkAchievements();
        get().checkQuestProgress();
    },
    
    checkAnswer: (answer: number) => {
        const state = get();
        const correct = answer === state.correctAnswer;
        const endTime = Date.now();
        const timeSpent = endTime - (state.taskStartTime || endTime);

        // Check if this is the first try for the current problem
        const isFirstTryForCurrentProblem = state.history.length === 0 || 
            !state.history.some(entry => 
                entry.correctAnswer === state.correctAnswer && !entry.correct
            );

        // Update statistics only when the answer is correct
        if (correct) {
            useStatisticsStore.getState().recordProblemAttempt(
                state.currentOperation,
                timeSpent,
                correct,
                isFirstTryForCurrentProblem, // isFirstTry - true only if no failed attempts exist for this problem
                true // isFinalAttempt, true because it's correct
            );

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
            state.addToHistory({
                timestamp: endTime,
                taskStartTime: state.taskStartTime || endTime,
                numbers: state.currentNumbers,
                userAnswer: answer,
                correctAnswer: state.correctAnswer,
                correct,
                operation: state.currentOperation
            });
            state.decreaseHeart();
            // Also check achievements and quests on wrong answers
            state.checkAchievements();
            state.checkQuestProgress();
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
            ...(state.currentMode === 'test' && { testStarted: newHearts > 0 })
        };
    }),
    
    startTest: () => {
        set((state) => ({
            testStarted: true,
            testStartTime: Date.now(),
            correctAnswersInTest: 0,
            showSettings: false
        }));
        get().startNewTask();
    },

    endTest: () => {
        const state = get();
        // Record test completion in statistics
        useStatisticsStore.getState().recordTestCompletion(
            state.currentOperation,
            state.settings.testDuration * 2 // Assuming 2 problems per minute
        );
        set({ testStarted: false, showResultPopup: true });
    },
    
    addToHistory: (entry: HistoryEntry) => {
        set((state) => ({
            history: [...state.history, entry]
        }));
        // Check achievements and quests after adding to history
        get().checkAchievements();
        get().checkQuestProgress();
        localStorage.setItem('gameHistory', JSON.stringify(get().history));
    },
    
    addExperience: (exp: number) => {
        set((state) => {
            const newExperience = state.experience + exp;
            const experienceToNextLevel = state.level * 100;
            
            if (newExperience >= experienceToNextLevel) {
                return {
                    experience: newExperience - experienceToNextLevel,
                    level: state.level + 1,
                    experienceToNextLevel: (state.level + 1) * 100
                };
            }
            
            return {
                experience: newExperience,
                experienceToNextLevel
            };
        });
        
        // Check achievements and quests after experience gain
        get().checkAchievements();
        get().checkQuestProgress();
        
        // Save to localStorage
        localStorage.setItem('level', get().level.toString());
        localStorage.setItem('experience', get().experience.toString());
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

        // Streak master - track consecutive correct answers
        let currentStreak = 0;
        for (let i = state.history.length - 1; i >= 0; i--) {
            if (state.history[i].correct) {
                currentStreak++;
            } else {
                break;
            }
        }
        updateAchievement('streak_master', currentStreak);

        // Daily warrior - track consecutive days of practice
        const uniqueDays = new Set();
        let lastDate: Date | null = null;
        let consecutiveDays = 0;

        // Sort history by date, newest first
        const sortedHistory = [...state.history].sort((a, b) => b.timestamp - a.timestamp);
        
        for (const entry of sortedHistory) {
            const entryDate = new Date(entry.timestamp);
            const dateString = entryDate.toDateString();
            
            if (!uniqueDays.has(dateString)) {
                uniqueDays.add(dateString);
                
                if (lastDate === null) {
                    lastDate = entryDate;
                    consecutiveDays = 1;
                } else {
                    const dayDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (dayDiff === 1) {
                        consecutiveDays++;
                        lastDate = entryDate;
                    } else {
                        break;
                    }
                }
            }
        }
        updateAchievement('daily_warrior', consecutiveDays);

        // Time bender - track fast solutions (under 15 seconds)
        const fastSolutions = state.history.filter(entry => 
            entry.correct && entry.taskStartTime && 
            (entry.timestamp - entry.taskStartTime) < 15000
        ).length;
        updateAchievement('time_bender', fastSolutions);

        // Daily solver - track tasks completed today
        const dailyTaskCount = state.history.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entry.correct && entryDate.toDateString() === currentTime.toDateString();
        }).length;
        updateAchievement('daily_solver', dailyTaskCount);

        // Total tasks completed (all time)
        const totalTasks = state.history.filter(entry => entry.correct).length;
        updateAchievement('total_tasks', totalTasks);

        // Big numbers - track tasks with numbers over 1000
        const bigNumberTasks = state.history.filter(entry =>
            entry.correct && entry.numbers.some(num => Math.abs(num) > 1000)
        ).length;
        updateAchievement('big_numbers', bigNumberTasks);

        if (achievementsUpdated) {
            set({ achievements });
            // Save to localStorage
            localStorage.setItem('achievements', JSON.stringify(achievements));
        }
    },
    ...createQuestSlice(set, get)
}));
