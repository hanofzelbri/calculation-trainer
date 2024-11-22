import { Operation } from './common';

export interface HistoryEntry {
    task: string;
    operation: Operation;
    numbers: number[];
    answer: number;
    userAnswer?: string;
    isCorrect: boolean;
    isFirstAttempt?: boolean;
    timeSpent: number;
    duration?: number;
    timestamp: Date;
}

export interface HistoryFilter {
    operations: Operation[];
    timeRange: {
        start: Date | null;
        end: Date | null;
    };
    showFirstAttempts: boolean;
    showMultipleAttempts: boolean;
}

export interface HistoryStore {
    entries: HistoryEntry[];
    filter: HistoryFilter;
    addEntry: (entry: HistoryEntry) => void;
    setFilter: (filter: HistoryFilter) => void;
    clearHistory: () => void;
}
