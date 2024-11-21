import { DailyQuestState } from '../types/achievements';
import { generateDailyQuests } from '../data/dailyQuestData';

export interface QuestStore extends DailyQuestState {
    checkQuestProgress: () => void;
    claimQuest: (questId: string) => void;
    refreshDailyQuests: () => void;
}

const loadDailyQuests = (): DailyQuestState => {
    try {
        const savedQuests = localStorage.getItem('dailyQuests');
        if (savedQuests) {
            const parsedQuests = JSON.parse(savedQuests);
            const lastRefreshDate = new Date(parsedQuests.lastRefreshDate);
            const today = new Date();

            // Vergleiche nur das Datum, nicht die Uhrzeit
            if (lastRefreshDate.toDateString() !== today.toDateString()) {
                const newState = {
                    quests: generateDailyQuests(),
                    lastRefreshDate: today.toISOString()
                };
                localStorage.setItem('dailyQuests', JSON.stringify(newState));
                return newState;
            }
            return parsedQuests;
        }

        // Wenn keine gespeicherten Quests existieren, generiere neue
        const initialState = {
            quests: generateDailyQuests(),
            lastRefreshDate: new Date().toISOString()
        };
        localStorage.setItem('dailyQuests', JSON.stringify(initialState));
        return initialState;
    } catch (error) {
        console.error('Error loading daily quests:', error);
        return {
            quests: generateDailyQuests(),
            lastRefreshDate: new Date().toISOString()
        };
    }
};

export const createQuestSlice = (set: any, get: any) => ({
    ...loadDailyQuests(),

    checkQuestProgress: () => {
        const state = get();
        const quests = [...state.quests];
        let updated = false;

        quests.forEach(quest => {
            if (!quest.completed) {
                // Überprüfe den Fortschritt basierend auf der Quest-ID oder dem Typ
                let progress = 0;

                switch (quest.title) {
                    case "Schnelle Runde":
                        progress = state.history.filter((entry: { timestamp: number; taskStartTime: number; }) =>
                            entry.timestamp - entry.taskStartTime < 30000
                        ).length;
                        break;

                    case "Erste Schritte":
                        progress = state.history.filter((entry: { operation: string; }) =>
                            entry.operation === '+'
                        ).length;
                        break;

                    case "Blitz-Champion":
                        progress = state.history.filter((entry: { timestamp: number; taskStartTime: number; }) =>
                            entry.timestamp - entry.taskStartTime < 60000
                        ).length;
                        break;

                }

                if (progress !== quest.progress) {
                    quest.progress = progress;
                    quest.completed = progress >= quest.requirement;
                    updated = true;
                }
            }
        });

        if (updated) {
            set({ quests });
            localStorage.setItem('dailyQuests', JSON.stringify({
                quests,
                lastRefreshDate: state.lastRefreshDate
            }));
        }
    },

    claimQuest: (questId: string) => {
        const state = get();
        const quests = state.quests.map((quest: { id: string; completed: any; claimed: any; experienceReward: any; }) => {
            if (quest.id === questId && quest.completed && !quest.claimed) {
                // Füge XP hinzu
                state.addExperience(quest.experienceReward);
                return { ...quest, claimed: true };
            }
            return quest;
        });

        set({ quests });
        localStorage.setItem('dailyQuests', JSON.stringify({
            quests,
            lastRefreshDate: state.lastRefreshDate
        }));
    },

    refreshDailyQuests: () => {
        // Prüfe ob es wirklich ein neuer Tag ist
        const state = get();
        const lastRefresh = new Date(state.lastRefreshDate);
        const today = new Date();
        
        if (lastRefresh.toDateString() !== today.toDateString()) {
            const newState = loadDailyQuests();
            set(newState);
            localStorage.setItem('dailyQuests', JSON.stringify(newState));
        }
    }
});
