import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Hearts: React.FC = () => {
    const { hearts } = useGameStore();

    return (
        <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className={`text-2xl ${i < hearts ? 'text-red-500' : 'text-gray-300'}`}
                >
                    ❤️
                </div>
            ))}
        </div>
    );
};
