import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Calculator: React.FC = () => {
    const {
        currentNumbers,
        maxDigits,
        currentOperation,
        startNewTask,
        checkAnswer
    } = useGameStore();

    const [carries, setCarries] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const answerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const carryRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        setCarries(Array(maxDigits).fill(''));
        setAnswer(Array(maxDigits).fill(''));
        answerRefs.current = answerRefs.current.slice(0, maxDigits);
        carryRefs.current = carryRefs.current.slice(0, maxDigits);

        // Focus on the rightmost result field when a new task starts
        if (answerRefs.current.length > 0) {
            answerRefs.current[maxDigits - 1]?.focus();
        }
    }, [maxDigits, currentNumbers]);

    useEffect(() => {
        startNewTask();
    }, []);

    const handleCarryInput = (index: number, value: string) => {
        const newCarries = [...carries];
        newCarries[index] = value;
        setCarries(newCarries);

        if (value) {
            // After entering a carry, focus the corresponding result field
            answerRefs.current[index]?.focus();
        }
    };

    const handleAnswerInput = (index: number, value: string) => {
        const newAnswer = [...answer];
        newAnswer[index] = value;
        setAnswer(newAnswer);

        if (value) {
            // After entering a result, focus the carry field to the left
            if (index > 0) {
                carryRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, type: 'carry' | 'answer', index: number) => {
        if (event.key === 'Tab') {
            event.preventDefault();

            if (type === 'carry') {
                // From carry field, go to corresponding result field
                answerRefs.current[index]?.focus();
            } else if (type === 'answer') {
                // From result field, go to carry field to the left
                if (index > 0) {
                    carryRefs.current[index - 1]?.focus();
                }
            }
        }
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
            startNewTask();
            setCarries(Array(maxDigits).fill(''));
            setAnswer(Array(maxDigits).fill(''));
            answerRefs.current[0]?.focus();
        }
    };

    return (
        <div className="container p-6 space-y-6 bg-white rounded-lg shadow-lg">
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
                                    onKeyDown={(e) => handleKeyDown(e, 'carry', index)}
                                    className="w-12 h-12 text-center p-0 font-mono text-lg"
                                    maxLength={1}
                                    ref={(el) => carryRefs.current[index] = el}
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
                                    onKeyDown={(e) => handleKeyDown(e, 'answer', index)}
                                    className="w-12 h-12 text-center p-0 font-mono text-lg"
                                    maxLength={1}
                                    ref={(el) => answerRefs.current[index] = el}
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
        </div>
    );
};

export default Calculator;
