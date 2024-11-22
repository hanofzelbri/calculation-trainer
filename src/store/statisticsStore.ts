import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Statistics, OperationStats } from '../types/statistics';
import { Operation } from '@/types';

const createInitialOperationStats = (): OperationStats => ({
    totalProblems: 0,
    correctFirstTry: 0,
    totalErrors: 0,
    totalTimeSpent: 0,
    averageTime: 0,
    bestTime: Infinity,
    currentStreak: 0,
    bestStreak: 0,
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
    averageAccuracy: 0,
    lastUpdated: new Date().toISOString(),
    currentStreak: 0,
    bestStreak: 0,
    lastCorrectAnswer: null,
});

interface StatisticsStore {
    statistics: Statistics;
    recordProblemAttempt: (
        operation: Operation,
        timeSpent: number,
        isCorrect: boolean,
        isFirstTry: boolean,
        isFinalAttempt: boolean
    ) => void;
    resetStatistics: () => void;
}

export const useStatisticsStore = create<StatisticsStore>()(
    persist(
        (set) => ({
            statistics: createInitialStats(),

            recordProblemAttempt: (
                operation: Operation,
                timeSpent: number,
                isCorrect: boolean,
                isFirstTry: boolean,
                isFinalAttempt: boolean
            ) => {
                if (!isFinalAttempt && !(isCorrect && isFirstTry)) return;

                set((state) => {
                    const stats = { ...state.statistics };
                    const opStats = { ...stats.operationStats[operation] };

                    // Only increment total problems when the answer is correct
                    if (isCorrect) {
                        opStats.totalProblems++;
                        stats.totalProblemsAllTime++;
                    }

                    if (isFirstTry && isCorrect) {
                        opStats.correctFirstTry++;
                    }
                    opStats.totalTimeSpent += timeSpent;
                    opStats.averageTime = opStats.totalTimeSpent / opStats.totalProblems;
                    if (timeSpent < opStats.bestTime && isCorrect) {
                        opStats.bestTime = timeSpent;
                    }
                    if (!isFirstTry) {
                        opStats.totalErrors++;
                    }

                    // Update operation-specific streak - only reset on final wrong attempt
                    if (isCorrect && isFirstTry) {
                        opStats.currentStreak++;
                        opStats.bestStreak = Math.max(opStats.currentStreak, opStats.bestStreak);
                    } else if (isFinalAttempt && !isCorrect) {
                        // Save best streak before resetting current streak
                        opStats.bestStreak = Math.max(opStats.currentStreak, opStats.bestStreak);
                        opStats.currentStreak = 0;
                    }

                    // Update global streak - only reset on final wrong attempt
                    if (isCorrect && isFirstTry) {
                        stats.currentStreak++;
                        stats.bestStreak = Math.max(stats.currentStreak, stats.bestStreak);
                    } else if (isFinalAttempt && !isCorrect) {
                        // Save best streak before resetting current streak
                        stats.bestStreak = Math.max(stats.currentStreak, stats.bestStreak);
                        stats.currentStreak = 0;
                    }

                    const today = new Date().toISOString().split('T')[0];
                    let dailyStats = [...stats.dailyStats];
                    const todayStatsIndex = dailyStats.findIndex((ds) => ds.date === today);
                    let todayStats;

                    if (todayStatsIndex === -1) {
                        todayStats = {
                            date: today,
                            totalProblems: 0,
                            totalTimeSpent: 0,
                            correctFirstTry: 0,
                            operationBreakdown: {
                                [Operation.Addition]: 0,
                                [Operation.Subtraction]: 0,
                                [Operation.Multiplication]: 0,
                                [Operation.Division]: 0,
                            },
                        };
                        dailyStats.unshift(todayStats);
                    } else {
                        todayStats = dailyStats[todayStatsIndex];
                        // Remove the old entry and add the updated one at the beginning
                        dailyStats.splice(todayStatsIndex, 1);
                        dailyStats.unshift(todayStats);
                    }

                    // Only increment total problems in daily stats when the answer is correct
                    if (isCorrect) {
                        todayStats.totalProblems++;
                        todayStats.operationBreakdown[operation]++;
                    }
                    
                    todayStats.totalTimeSpent += timeSpent;
                    if (isFirstTry && isCorrect) {
                        todayStats.correctFirstTry++;
                    }

                    stats.dailyStats = dailyStats;
                    stats.totalTimeSpentAllTime += timeSpent;
                    stats.operationStats[operation] = opStats;

                    // Calculate average accuracy across all operations
                    let totalCorrectFirstTry = 0;
                    let totalProblems = 0;
                    Object.values(stats.operationStats).forEach(opStat => {
                        totalCorrectFirstTry += opStat.correctFirstTry;
                        totalProblems += opStat.totalProblems;
                    });
                    stats.averageAccuracy = totalProblems > 0 ? (totalCorrectFirstTry / totalProblems) * 100 : 0;
                    
                    stats.lastUpdated = new Date().toISOString();

                    return { statistics: stats };
                });
            },

            resetStatistics: () => set({ statistics: createInitialStats() }),
        }),
        {
            name: 'statistics-storage',
        }
    )
);
