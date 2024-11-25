import React from 'react';
import { useStatisticsStore } from '../store/statistics.store';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Operation, DailyStats } from '@/types';

const formatTime = (ms: number): string => {
    if (ms === Infinity) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const StatCard = ({ value, description }: { value: string | number, description: string }) => (
    <Card className="text-center">
        <CardContent className="pt-6">
            <h3 className="text-2xl sm:text-4xl font-bold">{value}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
        </CardContent>
    </Card>
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
                    <div className="text-sm">Aktuelle Streak</div>
                    <div className="text-sm text-right">{stats.currentStreak}</div>
                    <div className="text-sm text-right"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">Beste Streak</div>
                    <div className="text-sm text-right">{stats.bestStreak}</div>
                    <div className="text-sm text-right"></div>
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

const TotalStatistics: React.FC = () => {
    const statistics = useStatisticsStore((state) => state.statistics);

    return (
        <Card className="col-span-1 sm:col-span-2">
            <CardHeader>
                <CardTitle>Gesamtstatistik</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        value={statistics.totalProblemsAllTime}
                        description="Aufgaben gesamt" />
                    <StatCard
                        value={formatTime(statistics.totalTimeSpentAllTime)}
                        description="Gesamtzeit" />
                    <div className="space-y-2">
                        <StatCard
                            value={statistics.currentStreak}
                            description="Aktuelle Streak" />
                        <StatCard
                            value={statistics.bestStreak}
                            description="Beste Streak" />
                    </div>
                    <StatCard
                        value={`${Math.round(statistics.averageAccuracy)}%`}
                        description="Durchschnittliche Genauigkeit" />
                </div>
            </CardContent>
        </Card>
    );
};

const TodayStatistics: React.FC = () => {
    const statistics = useStatisticsStore((state) => state.statistics);
    const today = new Date().toISOString().split('T')[0];
    const todayStats = statistics.dailyStats.find((ds: DailyStats) => ds.date === today);
    const todayAccuracy = todayStats
        ? Math.round((todayStats.accuracy) * 100) || 0
        : 0;

    return (
        <Card className="col-span-1 sm:col-span-2">
            <CardHeader>
                <CardTitle>Heute</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        value={todayStats?.problemsSolved || 0}
                        description="Problems Solved" />
                    <StatCard
                        value={formatTime(todayStats?.timeSpent || 0)}
                        description="Time Spent" />
                    <StatCard
                        value={todayStats?.accuracy ? `${(todayStats.accuracy * 100).toFixed(1)}%` : '0%'}
                        description="Accuracy" />
                    <StatCard
                        value={todayStats?.correctFirstTry || 0}
                        description="Richtig beim ersten Versuch" />
                    <StatCard
                        value={`${todayAccuracy}%`}
                        description="Genauigkeit heute" />
                </div>
            </CardContent>
        </Card>
    );
};

export const StatisticsView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <TotalStatistics />
            <TodayStatistics />
            {Object.values(Operation).map((operation) => (
                <OperationStatsCard key={operation} operation={operation} />
            ))}
        </div>
    );
};
