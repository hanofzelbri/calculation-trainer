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
    const carryRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsChanged, setSettingsChanged] = useState(false);

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
        if (currentMode === 'practice' && currentNumbers.length === 0) {
            startNewTask();
        }
    }, [currentMode, currentNumbers.length]);

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
        <div className="container p-6 space-y-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="space-x-3">
                    {testStarted ? (
                        <Button
                            variant="destructive"
                            onClick={handleEndTest}
                            className="text-lg py-6 px-8"
                        >
                            Test beenden
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant={currentMode === 'practice' ? 'default' : 'outline'}
                                onClick={() => handleModeSwitch('practice')}
                                className="text-lg py-6 px-8"
                            >
                                Übungsmodus
                            </Button>
                            <Button
                                variant={currentMode === 'test' ? 'default' : 'outline'}
                                onClick={() => handleModeSwitch('test')}
                                className="text-lg py-6 px-8"
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
                            className="text-lg py-6 px-8"
                        >
                            <Settings className="h-6 w-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-lg">Einstellungen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                            <div className="space-y-4">
                                <Label className="text-lg">Rechenoperationen</Label>
                                <div className="flex flex-col space-y-6">
                                    <div className="space-y-4">
                                        <label className="flex items-center space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={settings.addition.enabled}
                                                onChange={(e) => handleSettingsChange({
                                                    addition: { ...settings.addition, enabled: e.target.checked }
                                                })}
                                                className="w-6 h-6"
                                            />
                                            <span className="text-lg">Addition (+)</span>
                                        </label>
                                        {settings.addition.enabled && (
                                            <div className="ml-6 space-y-6">
                                                <div>
                                                    <Label htmlFor="additionMaxNumber" className="text-lg">Maximale Zahl</Label>
                                                    <Input
                                                        id="additionMaxNumber"
                                                        type="number"
                                                        min={1}
                                                        value={settings.addition.maxNumber}
                                                        onChange={(e) => handleSettingsChange({
                                                            addition: { ...settings.addition, maxNumber: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-2 text-lg p-6"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="additionNumberCount" className="text-lg">Anzahl der Zahlen</Label>
                                                    <Input
                                                        id="additionNumberCount"
                                                        type="number"
                                                        min={2}
                                                        value={settings.addition.numberCount}
                                                        onChange={(e) => handleSettingsChange({
                                                            addition: { ...settings.addition, numberCount: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-2 text-lg p-6"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="flex items-center space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={settings.subtraction.enabled}
                                                onChange={(e) => handleSettingsChange({
                                                    subtraction: { ...settings.subtraction, enabled: e.target.checked }
                                                })}
                                                className="w-6 h-6"
                                            />
                                            <span className="text-lg">Subtraktion (-)</span>
                                        </label>
                                        {settings.subtraction.enabled && (
                                            <div className="ml-6 space-y-6">
                                                <div>
                                                    <Label htmlFor="subtractionMaxNumber" className="text-lg">Maximale Zahl</Label>
                                                    <Input
                                                        id="subtractionMaxNumber"
                                                        type="number"
                                                        min={1}
                                                        value={settings.subtraction.maxNumber}
                                                        onChange={(e) => handleSettingsChange({
                                                            subtraction: { ...settings.subtraction, maxNumber: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-2 text-lg p-6"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="subtractionNumberCount" className="text-lg">Anzahl der Zahlen</Label>
                                                    <Input
                                                        id="subtractionNumberCount"
                                                        type="number"
                                                        min={2}
                                                        value={settings.subtraction.numberCount}
                                                        onChange={(e) => handleSettingsChange({
                                                            subtraction: { ...settings.subtraction, numberCount: parseInt(e.target.value) }
                                                        })}
                                                        className="mt-2 text-lg p-6"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {currentMode === 'test' && (
                                <div className="space-y-4">
                                    <Label htmlFor="testDuration" className="text-lg">Testdauer (Minuten)</Label>
                                    <Input
                                        id="testDuration"
                                        type="number"
                                        value={settings.testDuration}
                                        onChange={(e) => handleSettingsChange({ testDuration: parseInt(e.target.value) })}
                                        className="mt-2 text-lg p-6"
                                    />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {currentMode === 'test' && !testStarted && (
                <Button onClick={handleStartTest} className="text-lg py-6 px-8">
                    Test starten
                </Button>
            )}

            {currentMode === 'test' && testStarted && (
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <Hearts />
                    <Timer mode={currentMode} onTestEnd={endTest} />
                </div>
            )}

            {(currentMode === 'practice' || (currentMode === 'test' && testStarted)) && (
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
