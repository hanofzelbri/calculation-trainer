import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const MultiplicationCalculator: React.FC = () => {
    const [userAnswer, setUserAnswer] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUserAnswer('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-4xl font-bold text-center space-x-4">
                <span>Aufgabe wird generiert...</span>
            </div>
            
            <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-2xl text-center"
                autoFocus
            />

            <Button 
                type="submit" 
                className="w-full"
                disabled={!userAnswer}
            >
                Überprüfen
            </Button>
        </form>
    );
};
