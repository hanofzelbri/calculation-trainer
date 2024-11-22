export enum Operation {
    Addition = '+',
    Subtraction = '-',
    Multiplication = '×',
    Division = '÷'
}

export enum GameState {
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    FINISHED = 'FINISHED'
}

export interface TimeRange {
    start: Date | null;
    end: Date | null;
}
