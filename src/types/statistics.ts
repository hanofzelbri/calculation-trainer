import { Operation } from './calculations';

export interface OperationStats {
    totalProblems: number;
    correctFirstTry: number;
    totalErrors: number;
    totalTimeSpent: number; // in milliseconds
    averageTime: number; // in milliseconds
    bestTime: number; // in milliseconds
    testsCompleted: number;
    problemsInTests: number;
}

export interface DailyStats {
    date: string;
    totalProblems: number;
    totalTimeSpent: number;
    operationBreakdown: Record<Operation, number>;
}

export interface Statistics {
    totalProblemsAllTime: number;
    totalTimeSpentAllTime: number;
    operationStats: Record<Operation, OperationStats>;
    dailyStats: DailyStats[];
    currentStreak: number;
    longestStreak: number;
    totalTestsCompleted: number;
    averageAccuracy: number;
    lastUpdated: string;
}
