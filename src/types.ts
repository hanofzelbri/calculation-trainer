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
    timestamp: number;
    taskStartTime: number;
    numbers: number[];
    userAnswer: number;
    correctAnswer: number;
    correct: boolean;
    operation: Operation;
}

export interface GameState {
    currentNumbers: number[];
    correctAnswer: number;
    maxDigits: number;
    currentMode: GameMode;
    taskStartTime: number | null;
    showResultPopup: boolean;
    history: HistoryEntry[];
    currentOperation: Operation;
}
