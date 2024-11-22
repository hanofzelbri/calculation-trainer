import { Operation } from "./common";

export interface OperationStats {
    totalProblems: number;
    correctFirstTry: number;
    totalErrors: number;
    totalTimeSpent: number;
    averageTime: number;
    bestTime: number;
    currentStreak: number;
    bestStreak: number;
}

export interface DailyStats {
    date: string;
    problemsSolved: number;
    timeSpent: number;
    accuracy: number;
    totalAttempts: number;
    correctAttempts: number;
    correctFirstTry: number;
    averageTime: number;
    operationCounts: Record<Operation, number>;
}

export interface Statistics {
    totalProblemsAllTime: number;
    totalTimeSpentAllTime: number;
    operationStats: Record<Operation, OperationStats>;
    dailyStats: DailyStats[];
    averageAccuracy: number;
    lastUpdated: string;
    currentStreak: number;
    bestStreak: number;
    lastCorrectAnswer: string | null;
}

export interface StatisticsState {
    statistics: Statistics;
}

export interface StatisticsActions {
    updateStatistics: (entry: {
        operation: Operation;
        isCorrect: boolean;
        time: number;
        isFirstTry: boolean;
    }) => void;
}

export interface StatisticsStore extends StatisticsState, StatisticsActions {
    getDailyStats: (days: number) => DailyStats[];
}
