import { DailyQuest, DailyQuestDifficulty } from '../types/achievements';

const motivationalMessages = {
    bronze: [
        "Super gemacht! Weiter so!",
        "Das war ein toller Anfang!",
        "Du bist auf dem richtigen Weg!",
        "Klasse, mach weiter so!",
        "Das hast du prima geschafft!"
    ],
    silver: [
        "Fantastische Leistung!",
        "Du bist ein echtes Mathe-Talent!",
        "Wahnsinn, das war stark!",
        "Du bist unaufhaltsam!",
        "Beeindruckende Arbeit!"
    ],
    gold: [
        "Absolut phenomenal!",
        "Du bist ein echter Mathe-Champion!",
        "Unglaubliche Leistung!",
        "Du bist ein Mathe-Genie!",
        "Legendäre Arbeit!"
    ]
};

const questTemplates: Partial<DailyQuest>[] = [
    // Bronze Quests (Einfach)
    {
        title: "Schnelle Runde",
        description: "Löse 5 Aufgaben in unter 30 Sekunden",
        difficulty: DailyQuestDifficulty.BRONZE,
        requirement: 5,
        experienceReward: 50
    },
    {
        title: "Erste Schritte",
        description: "Löse 10 Additions-Aufgaben",
        difficulty: DailyQuestDifficulty.BRONZE,
        requirement: 10,
        experienceReward: 50
    },
    {
        title: "Mathe-Anfänger",
        description: "Erreiche eine Streak von 3 richtigen Antworten",
        difficulty: DailyQuestDifficulty.BRONZE,
        requirement: 3,
        experienceReward: 50
    },
    
    // Silver Quests (Normal)
    {
        title: "Konstanter Rechner",
        description: "Erreiche eine Streak von 10 richtigen Antworten",
        difficulty: DailyQuestDifficulty.SILVER,
        requirement: 10,
        experienceReward: 100
    },
    {
        title: "Gemischte Übung",
        description: "Löse jeweils 5 Additions- und Subtraktionsaufgaben",
        difficulty: DailyQuestDifficulty.SILVER,
        requirement: 10,
        experienceReward: 100
    },
    {
        title: "Ausdauer-Training",
        description: "Spiele 10 Minuten am Stück",
        difficulty: DailyQuestDifficulty.SILVER,
        requirement: 600,
        experienceReward: 100
    },
    
    // Gold Quests (Schwierig)
    {
        title: "Mathe-Meister",
        description: "Löse 20 Aufgaben ohne Fehler",
        difficulty: DailyQuestDifficulty.GOLD,
        requirement: 20,
        experienceReward: 200
    },
    {
        title: "Blitz-Champion",
        description: "Löse 10 Aufgaben in jeweils unter 1 Minute",
        difficulty: DailyQuestDifficulty.GOLD,
        requirement: 10,
        experienceReward: 200
    },
    {
        title: "Große Zahlen",
        description: "Löse 15 Aufgaben mit Zahlen über 1000",
        difficulty: DailyQuestDifficulty.GOLD,
        requirement: 15,
        experienceReward: 200
    }
];

export function getRandomMotivationalMessage(difficulty: DailyQuestDifficulty): string {
    const messages = motivationalMessages[difficulty];
    return messages[Math.floor(Math.random() * messages.length)];
}

export function generateDailyQuests(): DailyQuest[] {
    const bronzeQuests = questTemplates.filter(q => q.difficulty === DailyQuestDifficulty.BRONZE);
    const silverQuests = questTemplates.filter(q => q.difficulty === DailyQuestDifficulty.SILVER);
    const goldQuests = questTemplates.filter(q => q.difficulty === DailyQuestDifficulty.GOLD);

    const getRandomQuest = (quests: Partial<DailyQuest>[]): DailyQuest => {
        const quest = quests[Math.floor(Math.random() * quests.length)];
        return {
            ...quest,
            id: `${quest.difficulty}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            progress: 0,
            completed: false,
            claimed: false,
            motivationalMessage: getRandomMotivationalMessage(quest.difficulty as DailyQuestDifficulty)
        } as DailyQuest;
    };

    return [
        getRandomQuest(bronzeQuests),
        getRandomQuest(silverQuests),
        getRandomQuest(goldQuests)
    ];
}
