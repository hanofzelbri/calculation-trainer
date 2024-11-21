import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Timer } from './Timer';
import { History } from './History';
import { Hearts } from './Hearts';
import { TestResultsDialog } from './TestResultsDialog';
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
        currentOperation,
        setMode,
        setSettings,
        startNewTask,
        checkAnswer,
        startTest,
        endTest } = useGameStore();

    const [carries, setCarries] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const answerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsChanged, setSettingsChanged] = useState(false);

    useEffect(() => {
        setCarries(Array(maxDigits).fill(''));
        setAnswer(Array(maxDigits).fill(''));
        answerRefs.current = answerRefs.current.slice(0, maxDigits);
    }, [maxDigits]);

    useEffect(() => {
        if (currentMode === 'practice' && currentNumbers.length === 0) {
            startNewTask();
        }
    }, [currentMode, currentNumbers.length, startNewTask]);

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
            answerRefs.current[0]?.focus();
        }
    };

    const handleModeSwitch = (mode: 'practice' | 'test') => {
        setMode(mode);
    };

    const handleStartTest = () => {
        startTest();
    };

    const handleEndTest = () => {
        endTest();
    };

    const handleCloseResults = () => {
        setMode('practice');
    };

    const handleRestartTest = () => {
        setMode('test');
        startTest();
    };

    const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
        setSettings(newSettings);
        setSettingsChanged(true);
    };

    const handleSettingsDialogChange = (open: boolean) => {
        setSettingsOpen(open);
        if (!open && settingsChanged && currentMode === 'practice') {
            startNewTask();
            setSettingsChanged(false);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-x-2">
                    {testStarted ? (
                        <Button 
                            variant="destructive" 
                            onClick={handleEndTest}
                        >
                            Test beenden
                        </Button>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
                <Dialog open={settingsOpen} onOpenChange={handleSettingsDialogChange}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            type="button"
                            disabled={testStarted}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Einstellungen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Rechenoperationen</Label>
                                <div className="flex flex-col space-y-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={settings.addition.enabled}
                                                onChange={(e) => handleSettingsChange({ 
                                                    addition: { ...settings.addition, enabled: e.target.checked }
                                                })}
                                                className="w-4 h-4"
                                            />
                                            <span>Addition (+)</span>
                                        </label>
                                        {settings.addition.enabled && (
                                            <div className="ml-6 space-y-4">
                                                <div>
                                                    <Label htmlFor="additionMaxNumber">Maximale Zahl</Label>
                                                    <Input
                                                        id="additionMaxNumber"
                                                        type="number"
                                                        min={1}
                                                        value={settings.addition.maxNumber}
                                                        onChange={(e) => handleSettingsChange({ 
                                                            addition: { ...settings.addition, maxNumber: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="additionNumberCount">Anzahl der Zahlen</Label>
                                                    <Input
                                                        id="additionNumberCount"
                                                        type="number"
                                                        min={2}
                                                        value={settings.addition.numberCount}
                                                        onChange={(e) => handleSettingsChange({ 
                                                            addition: { ...settings.addition, numberCount: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={settings.subtraction.enabled}
                                                onChange={(e) => handleSettingsChange({ 
                                                    subtraction: { ...settings.subtraction, enabled: e.target.checked }
                                                })}
                                                className="w-4 h-4"
                                            />
                                            <span>Subtraktion (-)</span>
                                        </label>
                                        {settings.subtraction.enabled && (
                                            <div className="ml-6 space-y-4">
                                                <div>
                                                    <Label htmlFor="subtractionMaxNumber">Maximale Zahl</Label>
                                                    <Input
                                                        id="subtractionMaxNumber"
                                                        type="number"
                                                        min={1}
                                                        value={settings.subtraction.maxNumber}
                                                        onChange={(e) => handleSettingsChange({ 
                                                            subtraction: { ...settings.subtraction, maxNumber: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="subtractionNumberCount">Anzahl der Zahlen</Label>
                                                    <Input
                                                        id="subtractionNumberCount"
                                                        type="number"
                                                        min={2}
                                                        value={settings.subtraction.numberCount}
                                                        onChange={(e) => handleSettingsChange({ 
                                                            subtraction: { ...settings.subtraction, numberCount: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {currentMode === 'test' && (
                                <div className="space-y-2">
                                    <Label htmlFor="testDuration">Testdauer (Minuten)</Label>
                                    <Input
                                        id="testDuration"
                                        type="number"
                                        value={settings.testDuration}
                                        onChange={(e) => handleSettingsChange({ testDuration: parseInt(e.target.value) })}
                                    />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {currentMode === 'test' && !testStarted && (
                <Button onClick={handleStartTest}>
                    Test starten
                </Button>
            )}

            {currentMode === 'test' && testStarted && (
                <div className="flex justify-between items-center">
                    <Hearts />
                    <Timer mode={currentMode} onTestEnd={endTest} />
                </div>
            )}

            {(currentMode === 'practice' || testStarted) && (
                <div className="calculation-area bg-white p-4 rounded-lg border shadow-sm space-y-4">
                    <div className="flex flex-col items-end space-y-2">
                        {currentNumbers.map((number, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {index === currentNumbers.length - 1 && currentOperation}
                                </div>
                                <div className="flex">
                                    {Array.from({ length: maxDigits - String(number).length }, (_, i) => (
                                        <div key={i} className="w-8 h-8 flex items-center justify-center font-mono" />
                                    ))}
                                    {String(number).split('').map((digit, digitIndex) => (
                                        <div key={digitIndex} className="w-8 h-8 flex items-center justify-center font-mono">
                                            {digit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center">
                                {currentOperation}
                            </div>
                            <div className="flex">
                                {carries.map((carry, index) => (
                                    <Input
                                        key={`carry-${index}`}
                                        type="text"
                                        value={carry}
                                        onChange={(e) => handleCarryInput(index, e.target.value)}
                                        className="w-8 h-8 text-center p-0 font-mono"
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center">
                                =
                            </div>
                            <div className="flex">
                                {answer.map((digit, index) => (
                                    <Input
                                        key={`answer-${index}`}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleAnswerInput(index, e.target.value)}
                                        className="w-8 h-8 text-center p-0 font-mono"
                                        maxLength={1}
                                        ref={(el) => answerRefs.current[index] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button onClick={handleCheck}>
                            Überprüfen
                        </Button>
                    </div>

                    {feedback && (
                        <div className={`text-center ${feedback.includes('Richtig') ? 'text-green-600' : 'text-red-600'}`}>
                            {feedback}
                        </div>
                    )}
                </div>
            )}

            <History />
            <TestResultsDialog 
                onClose={handleCloseResults}
                onRestart={handleRestartTest}
            />
        </div>
    );
};

export default Calculator;
