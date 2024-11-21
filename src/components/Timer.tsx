import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Card, CardContent } from './ui/card';

interface TimerProps {
    mode: 'practice' | 'test';
    onTestEnd: () => void;
}

export const Timer: React.FC<TimerProps> = ({ mode, onTestEnd }) => {
    const { settings } = useGameStore();
    const [timeLeft, setTimeLeft] = useState<number>(
        mode === 'test' ? settings.testDuration * 60 : 25 * 60
    );
    const [isRunning, setIsRunning] = useState<boolean>(mode === 'test');

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        if (mode === 'test') {
                            onTestEnd();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, timeLeft, mode, onTestEnd]);

    useEffect(() => {
        if (mode === 'test') {
            setTimeLeft(settings.testDuration * 60);
            setIsRunning(true);
        } else {
            setTimeLeft(25 * 60);
            setIsRunning(false);
        }
    }, [mode, settings.testDuration]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (mode === 'practice') {
            if (!isRunning) {
                setTimeLeft(25 * 60);
            }
            setIsRunning(!isRunning);
        }
    };

    return (
        <Card>
            <CardContent className="py-2">
                <div className="text-center">
                    <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
                    {mode === 'practice' && (
                        <button
                            onClick={toggleTimer}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            {isRunning ? 'Pause' : 'Start'}
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
