import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useGameStore } from '../store/gameStore';
import { Button } from './ui/button';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const History = () => {
  const history = useGameStore(state => state.history);
  const [currentPage, setCurrentPage] = useState(1);

  const formatTask = (entry: typeof history[0]) => {
    return `${entry.numbers.join(` ${entry.operation} `)} = ${entry.userAnswer}`;
  };

  const calculateTimeTaken = (entry: typeof history[0]) => {
    return Math.round((entry.timestamp - entry.taskStartTime) / 100) / 10;
  };

  const reversedHistory = [...history].reverse();
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEntries = reversedHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Verlauf</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {currentEntries.map((entry, index) => (
            <div
              key={startIndex + index}
              className={`p-3 rounded ${
                entry.correct ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{formatTask(entry)}</span>
                <span className="text-gray-600">
                  {calculateTimeTaken(entry)} Sekunden
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
        
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Vorherige
            </Button>
            <span className="text-sm text-gray-600">
              Seite {currentPage} von {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Nächste
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
