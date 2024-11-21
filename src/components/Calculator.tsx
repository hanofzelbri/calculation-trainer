import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Hearts } from './Hearts';
import { Timer } from './Timer';
import { History } from './History';

const Calculator: React.FC = () => {
    const {
        currentNumbers,
        correctAnswer,
        maxDigits,
        currentMode,
        testStarted,
        settings,
        setMode,
        setSettings,
        startNewTask,
        checkAnswer,
        startTest,
        endTest,
        addToHistory,
        taskStartTime
    } = useGameStore();

    const [carries, setCarries] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const answerRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Initialize empty arrays for carries and answer based on maxDigits
        setCarries(Array(maxDigits).fill(''));
        setAnswer(Array(maxDigits).fill(''));
        answerRefs.current = answerRefs.current.slice(0, maxDigits);
    }, [maxDigits]);

    // Start first task when component mounts
    useEffect(() => {
        if (currentMode === 'practice' && currentNumbers.length === 0) {
            startNewTask();
        }
    }, [currentMode]);

    const handleCarryInput = (index: number, value: string) => {
        const newCarries = [...carries];
        newCarries[index] = value;
        setCarries(newCarries);
    };

    const handleAnswerInput = (index: number, value: string) => {
        const newAnswer = [...answer];
        newAnswer[index] = value;
        setAnswer(newAnswer);

        // Move to next field if value is entered
        if (value && index < maxDigits - 1) {
            answerRefs.current[index + 1]?.focus();
        }
    };

    const handleCheck = () => {
        const userAnswer = parseInt(answer.join(''), 10);
        const isCorrect = checkAnswer(userAnswer);
        
        setFeedback(isCorrect ? 'Richtig!' : 'Falsch, versuche es noch einmal.');
        
        if (isCorrect) {
            // Create history entry
            const task = `${currentNumbers.join(' + ')} = ${userAnswer}`;
            const time = Date.now() - (taskStartTime || Date.now());
            addToHistory({ task, isCorrect, time });
            
            startNewTask();
            setCarries(Array(maxDigits).fill(''));
            setAnswer(Array(maxDigits).fill(''));
        }
    };

    const handleModeSwitch = (mode: 'practice' | 'test') => {
        setMode(mode);
        if (mode === 'practice') {
            startNewTask();
        }
    };

    const handleStartTest = () => {
        startTest();
        startNewTask();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="space-x-2">
                    <button 
                        className={`px-4 py-2 rounded ${currentMode === 'practice' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleModeSwitch('practice')}
                    >
                        Übungsmodus
                    </button>
                    <button 
                        className={`px-4 py-2 rounded ${currentMode === 'test' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleModeSwitch('test')}
                    >
                        Testmodus
                    </button>
                </div>
                {currentMode === 'test' && <Hearts />}
            </div>

            <div className="mb-4">
                <Timer mode={currentMode} onTestEnd={endTest} />
            </div>

            <div className="mb-4 space-y-2">
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <span className="mr-2">Maximale Zahl:</span>
                        <input
                            type="number"
                            value={settings.maxNumber}
                            onChange={(e) => setSettings({ maxNumber: parseInt(e.target.value, 10) })}
                            className="border rounded px-2 py-1"
                            min="1"
                            max="99999"
                        />
                    </label>
                    <label className="flex items-center">
                        <span className="mr-2">Anzahl Zahlen:</span>
                        <input
                            type="number"
                            value={settings.numberCount}
                            onChange={(e) => setSettings({ numberCount: parseInt(e.target.value, 10) })}
                            className="border rounded px-2 py-1"
                            min="2"
                            max="5"
                        />
                    </label>
                    {currentMode === 'test' && (
                        <label className="flex items-center">
                            <span className="mr-2">Testdauer (Min):</span>
                            <input
                                type="number"
                                value={settings.testDuration}
                                onChange={(e) => setSettings({ testDuration: parseInt(e.target.value, 10) })}
                                className="border rounded px-2 py-1"
                                min="1"
                                max="30"
                            />
                        </label>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => {
                            setCarries(Array(maxDigits).fill(''));
                            setAnswer(Array(maxDigits).fill(''));
                            startNewTask();
                        }}
                    >
                        Neue Aufgabe
                    </button>
                </div>
            </div>

            {(!testStarted && currentMode === 'test') ? (
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleStartTest}
                >
                    Test starten
                </button>
            ) : (
                <div className="calculation-area bg-white p-4 rounded shadow">
                    <div className="numbers-row space-y-2">
                        {currentNumbers.map((num, i) => (
                            <div key={`number-${i}`} className="flex justify-end space-x-2">
                                {i === currentNumbers.length - 1 && (
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        +
                                    </div>
                                )}
                                {String(num).padStart(maxDigits, ' ').split('').map((digit, j) => (
                                    <div key={`digit-${i}-${j}`} className="w-8 h-8 flex items-center justify-center">
                                        {digit !== ' ' ? digit : ''}
                                    </div>
                                ))}
                            </div>
                        ))}
                        
                        <div className="carries-row flex justify-end space-x-2">
                            <div className="w-8 h-8 flex items-center justify-center">
                                +
                            </div>
                            {carries.map((carry, index) => (
                                <input
                                    key={`carry-${index}`}
                                    type="text"
                                    value={carry}
                                    onChange={(e) => handleCarryInput(index, e.target.value)}
                                    className="w-8 h-8 text-center border rounded text-sm"
                                    maxLength={1}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="border-t border-black my-2" />
                    
                    <div className="answer-row flex justify-end space-x-2">
                        {answer.map((digit, index) => (
                            <input
                                key={`answer-${index}`}
                                ref={el => answerRefs.current[index] = el}
                                type="text"
                                value={digit}
                                onChange={(e) => handleAnswerInput(index, e.target.value)}
                                className="w-8 h-8 text-center border rounded"
                                maxLength={1}
                            />
                        ))}
                    </div>
                    
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleCheck}
                        disabled={answer.some(digit => digit === '')}
                    >
                        Überprüfen
                    </button>
                    
                    {feedback && (
                        <div className={`mt-2 ${feedback.includes('Richtig') ? 'text-green-500' : 'text-red-500'}`}>
                            {feedback}
                        </div>
                    )}
                </div>
            )}

            <History />
        </div>
    );
};

export default Calculator;
