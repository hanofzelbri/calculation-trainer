import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { useMultiplicationCalculator } from '../hooks/useMultiplicationCalculator';
import { Card } from './ui/card';

export const MultiplicationCalculator: React.FC = () => {
    const messageRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(48);
    const longestMessageRef = useRef<HTMLDivElement>(null);

    const {
        currentProblem,
        checkAnswer,
        isCorrect,
        streak,
        getRevealedMessage,
        isMessageComplete,
        startNewMessage
    } = useMultiplicationCalculator();

    // Calculate optimal font size once at initialization and on window resize
    useEffect(() => {
        const calculateOptimalFontSize = () => {
            const container = messageRef.current;
            const longestMessage = longestMessageRef.current;
            if (!container || !longestMessage) return;

            // Start with a large font size and decrease until no wrapping occurs
            let testSize = 48;
            const minSize = 24;

            while (testSize > minSize) {
                longestMessage.style.fontSize = `${testSize}px`;

                if (longestMessage.scrollWidth <= container.clientWidth) break;
                testSize -= 2;
            }

            setFontSize(testSize);
        };

        calculateOptimalFontSize();
        window.addEventListener('resize', calculateOptimalFontSize);
        return () => window.removeEventListener('resize', calculateOptimalFontSize);
    }, []); // Empty dependency array means this only runs once at mount

    const renderEquation = () => {
        if (!currentProblem) return null;

        const { num1, num2, result, missingPosition } = currentProblem;
        const parts = [];

        if (missingPosition === 'num1') {
            parts.push('?', '×', num2, '=', result);
        } else if (missingPosition === 'num2') {
            parts.push(num1, '×', '?', '=', result);
        } else {
            parts.push(num1, '×', num2, '=', '?');
        }

        return parts.map((part, index) => (
            <React.Fragment key={index}>
                {index > 0 && <span className="mx-2">{part}</span>}
                {index === 0 && <span>{part}</span>}
            </React.Fragment>
        ));
    };

    // Define the type for a letter item
    type LetterItem = {
        letter: string;
        revealed: boolean;
        isSpace: boolean;
    };

    // Group the message into words
    const messageWords = getRevealedMessage().reduce<LetterItem[][]>((acc, item) => {
        if (item.isSpace) {
            acc.push([]);
        } else {
            if (acc.length === 0) acc.push([]);
            acc[acc.length - 1].push(item);
        }
        return acc;
    }, []);

    return (
        <div className="space-y-6">
            <Card className="p-6">
                {/* Hidden element with longest possible message to calculate font size */}
                <div
                    ref={longestMessageRef}
                    className="absolute opacity-0 pointer-events-none whitespace-nowrap font-bold"
                    aria-hidden="true"
                >
                    YOU ARE INCREDIBLE KEEP GOING CHAMPION
                </div>

                <div ref={messageRef} className="font-bold text-center space-y-4">
                    <div className="flex justify-center items-center min-h-[100px]">
                        <div
                            className="message-content flex flex-wrap justify-center gap-x-4 gap-y-2"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {messageWords.map((word, wordIndex) => (
                                <div key={wordIndex} className="message-word flex">
                                    {word.map((item: LetterItem, letterIndex: React.Key | null | undefined) => (
                                        <span
                                            key={letterIndex}
                                            className={`transition-all duration-300 ${isMessageComplete ? 'text-green-600' : ''
                                                }`}
                                        >
                                            {item.revealed ? item.letter : '_'}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {!isMessageComplete && currentProblem && (
                        <>
                            <div className="text-primary flex justify-center items-center mt-6 text-4xl">
                                {renderEquation()}
                            </div>
                            <div className="text-2xl text-muted-foreground">
                                Streak: {streak}
                            </div>
                        </>
                    )}
                </div>

                {!isMessageComplete && currentProblem && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {currentProblem.choices.map((choice) => (
                            <Button
                                key={choice}
                                onClick={() => checkAnswer(choice)}
                                className="text-2xl py-8"
                                variant="outline"
                            >
                                {choice}
                            </Button>
                        ))}
                    </div>
                )}

                {isMessageComplete && (
                    <div className="mt-6 text-center">
                        <Button
                            onClick={startNewMessage}
                            className="text-xl px-8 py-6"
                            variant="default"
                        >
                            Nächste Nachricht
                        </Button>
                    </div>
                )}
            </Card>

            {!isMessageComplete && isCorrect !== null && (
                <div className={`text-center text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Richtig!' : 'Versuche es noch einmal!'}
                </div>
            )}
        </div>
    );
};
