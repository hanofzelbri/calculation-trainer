export type GameMode = 'practice' | 'test';

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
    hearts: number;
    score: number;
    taskStartTime: number | null;
    testStarted: boolean;
    testStartTime: number | null;
    correctAnswersInTest: number;
    showResultPopup: boolean;
    history: HistoryEntry[];
}

export interface Settings {
    maxNumber: number;
    numberCount: number;
    testDuration: number;
}
