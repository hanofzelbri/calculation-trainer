import React from 'react';
import { Button } from './ui/button';
import { useMultiplicationCalculator } from '../hooks/useMultiplicationCalculator';
import { Card } from './ui/card';

export const MultiplicationCalculator: React.FC = () => {
    const {
        currentProblem,
        checkAnswer,
        isCorrect,
        streak,
        getRevealedMessage,
        isMessageComplete,
        resetGame
    } = useMultiplicationCalculator();

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

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="text-4xl font-bold text-center space-y-4">
                    {currentProblem && (
                        <>
                            <div className="text-primary flex justify-center items-center">
                                {renderEquation()}
                            </div>
                            <div className="text-2xl text-muted-foreground">
                                Streak: {streak}
                            </div>
                        </>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {currentProblem?.choices.map((choice) => (
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
            </Card>

            <Card className="p-6">
                <div className="text-center space-y-4">
                    <div className="text-2xl font-bold">
                        Geheime Nachricht:
                    </div>
                    <div className="text-3xl font-mono tracking-wider">
                        {getRevealedMessage()}
                    </div>
                    {isMessageComplete() && (
                        <div className="mt-4">
                            <Button onClick={resetGame} variant="outline">
                                Neue Nachricht starten
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {isCorrect !== null && (
                <div className={`text-center text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Richtig!' : 'Versuche es noch einmal!'}
                </div>
            )}
        </div>
    );
};
