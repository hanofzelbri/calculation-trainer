import { Operation } from "@/types";

export interface OperationStats {
    totalProblems: number;
    correctFirstTry: number;
    totalErrors: number;
    totalTimeSpent: number; // in milliseconds
    averageTime: number; // in milliseconds
    bestTime: number; // in milliseconds
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
    averageAccuracy: number;
    lastUpdated: string;
}
