import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useCalculatorStore } from '../store/calculatorStore';
import { Button } from './ui/button';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const History = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const history = useCalculatorStore(state => state.history);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Verlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentItems.map((entry) => (
              <div key={entry.timestamp} className="p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Aufgabe:</span>
                    <div className="text-lg">
                      {entry.numbers.join(' ' + entry.operation + ' ')} = {entry.correctAnswer}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Deine Antwort:</span>
                    <div className={`text-lg ${entry.correct ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.userAnswer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0}
                variant="outline"
              >
                Vorherige
              </Button>
              <span className="py-2">
                Seite {currentPage + 1} von {totalPages}
              </span>
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                variant="outline"
              >
                Nächste
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
