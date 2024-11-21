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

        // Get today's entries only
        const today = new Date();
        const todaysEntries = state.history.filter((entry: { timestamp: number }) => {
            const entryDate = new Date(entry.timestamp);
            return entryDate.toDateString() === today.toDateString();
        });

        quests.forEach(quest => {
            if (!quest.completed) {
                let progress = 0;

                switch (quest.title) {
                    case "Schnelle Runde":
                        // Löse 5 Aufgaben in unter 30 Sekunden
                        progress = todaysEntries.filter((entry: { timestamp: number; taskStartTime: number; correct: boolean }) =>
                            entry.correct && (entry.timestamp - entry.taskStartTime < 30000)
                        ).length;
                        break;

                    case "Erste Schritte":
                        // Löse 10 Additions-Aufgaben
                        progress = todaysEntries.filter((entry: { operation: string; correct: boolean }) =>
                            entry.correct && entry.operation === '+'
                        ).length;
                        break;

                    case "Mathe-Anfänger":
                        // Erreiche eine Streak von 3 richtigen Antworten
                        let currentStreak = 0;
                        let maxStreak = 0;
                        todaysEntries.forEach((entry: { correct: boolean }) => {
                            if (entry.correct) {
                                currentStreak++;
                                maxStreak = Math.max(maxStreak, currentStreak);
                            } else {
                                currentStreak = 0;
                            }
                        });
                        progress = maxStreak;
                        break;

                    case "Konstanter Rechner":
                        // Erreiche eine Streak von 10 richtigen Antworten
                        let longStreak = 0;
                        let maxLongStreak = 0;
                        todaysEntries.forEach((entry: { correct: boolean }) => {
                            if (entry.correct) {
                                longStreak++;
                                maxLongStreak = Math.max(maxLongStreak, longStreak);
                            } else {
                                longStreak = 0;
                            }
                        });
                        progress = maxLongStreak;
                        break;

                    case "Gemischte Übung":
                        // Löse jeweils 5 Additions- und Subtraktionsaufgaben
                        const additionCount = todaysEntries.filter((entry: { operation: string; correct: boolean }) =>
                            entry.correct && entry.operation === '+'
                        ).length;
                        const subtractionCount = todaysEntries.filter((entry: { operation: string; correct: boolean }) =>
                            entry.correct && entry.operation === '-'
                        ).length;
                        progress = Math.min(additionCount, subtractionCount);
                        break;

                    case "Ausdauer-Training":
                        // Spiele 10 Minuten am Stück (600 Sekunden)
                        if (todaysEntries.length >= 2) {
                            let maxDuration = 0;
                            let currentDuration = 0;
                            let lastTimestamp = 0;

                            todaysEntries.forEach((entry: { timestamp: number }) => {
                                if (lastTimestamp === 0) {
                                    lastTimestamp = entry.timestamp;
                                } else {
                                    const gap = entry.timestamp - lastTimestamp;
                                    if (gap < 60000) { // Less than 1 minute gap
                                        currentDuration += gap;
                                        maxDuration = Math.max(maxDuration, currentDuration);
                                    } else {
                                        currentDuration = 0;
                                    }
                                    lastTimestamp = entry.timestamp;
                                }
                            });
                            progress = Math.floor(maxDuration / 1000); // Convert to seconds
                        }
                        break;

                    case "Mathe-Meister":
                        // Löse 20 Aufgaben ohne Fehler
                        let perfectStreak = 0;
                        let maxPerfectStreak = 0;
                        todaysEntries.forEach((entry: { correct: boolean }) => {
                            if (entry.correct) {
                                perfectStreak++;
                                maxPerfectStreak = Math.max(maxPerfectStreak, perfectStreak);
                            } else {
                                perfectStreak = 0;
                            }
                        });
                        progress = maxPerfectStreak;
                        break;

                    case "Blitz-Champion":
                        // Löse 10 Aufgaben in jeweils unter 15 Sekunden
                        progress = todaysEntries.filter((entry: { timestamp: number; taskStartTime: number; correct: boolean }) =>
                            entry.correct && (entry.timestamp - entry.taskStartTime < 15000)
                        ).length;
                        break;

                    case "Große Zahlen":
                        // Löse 15 Aufgaben mit Zahlen über 1000
                        progress = todaysEntries.filter((entry: { numbers: number[]; correct: boolean }) =>
                            entry.correct && entry.numbers.some(num => Math.abs(num) > 1000)
                        ).length;
                        break;

                    case "Tägliche Übung":
                        // Löse 10 Aufgaben
                        progress = todaysEntries.filter((entry: { correct: boolean }) => entry.correct).length;
                        break;

                    case "Multiplikationsmeister":
                        // Löse 10 Multiplikationsaufgaben
                        progress = todaysEntries.filter((entry: { operation: string; correct: boolean }) =>
                            entry.correct && entry.operation === '*'
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
