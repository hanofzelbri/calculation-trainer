import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useHistoryStore } from '../store/history.store';
import { HistoryEntry, HistoryFilter } from '@/types';
import { OperatorBadge } from './OperatorBadge';

export const History: React.FC = () => {
    const entries = useHistoryStore((state) => state.entries);
    const filter = useHistoryStore((state) => state.filter);
    const setFilter = useHistoryStore((state) => state.setFilter);

    const getFilteredHistory = () => {
        let filtered = entries;
        if (filter.timeRange.start) {
            filtered = filtered.filter(entry => entry.timestamp >= filter.timeRange.start!);
        }
        if (filter.timeRange.end) {
            filtered = filtered.filter(entry => entry.timestamp <= filter.timeRange.end!);
        }
        return filtered;
    };

    const handleFilterChange = (newFilter: HistoryFilter) => {
        setFilter(newFilter);
    };

    const filteredEntries = getFilteredHistory();
    const groups = filteredEntries.reduce((acc: HistoryEntry[][], entry: HistoryEntry) => {
        if (acc.length === 0) {
            acc.push([entry]);
            return acc;
        }

        const lastGroup = acc[acc.length - 1];
        const lastEntry = lastGroup[lastGroup.length - 1];

        if (lastEntry.task === entry.task) {
            lastGroup.push(entry);
        } else {
            acc.push([entry]);
        }

        return acc;
    }, []);

    const currentGroups = groups;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Verlauf</CardTitle>
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant={filter.showFirstAttempts ? "default" : "outline"}
                        onClick={() => handleFilterChange({ ...filter, showFirstAttempts: !filter.showFirstAttempts })}
                    >
                        Erste Versuche
                    </Button>
                    <Button
                        size="sm"
                        variant={filter.showMultipleAttempts ? "default" : "outline"}
                        onClick={() => handleFilterChange({ ...filter, showMultipleAttempts: !filter.showMultipleAttempts })}
                    >
                        Mehrere Versuche
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-18rem)] sm:h-[60vh]">
                    <div className="space-y-4">
                        {currentGroups.map((group) => {
                            const lastEntry = group[group.length - 1];
                            const firstEntry = group[0];

                            return (
                                <div
                                    key={firstEntry.timestamp.toString()}
                                    className={`p-4 border rounded-lg transition-colors ${lastEntry.isCorrect
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
                                            <div className="text-xl font-semibold">
                                                {firstEntry.task}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-sm text-muted-foreground">Versuche:</span>
                                            {group.map((attempt, index) => (
                                                <div key={attempt.timestamp.toString()} className="pl-4">
                                                    <div className={`text-base ${attempt.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                        {index + 1}. Versuch: {attempt.userAnswer}
                                                        <span className="text-sm text-muted-foreground ml-2">
                                                            ({((attempt.duration || 0) / 1000).toFixed(1)}s)
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="text-sm text-muted-foreground mt-2">
                                                Gesamtzeit: {(group.reduce((total: number, attempt: HistoryEntry) => total + (attempt.duration || 0), 0) / 1000).toFixed(1)}s
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
