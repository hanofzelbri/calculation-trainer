export type GameMode = 'practice' | 'test';
export type Operation = '+' | '-';

export interface HistoryEntry {
    task: string;
    isCorrect: boolean;
    time: number;
}

export interface GameState {
    currentNumbers: number[];
    correctAnswer: number;
    maxDigits: number;
    currentMode: GameMode;
    currentOperation: Operation;
    hearts: number;
    score: number;
    taskStartTime: number | null;
    testStarted: boolean;
    testStartTime: number | null;
    correctAnswersInTest: number;
    showResultPopup: boolean;
    history: HistoryEntry[];
}

export interface OperationSettings {
    enabled: boolean;
    maxNumber: number;
    numberCount: number;
}

export interface Settings {
    addition: OperationSettings;
    subtraction: OperationSettings;
    testDuration: number;
}
