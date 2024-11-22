export interface OperationSettings {
    enabled: boolean;
    maxNumber: number;
    numberCount: number;
    allowNegative?: boolean;
}

export interface MultiplicationSettings {
    enabled: boolean;
    maxLeftNumber: number;
    maxRightNumber: number;
}

export interface DivisionSettings {
    enabled: boolean;
    maxDividend: number;
    maxDivisor: number;
    allowRemainder: boolean;
}

export interface Settings {
    addition: OperationSettings;
    subtraction: OperationSettings;
    multiplication: MultiplicationSettings;
    division: DivisionSettings;
    testDuration: number;
    maxDigits: number;
}

export interface SettingsState {
    settings: Settings;
}

export interface SettingsActions {
    updateSettings: (settings: Partial<Settings>) => void;
    resetSettings: () => void;
}
