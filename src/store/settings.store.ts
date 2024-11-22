import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, SettingsState, SettingsActions } from '@/types/settings.types';

interface SettingsStore extends SettingsState, SettingsActions {}

const initialSettings: Settings = {
    addition: {
        enabled: true,
        maxNumber: 100,
        numberCount: 2,
        allowNegative: false
    },
    subtraction: {
        enabled: true,
        maxNumber: 100,
        numberCount: 2,
        allowNegative: false
    },
    multiplication: {
        enabled: true,
        maxLeftNumber: 12,
        maxRightNumber: 12
    },
    division: {
        enabled: true,
        maxDividend: 100,
        maxDivisor: 12,
        allowRemainder: false
    },
    testDuration: 300, // 5 minutes in seconds
    maxDigits: 3
};

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            settings: initialSettings,

            updateSettings: (newSettings: Partial<Settings>) => {
                set((prev) => ({
                    settings: { ...prev.settings, ...newSettings }
                }));
            },

            resetSettings: () => set({ settings: initialSettings })
        }),
        {
            name: 'settings-storage'
        }
    )
);
