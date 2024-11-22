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
        checkAnswer,
        currentTask
    } = useCalculatorStore();

    const [feedback, setFeedback] = useState<string>('');
    const [carryValues, setCarryValues] = useState<string[]>(Array(maxDigits).fill(''));
    const [answerValues, setAnswerValues] = useState<string[]>(Array(maxDigits).fill(''));
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
        } else if (currentOperation === '-') {
            // Für Subtraktion: Bestimme die Anzahl der Stellen basierend auf der größten Zahl
            const maxNumber = Math.max(...currentNumbers);
            return maxNumber.toString().length;
        }
        return maxDigits;
    };

    useEffect(() => {
        const maxResultLength = getMaxResultLength();
        // Übertrag hat jetzt genauso viele Stellen wie das Ergebnis
        answerRefs.current = answerRefs.current.slice(0, maxResultLength);
        carryRefs.current = carryRefs.current.slice(0, maxResultLength);

        // Focus auf das rechteste Ergebnisfeld
        if (answerRefs.current.length > 0) {
            const lastIndex = maxResultLength - 1;
            answerRefs.current[lastIndex]?.focus();
        }
    }, [maxDigits, currentNumbers, currentOperation]);

    useEffect(() => {
        // Only start a new task if we don't already have one
        if (!currentTask) {
            startNewTask();
        }
    }, [currentTask]);

    const handleCarryInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // Nur Zahlen erlauben

        const newCarryValues = [...carryValues];
        newCarryValues[index] = value;
        setCarryValues(newCarryValues);

        if (value) {
            // Nach Eingabe eines Übertrags zum entsprechenden Ergebnisfeld springen
            answerRefs.current[index]?.focus();
        }
    };

    const handleAnswerInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // Nur Zahlen erlauben

        const newAnswerValues = [...answerValues];
        newAnswerValues[index] = value;
        setAnswerValues(newAnswerValues);

        if (value) {
            // Nach Eingabe einer Zahl zum Übertragsfeld links davon springen
            if (index > 0) {
                carryRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        input.select();
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
            
            if (type === 'carry' && index < carryRefs.current.length - 1) {
                // Vom Übertragsfeld zum Ergebnisfeld rechts davon
                answerRefs.current[index + 1]?.focus();
            } else if (type === 'answer' && index < answerRefs.current.length - 1) {
                // Vom Ergebnisfeld zum Übertragsfeld rechts davon
                carryRefs.current[index]?.focus();
            }
        }
    };

    const showFeedbackAnimation = (correct: boolean) => {
        setFeedback(correct ? 'Richtig' : 'Falsch');
    };

    const handleCheck = () => {
        const maxResultLength = getMaxResultLength();
        const userAnswer = Array.from({ length: maxResultLength }, (_, i) => (document.querySelector(`#answer-${i}`) as HTMLInputElement).value).join('');
        const result = checkAnswer(parseInt(userAnswer, 10));
        showFeedbackAnimation(result);

        if (result) {
            // Clear the input fields but don't start a new task - that will happen automatically after delay
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input) => input.value = '');
        } else {
            // Bei falscher Antwort: Fokus auf das letzte Feld setzen
            const lastIndex = maxResultLength - 1;
            answerRefs.current[lastIndex]?.focus();
        }
    };

    return (
        <div className={`container p-6 space-y-6 bg-white rounded-lg shadow-lg ${feedback ? (feedback === 'Richtig' ? 'feedback-correct' : 'feedback-incorrect') : ''} ${feedback ? 'feedback-animation' : ''}`}>
            <div className="calculation-area bg-white p-6 rounded-lg border shadow-lg space-y-6">
                <div className="flex flex-col items-end space-y-4">
                    {currentNumbers.map((number, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {index > 0 ? currentOperation : ''}
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

                    {/* Carry row */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center">
                            {/* Leerer Platz für Ausrichtung */}
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center">
                            {currentOperation}
                        </div>
                        <div className="flex">
                            {Array.from({ length: getMaxResultLength() }, (_, i) => (
                                <Input
                                    key={`carry-${i}`}
                                    type="number"
                                    value={carryValues[i] || ''}
                                    onChange={(e) => handleCarryInput(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'carry', i)}
                                    className="w-12 h-12 text-center p-0 font-mono text-lg"
                                    maxLength={1}
                                    ref={(el) => carryRefs.current[i] = el}
                                    onClick={handleInputClick}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="off"
                                />
                            ))}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Result row */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center">
                            =
                        </div>
                        <div className="flex">
                            {Array.from({ length: getMaxResultLength() }, (_, i) => (
                                <Input
                                    key={`answer-${i}`}
                                    type="number"
                                    value={answerValues[i] || ''}
                                    onChange={(e) => handleAnswerInput(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'answer', i)}
                                    className="w-12 h-12 text-center p-0 font-mono text-lg"
                                    maxLength={1}
                                    ref={(el) => answerRefs.current[i] = el}
                                    onClick={handleInputClick}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="off"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={handleCheck}
                            className="text-lg py-6 px-8"
                            disabled={false}
                        >
                            Überprüfen
                        </Button>
                    </div>

                    {feedback && (
                        <div className={`text-center ${feedback === 'Richtig' ? 'text-green-600' : 'text-red-600'} text-lg`}>
                            {feedback}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calculator;
