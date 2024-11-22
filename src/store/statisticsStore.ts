import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Statistics, OperationStats } from '../types/statistics';
import { Operation } from '../types/calculations';

const createInitialOperationStats = (): OperationStats => ({
    totalProblems: 0,
    correctFirstTry: 0,
    totalErrors: 0,
    totalTimeSpent: 0,
    averageTime: 0,
    bestTime: Infinity,
    testsCompleted: 0,
    problemsInTests: 0,
});

const createInitialStats = (): Statistics => ({
    totalProblemsAllTime: 0,
    totalTimeSpentAllTime: 0,
    operationStats: {
        [Operation.Addition]: createInitialOperationStats(),
        [Operation.Subtraction]: createInitialOperationStats(),
        [Operation.Multiplication]: createInitialOperationStats(),
        [Operation.Division]: createInitialOperationStats(),
    },
    dailyStats: [],
    currentStreak: 0,
    longestStreak: 0,
    totalTestsCompleted: 0,
    averageAccuracy: 0,
    lastUpdated: new Date().toISOString(),
});

interface StatisticsStore {
    statistics: Statistics;
    recordProblemAttempt: (
        operation: Operation,
        timeSpent: number,
        isCorrect: boolean,
        isFirstTry: boolean
    ) => void;
    recordTestCompletion: (
        operation: Operation,
        problemCount: number
    ) => void;
    updateStreak: () => void;
    resetStatistics: () => void;
}

export const useStatisticsStore = create<StatisticsStore>()(
    persist(
        (set, get) => ({
            statistics: createInitialStats(),

            recordProblemAttempt: (
                operation: Operation,
                timeSpent: number,
                isCorrect: boolean,
                isFirstTry: boolean
            ) => {
                set((state) => {
                    const stats = { ...state.statistics };
                    const opStats = { ...stats.operationStats[operation] };

                    // Update operation-specific stats
                    opStats.totalProblems++;
                    opStats.totalTimeSpent += timeSpent;
                    opStats.averageTime = opStats.totalTimeSpent / opStats.totalProblems;
                    if (timeSpent < opStats.bestTime && isCorrect) {
                        opStats.bestTime = timeSpent;
                    }
                    if (isFirstTry && isCorrect) {
                        opStats.correctFirstTry++;
                    }
                    if (!isCorrect) {
                        opStats.totalErrors++;
                    }

                    // Update daily stats
                    const today = new Date().toISOString().split('T')[0];
                    let dailyStats = [...stats.dailyStats];
                    let todayStats = dailyStats.find((ds) => ds.date === today);

                    if (!todayStats) {
                        todayStats = {
                            date: today,
                            totalProblems: 0,
                            totalTimeSpent: 0,
                            operationBreakdown: {
                                [Operation.Addition]: 0,
                                [Operation.Subtraction]: 0,
                                [Operation.Multiplication]: 0,
                                [Operation.Division]: 0,
                            },
                        };
                        dailyStats.push(todayStats);
                    }

                    todayStats.totalProblems++;
                    todayStats.totalTimeSpent += timeSpent;
                    todayStats.operationBreakdown[operation]++;

                    // Update global stats
                    stats.totalProblemsAllTime++;
                    stats.totalTimeSpentAllTime += timeSpent;
                    const operationsWithProblems = Object.values(stats.operationStats)
                        .filter(curr => curr.totalProblems > 0);
                    
                    stats.averageAccuracy = operationsWithProblems.length > 0
                        ? (operationsWithProblems.reduce((acc, curr) => 
                            acc + (curr.correctFirstTry / curr.totalProblems), 0) / 
                            operationsWithProblems.length) * 100
                        : 100;
                    
                    stats.lastUpdated = new Date().toISOString();

                    return {
                        statistics: {
                            ...stats,
                            operationStats: {
                                ...stats.operationStats,
                                [operation]: opStats,
                            },
                            dailyStats,
                        },
                    };
                });
            },

            recordTestCompletion: (operation: Operation, problemCount: number) => {
                set((state) => {
                    const stats = { ...state.statistics };
                    const opStats = { ...stats.operationStats[operation] };

                    opStats.testsCompleted++;
                    opStats.problemsInTests += problemCount;
                    stats.totalTestsCompleted++;

                    return {
                        statistics: {
                            ...stats,
                            operationStats: {
                                ...stats.operationStats,
                                [operation]: opStats,
                            },
                        },
                    };
                });
            },

            updateStreak: () => {
                set((state) => {
                    const stats = { ...state.statistics };
                    const today = new Date().toISOString().split('T')[0];
                    const yesterday = new Date(Date.now() - 86400000)
                        .toISOString()
                        .split('T')[0];

                    const hasActivityToday = stats.dailyStats.some(
                        (ds) => ds.date === today && ds.totalProblems > 0
                    );
                    const hadActivityYesterday = stats.dailyStats.some(
                        (ds) => ds.date === yesterday && ds.totalProblems > 0
                    );

                    if (hasActivityToday) {
                        if (hadActivityYesterday || stats.currentStreak === 0) {
                            stats.currentStreak++;
                            stats.longestStreak = Math.max(
                                stats.currentStreak,
                                stats.longestStreak
                            );
                        }
                    } else if (!hadActivityYesterday) {
                        stats.currentStreak = 0;
                    }

                    return { statistics: stats };
                });
            },

            resetStatistics: () => {
                set({ statistics: createInitialStats() });
            },
        }),
        {
            name: 'statistics-storage',
        }
    )
);
