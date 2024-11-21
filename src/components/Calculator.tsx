import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Timer } from './Timer';
import { History } from './History';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";

const Calculator: React.FC = () => {
    const {
        currentNumbers,
        maxDigits,
        currentMode,
        testStarted,
        settings,
        setMode,
        setSettings,
        startNewTask,
        checkAnswer,
        startTest,
        endTest    } = useGameStore();

    const [carries, setCarries] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const answerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        setCarries(Array(maxDigits).fill(''));
        setAnswer(Array(maxDigits).fill(''));
        answerRefs.current = answerRefs.current.slice(0, maxDigits);
    }, [maxDigits]);

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

        if (value && index < maxDigits - 1) {
            answerRefs.current[index + 1]?.focus();
        }
    };

    const handleCheck = () => {
        const userAnswer = parseInt(answer.join(''), 10);
        const isCorrect = checkAnswer(userAnswer);
        
        setFeedback(isCorrect ? 'Richtig!' : 'Falsch, versuche es noch einmal.');
        
        if (isCorrect) {
            startNewTask();
            setCarries(Array(maxDigits).fill(''));
            setAnswer(Array(maxDigits).fill(''));
        }
    };

    const handleModeSwitch = (mode: 'practice' | 'test') => {
        setMode(mode);
    };

    const handleStartTest = () => {
        startTest();
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-x-2">
                    <Button 
                        variant={currentMode === 'practice' ? 'default' : 'outline'}
                        onClick={() => handleModeSwitch('practice')}
                    >
                        Übungsmodus
                    </Button>
                    <Button 
                        variant={currentMode === 'test' ? 'default' : 'outline'}
                        onClick={() => handleModeSwitch('test')}
                    >
                        Testmodus
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Einstellungen</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxNumber">Maximale Zahl</Label>
                                    <Input
                                        id="maxNumber"
                                        type="number"
                                        value={settings.maxNumber}
                                        onChange={(e: { target: { value: string; }; }) => setSettings({ maxNumber: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numberCount">Anzahl der Zahlen</Label>
                                    <Input
                                        id="numberCount"
                                        type="number"
                                        value={settings.numberCount}
                                        onChange={(e: { target: { value: string; }; }) => setSettings({ numberCount: parseInt(e.target.value) })}
                                    />
                                </div>
                                {currentMode === 'test' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="testDuration">Testdauer (Minuten)</Label>
                                        <Input
                                            id="testDuration"
                                            type="number"
                                            value={settings.testDuration}
                                            onChange={(e: { target: { value: string; }; }) => setSettings({ testDuration: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    {currentMode === 'test' && !testStarted && (
                        <Button onClick={handleStartTest}>
                            Test starten
                        </Button>
                    )}
                </div>
            </div>

            {currentMode === 'test' && testStarted && (
                <Timer mode={currentMode} onTestEnd={endTest} />
            )}

            <div className="calculation-area bg-white p-4 rounded-lg border shadow-sm space-y-4">
                <div className="numbers-row space-y-2">
                    {currentNumbers.map((num, i) => (
                        <div key={`number-${i}`} className="flex justify-end space-x-2">
                            {i === currentNumbers.length - 1 && (
                                <div className="w-8 h-8 flex items-center justify-center">
                                    +
                                </div>
                            )}
                            {String(num).padStart(maxDigits, ' ').split('').map((digit, j) => (
                                <div key={`digit-${i}-${j}`} className="w-8 h-8 flex items-center justify-center font-mono">
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
                            <Input
                                key={`carry-${index}`}
                                type="text"
                                value={carry}
                                onChange={(e: { target: { value: string; }; }) => handleCarryInput(index, e.target.value)}
                                className="w-8 h-8 text-center p-0"
                                maxLength={1}
                            />
                        ))}
                    </div>
                </div>
                
                <Separator />
                
                <div className="answer-row flex justify-end space-x-2">
                    {answer.map((digit, index) => (
                        <Input
                            key={`answer-${index}`}
                            ref={(el: HTMLInputElement | null) => answerRefs.current[index] = el}
                            type="text"
                            value={digit}
                            onChange={(e: { target: { value: string; }; }) => handleAnswerInput(index, e.target.value)}
                            className="w-8 h-8 text-center p-0"
                            maxLength={1}
                        />
                    ))}
                </div>
                
                <div className="flex justify-between items-center">
                    {currentMode === 'practice' && (
                        <Button
                            variant="outline"
                            onClick={startNewTask}
                        >
                            Neue Aufgabe
                        </Button>
                    )}
                    
                    <Button
                        onClick={handleCheck}
                        disabled={answer.some(digit => digit === '')}
                    >
                        Überprüfen
                    </Button>
                </div>
                
                {feedback && (
                    <div className={`text-center ${feedback.includes('Richtig') ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback}
                    </div>
                )}
            </div>

            <History />
        </div>
    );
};

export default Calculator;
