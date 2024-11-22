import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Timer } from './Timer';
import { Hearts } from './Hearts';
import { History } from './History';
import { TestResultsDialog } from './TestResultsDialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const Test: React.FC = () => {
    const {
        currentNumbers,
        maxDigits,
        testStarted,
        currentOperation,
        startTest,
        endTest,
        checkAnswer
    } = useGameStore();

    const [carries, setCarries] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const [showResults, setShowResults] = useState(false);

    const handleStartTest = () => {
        startTest();
        setCarries(Array(maxDigits).fill(''));
        setAnswer(Array(maxDigits).fill(''));
        setFeedback('');
    };

    const handleEndTest = () => {
        endTest();
        setShowResults(true);
    };

    const handleCarryInput = (index: number, value: string) => {
        const newCarries = [...carries];
        newCarries[index] = value;
        setCarries(newCarries);
    };

    const handleAnswerInput = (index: number, value: string) => {
        const newAnswer = [...answer];
        newAnswer[index] = value;
        setAnswer(newAnswer);
    };

    const isAnswerComplete = () => {
        return answer.every(digit => digit !== '');
    };

    const handleCheck = () => {
        if (!isAnswerComplete()) return;

        const userAnswer = parseInt(answer.join(''), 10);
        const isCorrect = checkAnswer(userAnswer);

        setFeedback(isCorrect ? 'Richtig!' : 'Falsch, versuche es noch einmal.');

        if (isCorrect) {
            setCarries(Array(maxDigits).fill(''));
            setAnswer(Array(maxDigits).fill(''));
        }
    };

    const handleCloseResults = () => {
        setShowResults(false);
    };

    const handleRestartTest = () => {
        setShowResults(false);
        handleStartTest();
    };

    if (!testStarted) {
        return (
            <div className="container p-6 space-y-6 bg-white rounded-lg shadow-lg">
                <Button onClick={handleStartTest} className="text-lg py-6 px-8">
                    Test starten
                </Button>
            </div>
        );
    }

    return (
        <div className="container p-6 space-y-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <Hearts />
                <Timer onTestEnd={handleEndTest} />
                <Button
                    variant="destructive"
                    onClick={handleEndTest}
                    className="text-lg py-6 px-8"
                >
                    Test beenden
                </Button>
            </div>

            <div className="calculation-area bg-white p-6 rounded-lg border shadow-lg space-y-6">
                <div className="flex flex-col items-end space-y-4">
                    {currentNumbers.map((number, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {index === currentNumbers.length - 1 && currentOperation}
                            </div>
                            <div className="flex">
                                {Array.from({ length: maxDigits - String(number).length }, (_, i) => (
                                    <div key={i} className="w-12 h-12 flex items-center justify-center font-mono" />
                                ))}
                                {String(number).split('').map((digit, digitIndex) => (
                                    <div key={digitIndex} className="w-12 h-12 flex items-center justify-center font-mono">
                                        {digit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center">
                            {currentOperation}
                        </div>
                        <div className="flex">
                            {carries.map((carry, index) => (
                                <Input
                                    key={`carry-${index}`}
                                    type="text"
                                    value={carry}
                                    onChange={(e) => handleCarryInput(index, e.target.value)}
                                    className="w-12 h-12 text-center p-0 font-mono text-lg"
                                    maxLength={1}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            ))}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center">
                            =
                        </div>
                        <div className="flex">
                            {answer.map((digit, index) => (
                                <Input
                                    key={`answer-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleAnswerInput(index, e.target.value)}
                                    className="w-12 h-12 text-center p-0 font-mono text-lg"
                                    maxLength={1}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={handleCheck}
                            className="text-lg py-6 px-8"
                            disabled={!isAnswerComplete()}
                        >
                            Überprüfen
                        </Button>
                    </div>

                    {feedback && (
                        <div className={`text-center ${feedback.includes('Richtig') ? 'text-green-600' : 'text-red-600'} text-lg`}>
                            {feedback}
                        </div>
                    )}
                </div>
            </div>

            <History />
            {showResults && (
                <TestResultsDialog
                    onClose={handleCloseResults}
                    onRestart={handleRestartTest}
                />
            )}
        </div>
    );
};
