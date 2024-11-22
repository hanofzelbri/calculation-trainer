import { Operation } from "@/types";

export interface OperationStats {
    totalProblems: number;
    correctFirstTry: number;
    totalErrors: number;
    totalTimeSpent: number; // in milliseconds
    averageTime: number; // in milliseconds
    bestTime: number; // in milliseconds
    currentStreak: number;
    bestStreak: number;
}

export interface DailyStats {
    date: string;
    totalProblems: number;
    totalTimeSpent: number;
    correctFirstTry: number;
    operationBreakdown: Record<Operation, number>;
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
