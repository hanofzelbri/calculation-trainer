import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useCalculatorStore } from '../store/calculatorStore';
import { Button } from './ui/button';
import { useState } from 'react';
import { Operation } from '../types';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

const ITEMS_PER_PAGE = 10;

const OperatorBadge = ({ operator }: { operator: Operation }) => {
  const colorMap = {
    [Operation.Addition]: 'bg-blue-100 text-blue-800',
    [Operation.Subtraction]: 'bg-purple-100 text-purple-800',
    [Operation.Multiplication]: 'bg-green-100 text-green-800',
    [Operation.Division]: 'bg-orange-100 text-orange-800',
  };

  return (
    <Badge className={`${colorMap[operator]} border-none`}>
      {operator}
    </Badge>
  );
};

export const History = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { historyFilter, setHistoryFilter, getFilteredHistory } = useCalculatorStore();
  
  // Get filtered history groups
  const filteredHistoryGroups = getFilteredHistory();
  const totalPages = Math.ceil(filteredHistoryGroups.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGroups = filteredHistoryGroups.slice(startIndex, endIndex);

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

  // Reset page when filter changes
  const handleFilterChange = (filter: Partial<typeof historyFilter>) => {
    setCurrentPage(0);
    setHistoryFilter(filter);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Verlauf</CardTitle>
          <div className="flex flex-col gap-4">
            {/* Attempt Type Filter */}
            <div className="flex gap-2">
              <Button
                variant={historyFilter.showFirstAttempts ? "default" : "outline"}
                onClick={() => handleFilterChange({ showFirstAttempts: !historyFilter.showFirstAttempts })}
                className="text-sm"
              >
                Erster Versuch
              </Button>
              <Button
                variant={historyFilter.showMultipleAttempts ? "default" : "outline"}
                onClick={() => handleFilterChange({ showMultipleAttempts: !historyFilter.showMultipleAttempts })}
                className="text-sm"
              >
                Mehrere Versuche
              </Button>
            </div>
            
            {/* Operator Filter */}
            <div className="flex gap-2">
              {Object.values(Operation).map((op) => (
                <Button
                  key={op}
                  variant={historyFilter.operations.includes(op) ? "default" : "outline"}
                  onClick={() => {
                    const newOperations = historyFilter.operations.includes(op)
                      ? historyFilter.operations.filter(o => o !== op)
                      : [...historyFilter.operations, op];
                    handleFilterChange({ operations: newOperations });
                  }}
                  className="text-sm"
                >
                  {op}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {currentGroups.map((group) => {
                const lastEntry = group[group.length - 1];
                const firstEntry = group[0];
                
                return (
                  <div 
                    key={firstEntry.timestamp} 
                    className={`p-4 border rounded-lg transition-colors ${
                      lastEntry.isCorrect 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <OperatorBadge operator={firstEntry.operation} />
                          {group.length === 1 && firstEntry.isCorrect && firstEntry.isFirstAttempt && (
                            <Badge className="bg-blue-100 text-blue-800 border-none">
                              Erster Versuch
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(firstEntry.timestamp).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })} {new Date(firstEntry.timestamp).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">Aufgabe:</span>
                        <div className="text-lg font-medium">
                          {firstEntry.numbers.join(` ${firstEntry.operation} `)} = {firstEntry.correctAnswer}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Versuche:</span>
                        {group.map((attempt, index) => (
                          <div key={attempt.timestamp} className="pl-4">
                            <div className={`text-base ${
                              attempt.isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {index + 1}. Versuch: {attempt.userAnswer}
                              <span className="text-sm text-muted-foreground ml-2">
                                ({(attempt.duration / 1000).toFixed(1)}s)
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="text-sm text-muted-foreground mt-2">
                          Gesamtzeit: {(group.reduce((total, attempt) => total + attempt.duration, 0) / 1000).toFixed(1)}s
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
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
