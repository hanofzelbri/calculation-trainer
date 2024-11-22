export type GameMode = 'practice';

export enum Operation {
    Addition = '+',
    Subtraction = '-',
    Multiplication = '*',
    Division = '/'
}

export interface Settings {
    addition: {
        enabled: boolean;
        maxNumber: number;
        numberCount: number;
    };
    subtraction: {
        enabled: boolean;
        maxNumber: number;
        numberCount: number;
    };
}

export interface HistoryEntry {
    operation: Operation;
    numbers: number[];
    userAnswer: number;
    correctAnswer: number;
    timestamp: string;
    duration: number;
    isCorrect: boolean;
    isFirstAttempt: boolean;
}

export interface GameState {
    currentNumbers: number[];
    correctAnswer: number;
    maxDigits: number;
    currentOperation: Operation;
    taskStartTime: number | null;
    showResultPopup: boolean;
    history: HistoryEntry[];
    settings: Settings;
    isFirstAttempt: boolean;
}
