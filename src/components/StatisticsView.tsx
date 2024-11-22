import React from 'react';
import { useStatisticsStore } from '../store/statisticsStore';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Operation } from '@/types';

const formatTime = (ms: number): string => {
    if (ms === Infinity) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const StatCard = ({ value, description }: { value: string | number, description: string }) => (
    <div className="text-center p-2 sm:p-4">
        <h3 className="text-2xl sm:text-4xl font-bold">{value}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
);

const OperationStatsCard: React.FC<{ operation: Operation }> = ({ operation }) => {
    const stats = useStatisticsStore((state) => state.statistics.operationStats[operation]);

    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold">{operation}</h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">Gesamt</div>
                    <div className="text-sm text-right">{stats.totalProblems}</div>
                    <div className="text-sm text-right">{Math.round((stats.correctFirstTry / stats.totalProblems) * 100 || 0)}%</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">Beim ersten Versuch</div>
                    <div className="text-sm text-right">{stats.correctFirstTry}</div>
                    <div className="text-sm text-right">{Math.round((stats.correctFirstTry / stats.totalProblems) * 100 || 0)}%</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">Fehler</div>
                    <div className="text-sm text-right">{stats.totalErrors}</div>
                    <div className="text-sm text-right">{Math.round((stats.totalErrors / stats.totalProblems) * 100 || 0)}%</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">Durchschnittszeit</div>
                    <div className="text-sm text-right">{Math.round(stats.averageTime / 1000)}s</div>
                    <div className="text-sm text-right"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm">Bestzeit</div>
                    <div className="text-sm text-right">{stats.bestTime === Infinity ? '-' : `${Math.round(stats.bestTime / 1000)}s`}</div>
                    <div className="text-sm text-right"></div>
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
                        description="Aufgaben gesamt" />
                    <StatCard
                        value={formatTime(statistics.totalTimeSpentAllTime)}
                        description="Gesamtzeit" />
                    <StatCard
                        value={statistics.currentStreak}
                        description="Aktuelle Streak" />
                    <StatCard
                        value={`${Math.round(statistics.averageAccuracy)}%`}
                        description="Durchschnittliche Genauigkeit" />
                </div>
            </CardContent>
        </Card>
    );
};

export const StatisticsView: React.FC = () => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <GlobalStats />
            <Separator className="my-4 sm:my-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {Object.values(Operation).map((operation) => (
                    <OperationStatsCard key={operation} operation={operation} />
                ))}
            </div>
        </div>
    );
};
