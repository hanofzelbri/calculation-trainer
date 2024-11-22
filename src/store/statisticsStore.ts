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
                if (!isFinalAttempt) return;

                set((state) => {
                    const stats = { ...state.statistics };
                    const opStats = { ...stats.operationStats[operation] };

                    opStats.totalProblems++;
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

                    stats.totalProblemsAllTime++;
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
