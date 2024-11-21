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

export enum DailyQuestDifficulty {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold'
}

export interface DailyQuest {
    id: string;
    title: string;
    description: string;
    difficulty: DailyQuestDifficulty;
    requirement: number;
    progress: number;
    completed: boolean;
    claimed: boolean;
    motivationalMessage: string;
    experienceReward: number;
}

export interface DailyQuestState {
    quests: DailyQuest[];
    lastRefreshDate: string;
}
