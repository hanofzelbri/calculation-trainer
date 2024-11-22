import React, { useEffect, useState, useRef } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
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
    } = useCalculatorStore();

    const [carries, setCarries] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const answerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const carryRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Berechne die maximale Länge des Ergebnisses
    const getMaxResultLength = () => {
        if (currentOperation === '+') {
            // Berechne die tatsächliche Summe
            const sum = currentNumbers.reduce((a, b) => a + b, 0);
            // Prüfe, ob das Ergebnis eine zusätzliche Stelle benötigt
            if (sum >= Math.pow(10, maxDigits)) {
                return maxDigits + 1;
            }
        }
        return maxDigits;
    };

    useEffect(() => {
        const maxResultLength = getMaxResultLength();
        // Übertrag hat jetzt genauso viele Stellen wie das Ergebnis
        setCarries(Array(maxResultLength).fill(''));
        setAnswer(Array(maxResultLength).fill(''));
        answerRefs.current = answerRefs.current.slice(0, maxResultLength);
        carryRefs.current = carryRefs.current.slice(0, maxResultLength);

        // Focus auf das rechteste Ergebnisfeld
        if (answerRefs.current.length > 0) {
            const lastIndex = maxResultLength - 1;
            answerRefs.current[lastIndex]?.focus();
        }
    }, [maxDigits, currentNumbers, currentOperation]);

    useEffect(() => {
        startNewTask();
    }, []);

    const handleCarryInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // Nur Zahlen erlauben

        const newCarries = [...carries];
        newCarries[index] = value;
        setCarries(newCarries);

        if (value) {
            // Nach Eingabe eines Übertrags zum entsprechenden Ergebnisfeld springen
            answerRefs.current[index]?.focus();
        }
    };

    const handleAnswerInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // Nur Zahlen erlauben

        const newAnswer = [...answer];
        newAnswer[index] = value;
        setAnswer(newAnswer);

        if (value) {
            // Nach Eingabe einer Zahl zum Übertragsfeld links davon springen
            if (index > 0) {
                carryRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, type: 'carry' | 'answer', index: number) => {
        if (event.key === 'Tab') {
            event.preventDefault();

            if (type === 'carry') {
                // Von Übertragsfeld zum entsprechenden Ergebnisfeld
                answerRefs.current[index]?.focus();
            } else if (type === 'answer') {
                // Von Ergebnisfeld zum Übertragsfeld links davon
                if (index > 0) {
                    carryRefs.current[index - 1]?.focus();
                }
            }
        } else if (event.key === 'Backspace' && (event.target as HTMLInputElement).value === '') {
            event.preventDefault();
            
            if (type === 'carry' && index < carries.length - 1) {
                // Vom Übertragsfeld zum Ergebnisfeld rechts davon
                answerRefs.current[index + 1]?.focus();
            } else if (type === 'answer' && index < answer.length - 1) {
                // Vom Ergebnisfeld zum Übertragsfeld rechts davon
                carryRefs.current[index]?.focus();
            }
        }
    };

    const isAnswerComplete = () => {
        // Mindestens die letzte Stelle muss ausgefüllt sein
        if (answer[answer.length - 1] === '') return false;
        
        // Wenn eine Stelle ausgefüllt ist, müssen alle Stellen rechts davon auch ausgefüllt sein
        let foundDigit = false;
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] !== '') foundDigit = true;
            if (foundDigit && answer[i] === '') return false;
        }
        return true;
    };

    const handleCheck = () => {
        if (!isAnswerComplete()) return;

        // Entferne führende Nullen und leere Stellen
        const userAnswer = parseInt(answer.join(''), 10);
        const isCorrect = checkAnswer(userAnswer);

        setFeedback(isCorrect ? 'Richtig!' : 'Falsch, versuche es noch einmal.');

        if (isCorrect) {
            startNewTask();
            const maxResultLength = getMaxResultLength();
            setCarries(Array(maxResultLength).fill(''));
            setAnswer(Array(maxResultLength).fill(''));
            // Focus auf das rechteste Ergebnisfeld
            const lastIndex = maxResultLength - 1;
            answerRefs.current[lastIndex]?.focus();
        }
    };

    return (
        <div className="container p-6 space-y-6 bg-white rounded-lg shadow-lg">
            <div className="calculation-area bg-white p-6 rounded-lg border shadow-lg space-y-6">
                <div className="flex flex-col items-end space-y-4">
                    {currentNumbers.map((number, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {/* Kein Operationszeichen mehr hier */}
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
