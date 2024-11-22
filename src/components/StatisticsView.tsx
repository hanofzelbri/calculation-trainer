import React from 'react';
import { useStatisticsStore } from '../store/statisticsStore';
import { Operation } from '../types/calculations';
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const formatTime = (ms: number): string => {
    if (ms === Infinity) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatAccuracy = (correct: number, total: number): string => {
    if (total === 0) return '0%';
    return `${Math.round((correct / total) * 100)}%`;
};

const StatCard = ({ title, value, description }: { title: string, value: string | number, description: string }) => (
    <div className="text-center p-4">
        <h3 className="text-4xl font-bold">{value}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

const OperationStatsCard: React.FC<{ operation: Operation }> = ({ operation }) => {
    const stats = useStatisticsStore((state) => state.statistics.operationStats[operation]);

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold">{operation}</h3>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-muted-foreground">Gesamt Aufgaben:</div>
                    <div className="text-sm text-right">{stats.totalProblems}</div>
                    
                    <div className="text-sm text-muted-foreground">Erste Versuch richtig:</div>
                    <div className="text-sm text-right">
                        {formatAccuracy(stats.correctFirstTry, stats.totalProblems)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">Durchschnittszeit:</div>
                    <div className="text-sm text-right">{formatTime(stats.averageTime)}</div>
                    
                    <div className="text-sm text-muted-foreground">Beste Zeit:</div>
                    <div className="text-sm text-right">{formatTime(stats.bestTime)}</div>
                    
                    <div className="text-sm text-muted-foreground">Tests abgeschlossen:</div>
                    <div className="text-sm text-right">{stats.testsCompleted}</div>
                </div>
            </CardContent>
        </Card>
    );
};

const GlobalStats: React.FC = () => {
    const statistics = useStatisticsStore((state) => state.statistics);

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold">Gesamtstatistik</h3>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard 
                        value={statistics.totalProblemsAllTime}
                        description="Aufgaben gesamt"
                    />
                    <StatCard 
                        value={formatTime(statistics.totalTimeSpentAllTime)}
                        description="Gesamtzeit"
                    />
                    <StatCard 
                        value={statistics.currentStreak}
                        description="Aktuelle Streak"
                    />
                    <StatCard 
                        value={`${Math.round(statistics.averageAccuracy * 100)}%`}
                        description="Durchschnittliche Genauigkeit"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export const StatisticsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <GlobalStats />
            <Separator className="my-6" />
            <div className="grid md:grid-cols-2 gap-6">
                {Object.values(Operation).map((operation) => (
                    <OperationStatsCard key={operation} operation={operation} />
                ))}
            </div>
        </div>
    );
};
