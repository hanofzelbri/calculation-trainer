import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Operation, OperationStats, Statistics, DailyStats, StatisticsStore } from '@/types';

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

export const useStatisticsStore = create<StatisticsStore>()(
    persist(
        (set) => ({
            statistics: createInitialStats(),

            updateStatistics: (entry: {
                operation: Operation;
                isCorrect: boolean;
                time: number;
                isFirstTry: boolean;
            }) => {
                set((state) => {
                    const stats = { ...state.statistics };
                    const opStats = { ...stats.operationStats[entry.operation] };

                    if (entry.isCorrect) {
                        opStats.totalProblems++;
                        stats.totalProblemsAllTime++;
                    }

                    if (entry.isFirstTry && entry.isCorrect) {
                        opStats.correctFirstTry++;
                    }
                    opStats.totalTimeSpent += entry.time;
                    opStats.averageTime = opStats.totalTimeSpent / opStats.totalProblems;
                    if (entry.time < opStats.bestTime && entry.isCorrect) {
                        opStats.bestTime = entry.time;
                    }
                    if (!entry.isFirstTry) {
                        opStats.totalErrors++;
                    }

                    // Update operation-specific streak
                    if (entry.isCorrect && entry.isFirstTry) {
                        opStats.currentStreak++;
                        opStats.bestStreak = Math.max(opStats.currentStreak, opStats.bestStreak);
                    } else if (!entry.isCorrect) {
                        opStats.bestStreak = Math.max(opStats.currentStreak, opStats.bestStreak);
                        opStats.currentStreak = 0;
                    }

                    // Update global streak
                    if (entry.isCorrect && entry.isFirstTry) {
                        stats.currentStreak++;
                        stats.bestStreak = Math.max(stats.currentStreak, stats.bestStreak);
                    } else if (!entry.isCorrect) {
                        stats.bestStreak = Math.max(stats.currentStreak, stats.bestStreak);
                        stats.currentStreak = 0;
                    }

                    const today = new Date().toISOString().split('T')[0];
                    let dailyStats = [...stats.dailyStats];
                    const todayStatsIndex = dailyStats.findIndex((ds) => ds.date === today);
                    let todayStats: DailyStats;

                    if (todayStatsIndex === -1) {
                        todayStats = {
                            date: today,
                            problemsSolved: 0,
                            timeSpent: 0,
                            accuracy: 0,
                            totalAttempts: 0,
                            correctAttempts: 0,
                            correctFirstTry: 0,
                            averageTime: 0,
                            operationCounts: {
                                [Operation.Addition]: 0,
                                [Operation.Subtraction]: 0,
                                [Operation.Multiplication]: 0,
                                [Operation.Division]: 0,
                            },
                        };
                        dailyStats.unshift(todayStats);
                    } else {
                        todayStats = dailyStats[todayStatsIndex];
                        dailyStats.splice(todayStatsIndex, 1);
                        dailyStats.unshift(todayStats);
                    }

                    if (entry.isCorrect) {
                        todayStats.problemsSolved++;
                        todayStats.correctAttempts++;
                        todayStats.operationCounts[entry.operation]++;
                    }
                    todayStats.totalAttempts++;
                    if (entry.isFirstTry && entry.isCorrect) {
                        todayStats.correctFirstTry++;
                    }
                    todayStats.timeSpent += entry.time;
                    todayStats.averageTime = todayStats.timeSpent / todayStats.totalAttempts;
                    todayStats.accuracy = todayStats.correctAttempts / todayStats.totalAttempts;

                    stats.dailyStats = dailyStats;
                    stats.totalTimeSpentAllTime += entry.time;
                    stats.operationStats[entry.operation] = opStats;

                    // Calculate average accuracy across all operations
                    let totalCorrectFirstTry = 0;
                    let totalProblems = 0;
                    Object.values(stats.operationStats).forEach(opStat => {
                        totalCorrectFirstTry += opStat.correctFirstTry;
                        totalProblems += opStat.totalProblems;
                    });
                    stats.averageAccuracy = totalProblems > 0 ? (totalCorrectFirstTry / totalProblems) * 100 : 0;

                    stats.lastUpdated = new Date().toISOString();
                    if (entry.isCorrect) {
                        stats.lastCorrectAnswer = new Date().toISOString();
                    }

                    return { statistics: stats };
                });
            },

            resetStatistics: () => set({ statistics: createInitialStats() }),

            getDailyStats: (days: number): DailyStats[] => {
                const stats = useStatisticsStore.getState().statistics;
                return stats.dailyStats.slice(0, days);
            },

            getOperationStats: (operation: Operation): OperationStats => {
                const stats = useStatisticsStore.getState().statistics;
                return stats.operationStats[operation];
            }
        }),
        {
            name: 'statistics-storage',
        }
    )
);
