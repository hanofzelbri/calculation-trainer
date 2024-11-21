import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const Hearts: React.FC = () => {
    const { hearts } = useGameStore();
    const [burstingHeartIndex, setBurstingHeartIndex] = useState<number | null>(null);
    const [prevHearts, setPrevHearts] = useState(hearts);

    useEffect(() => {
        if (hearts < prevHearts) {
            setBurstingHeartIndex(prevHearts - 1);
            setTimeout(() => setBurstingHeartIndex(null), 500);
        }
        setPrevHearts(hearts);
    }, [hearts, prevHearts]);

    return (
        <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className={`
                        text-3xl
                        transition-all duration-300
                        ${i < hearts ? 'text-red-500' : 'text-gray-300 opacity-50'}
                        ${burstingHeartIndex === i ? 'animate-burst' : ''}
                    `}
                >
                    ♥
                </div>
            ))}
        </div>
    );
};
