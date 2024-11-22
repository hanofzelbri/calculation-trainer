import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryEntry, HistoryStore, HistoryFilter } from '@/types';
import { Operation } from '@/types/common';

const initialState = {
    entries: [] as HistoryEntry[],
    filter: {
        operations: Object.values(Operation),
        timeRange: {
            start: null,
            end: null
        },
        showFirstAttempts: true,
        showMultipleAttempts: true
    } as HistoryFilter
};

export const useHistoryStore = create<HistoryStore>()(
    persist(
        (set) => ({
            ...initialState,

            addEntry: (entry: HistoryEntry) => {
                set((state) => ({
                    entries: [entry, ...state.entries].slice(0, 100) // Keep only last 100 entries
                }));
            },

            setFilter: (filter: HistoryFilter) => {
                set({ filter });
            },

            clearHistory: () => {
                set({ entries: [] });
            }
        }),
        {
            name: 'history-storage'
        }
    )
);
