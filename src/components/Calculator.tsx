import React, { useEffect, useState, useRef } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Operation } from '../types';

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
    const [partialProducts, setPartialProducts] = useState<string[][]>([]);
    const answerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const carryRefs = useRef<(HTMLInputElement | null)[]>([]);
    const partialProductRefs = useRef<(HTMLInputElement | null)[][]>([]);

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
        } else if (currentOperation === '*') {
            // Für Multiplikation: Bestimme die Anzahl der Stellen basierend auf dem Produkt
            const product = currentNumbers[0] * currentNumbers[1];
            return product.toString().length;
        }
        return maxDigits;
    };

    useEffect(() => {
        // Only start a new task if we don't already have one
        if (!currentTask) {
            startNewTask();
        }
    }, [currentTask]);

    useEffect(() => {
        if (currentOperation === '*' && currentNumbers.length >= 2) {
            // Initialisiere die Teilprodukte für die Multiplikation
            const multiplier = currentNumbers[1].toString();
            setPartialProducts(Array(multiplier.length).fill(Array(getMaxResultLength()).fill('')));
            partialProductRefs.current = Array(multiplier.length)
                .fill(null)
                .map(() => Array(getMaxResultLength()).fill(null));
        }

        // Reset carry and answer values
        setCarryValues(Array(getMaxResultLength()).fill(''));
        setAnswerValues(Array(getMaxResultLength()).fill(''));

        // Reset refs
        answerRefs.current = answerRefs.current.slice(0, getMaxResultLength());
        carryRefs.current = carryRefs.current.slice(0, getMaxResultLength());

        // Focus auf das rechteste Ergebnisfeld
        if (answerRefs.current.length > 0) {
            const lastIndex = getMaxResultLength() - 1;
            answerRefs.current[lastIndex]?.focus();
        }
    }, [currentNumbers, currentOperation]);

    const handlePartialProductInput = (row: number, col: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newPartialProducts = [...partialProducts];
        newPartialProducts[row] = [...(newPartialProducts[row] || [])];
        newPartialProducts[row][col] = value;
        setPartialProducts(newPartialProducts);

        if (value !== '') {
            // Zum nächsten Feld springen
            const nextCol = col - 1;
            if (nextCol >= 0) {
                partialProductRefs.current[row][nextCol]?.focus();
            } else if (row < currentNumbers[1].toString().length - 1) {
                // Zur nächsten Zeile springen
                const nextRow = row + 1;
                const lastCol = getMaxResultLength() - 1;
                partialProductRefs.current[nextRow][lastCol]?.focus();
            }
        }
    };

    const handleCarryInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newCarryValues = [...carryValues];
        newCarryValues[index] = value;
        setCarryValues(newCarryValues);

        if (value) {
            answerRefs.current[index]?.focus();
        }
    };

    const handleAnswerInput = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newAnswerValues = [...answerValues];
        newAnswerValues[index] = value;
        setAnswerValues(newAnswerValues);

        if (value) {
            if (index > 0) {
                carryRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        input.select();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, type: 'carry' | 'answer' | 'partial', row?: number) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            if (type === 'carry') {
                answerRefs.current[parseInt(event.currentTarget.dataset.index || '0')]?.focus();
            } else if (type === 'answer') {
                const index = parseInt(event.currentTarget.dataset.index || '0');
                if (index > 0) {
                    carryRefs.current[index - 1]?.focus();
                }
            }
        }
    };

    const showFeedbackAnimation = (correct: boolean) => {
        setFeedback(correct ? 'Richtig' : 'Falsch');
    };

    const handleCheck = () => {
        if (currentOperation === '*') {
            // Für Multiplikation: Prüfe erst die Teilprodukte
            const multiplier = currentNumbers[1].toString();
            // Wenn es eine einfache Multiplikation mit 1 ist, überspringe die Teilprodukt-Prüfung
            const isSimpleMultiplication = multiplier === '1';
            
            if (!isSimpleMultiplication) {
                const allPartialProductsCorrect = partialProducts.every((product, index) => {
                    const expectedProduct = (currentNumbers[0] * parseInt(multiplier[index])).toString();
                    return product.join('') === expectedProduct;
                });

                if (!allPartialProductsCorrect) {
                    showFeedbackAnimation(false);
                    return;
                }
            }
        }

        // Entferne führende Nullen und leere Felder
        const userAnswerStr = answerValues
            .join('')
            .replace(/^0+/, '')  // Entferne führende Nullen
            .replace(/\s+/g, ''); // Entferne Leerzeichen

        // Wenn die Antwort leer ist (nur Nullen oder Leerzeichen), setze sie auf "0"
        const finalAnswerStr = userAnswerStr === '' ? '0' : userAnswerStr;
        
        const userAnswer = parseInt(finalAnswerStr, 10);
        const result = checkAnswer(userAnswer);
        showFeedbackAnimation(result);

        if (result) {
            // Clear all inputs
            setCarryValues(Array(getMaxResultLength()).fill(''));
            setAnswerValues(Array(getMaxResultLength()).fill(''));
            setPartialProducts([]);
        }
    };

    return (
        <div className="calculation-area bg-white p-6 rounded-lg border shadow-lg space-y-6">
            <div className="flex flex-col items-end space-y-4">
                {currentOperation === '*' ? (
                    <>
                        {/* Aufgabe */}
                        <div className="flex flex-col items-end">
                            {/* Erste Zahl */}
                            <div className="flex items-center">
                                <div className="flex">
                                    {String(currentNumbers[0]).split('').map((digit, index) => (
                                        <div key={index} className="w-12 h-12 flex items-center justify-center font-mono text-xl">
                                            {digit}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Multiplikationszeichen und zweite Zahl */}
                            <div className="flex items-center">
                                <div className="flex">
                                    <div className="w-12 h-12 flex items-center justify-center font-mono text-xl mr-2">
                                        ×
                                    </div>
                                    <div className="w-12 h-12 flex items-center justify-center font-mono text-xl">
                                        {currentNumbers[1]}
                                    </div>
                                </div>
                            </div>

                            {/* Linie */}
                            <div className="flex items-center mt-2">
                                <div className="border-t-2 border-black" style={{ width: `${(String(currentNumbers[0]).length + 1) * 3}rem` }} />
                            </div>
                        </div>

                        {/* Übertrag (kleine Zahlen oben) */}
                        <div className="flex items-center">
                            <div className="flex">
                                {Array(getMaxResultLength()).fill(0).map((_, i) => (
                                    <Input
                                        key={`carry-${i}`}
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-12 text-center p-0 font-mono text-xl"
                                        value={carryValues[i] || ''}
                                        onChange={(e) => handleCarryInput(i, e.target.value)}
                                        ref={(el) => carryRefs.current[i] = el}
                                        onKeyDown={(e) => handleKeyDown(e, 'carry')}
                                        onClick={handleInputClick}
                                        data-index={i}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ergebnis */}
                        <div className="flex items-center">
                            <div className="flex">
                                {Array(getMaxResultLength()).fill(0).map((_, i) => (
                                    <Input
                                        key={`answer-${i}`}
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-12 text-center p-0 font-mono text-xl"
                                        value={answerValues[i] || ''}
                                        onChange={(e) => handleAnswerInput(i, e.target.value)}
                                        ref={(el) => answerRefs.current[i] = el}
                                        onKeyDown={(e) => handleKeyDown(e, 'answer')}
                                        onClick={handleInputClick}
                                        data-index={i}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    // Normale Darstellung für Addition und Subtraktion
                    currentNumbers.map((number, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {index > 0 ? currentOperation : ''}
                            </div>
                            <div className="flex">
                                {String(number).split('').map((digit, digitIndex) => (
                                    <div key={digitIndex} className="w-12 h-12 flex items-center justify-center font-mono">
                                        {digit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleCheck}
                        className="text-lg py-6 px-8"
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
    );
};

export default Calculator;
