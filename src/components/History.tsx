import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { HistoryItem } from '../types';

interface HistoryEntry {
  task: string;
  isCorrect: boolean;
  time: number;
}

export const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev].slice(0, 10)); // Keep last 10 entries
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Verlauf</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((entry, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                entry.isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{entry.task}</span>
                <span className="text-gray-600">
                  {Math.round(entry.time / 100) / 10} Sekunden
                </span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-gray-500 text-center">
              Noch keine Aufgaben gelöst
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
