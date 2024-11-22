import React from 'react';
import { DailyQuest, DailyQuestDifficulty } from '../types/achievements';
import { useGameStore } from '../store/gameStore';

interface QuestCardProps {
    quest: DailyQuest;
    onClaim: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
    const difficultyColors = {
        [DailyQuestDifficulty.BRONZE]: 'bg-amber-600',
        [DailyQuestDifficulty.SILVER]: 'bg-gray-400',
        [DailyQuestDifficulty.GOLD]: 'bg-yellow-400'
    };

    const difficultyNames = {
        [DailyQuestDifficulty.BRONZE]: 'Bronze',
        [DailyQuestDifficulty.SILVER]: 'Silber',
        [DailyQuestDifficulty.GOLD]: 'Gold'
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className={`${difficultyColors[quest.difficulty]} text-white px-2 py-1 rounded-full text-sm inline-block mb-2`}>
                {difficultyNames[quest.difficulty]}
            </div>
            <h3 className="text-xl font-bold mb-2">{quest.title}</h3>
            <p className="text-gray-600 mb-4">{quest.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(quest.progress / quest.requirement) * 100}%` }}
                ></div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Fortschritt: {quest.progress} / {quest.requirement}
            </p>
            {quest.completed && !quest.claimed ? (
                <button
                    onClick={onClaim}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Belohnung abholen ({quest.experienceReward} XP)
                </button>
            ) : quest.claimed ? (
                <div className="text-green-600 font-bold text-center py-2">
                    ✓ Abgeschlossen!
                </div>
            ) : (
                <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                >
                    Noch nicht abgeschlossen
                </button>
            )}
        </div>
    );
};

const DailyQuests: React.FC = () => {
    const { quests, claimQuest } = useGameStore();

    return (
        <div className="grid grid-cols-3 gap-4 mb-4">
            {quests?.map((quest) => (
                <QuestCard
                    key={quest.id}
                    quest={quest}
                    onClaim={() => claimQuest(quest.id)}
                />
            ))}
        </div>
    );
};

export default DailyQuests;
