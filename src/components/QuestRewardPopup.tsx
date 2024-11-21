import React from 'react';
import { DailyQuest } from '../types/achievements';

interface QuestRewardPopupProps {
    quest: DailyQuest;
    onClose: () => void;
}

const QuestRewardPopup: React.FC<QuestRewardPopupProps> = ({ quest, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform scale-100 animate-bounce-in">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Aufgabe abgeschlossen!
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                        {quest.motivationalMessage}
                    </p>
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 font-semibold">
                            + {quest.experienceReward} XP
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                        Weiter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestRewardPopup;
