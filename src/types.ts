export type GameMode = 'practice' | 'test';

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
    testDuration: number;
}

export interface HistoryEntry {
    timestamp: number;
    taskStartTime: number;
    numbers: number[];
    userAnswer: number;
    correctAnswer: number;
    correct: boolean;
    operation: '+' | '-';
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
    currentOperation: '+' | '-';
}

export interface AchievementLevel {
    level: number;
    name: string;
    description: string;
    requirement: number;
}

export interface Achievement {
    id: string;
    baseTitle: string;
    currentLevel: number;
    maxLevel: number;
    progress: number;
    levels: AchievementLevel[];
}

export interface DailyQuest {
    id: string;
    title: string;
    description: string;
    requirement: number;
    progress: number;
    completed: boolean;
    reward: number;
}
