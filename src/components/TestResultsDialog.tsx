import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TestResultsDialogProps {
    onClose: () => void;
    onRestart: () => void;
}

export const TestResultsDialog: React.FC<TestResultsDialogProps> = ({ onClose, onRestart }) => {
    const {
        showResultPopup,
        correctAnswersInTest,
        score,
        hearts,
        settings,
        history
    } = useGameStore();

    // Berechne die Statistiken
    const averageTimePerTask = history.length > 0 
        ? history.slice(0, correctAnswersInTest).reduce((sum, entry) => sum + entry.time, 0) / correctAnswersInTest / 1000 
        : 0;

    const accuracy = history.length > 0
        ? (correctAnswersInTest / history.length) * 100
        : 0;

    return (
        <Dialog open={showResultPopup} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">Testergebnis</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="font-medium">Richtige Antworten:</div>
                        <div className="text-right">{correctAnswersInTest}</div>
                        
                        <div className="font-medium">Genauigkeit:</div>
                        <div className="text-right">{accuracy.toFixed(1)}%</div>
                        
                        <div className="font-medium">Verbleibende Herzen:</div>
                        <div className="text-right">{hearts}</div>
                        
                        <div className="font-medium">Gesamtpunktzahl:</div>
                        <div className="text-right">{score}</div>
                        
                        <div className="font-medium">Zeit pro Aufgabe:</div>
                        <div className="text-right">{averageTimePerTask.toFixed(1)} Sek.</div>
                        
                        <div className="font-medium">Testdauer:</div>
                        <div className="text-right">{settings.testDuration} Min.</div>
                    </div>

                    <Separator />

                    <div className="flex justify-between gap-4">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Schließen
                        </Button>
                        <Button onClick={onRestart} className="flex-1">
                            Neuen Test starten
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
