import React from 'react';
import { useStatisticsStore } from '../store/statisticsStore';
import { useGameStore } from '../store/gameStore';
import { Operation } from '../types/calculations';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
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
    const { achievements } = useGameStore();

    return (
        <div className="space-y-4 sm:space-y-6">
            <GlobalStats />
            <Separator className="my-4 sm:my-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {Object.values(Operation).map((operation) => (
                    <OperationStatsCard key={operation} operation={operation} />
                ))}
            </div>
            <Separator className="my-4 sm:my-6" />
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle>Errungenschaften</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map(achievement => {
                            const currentLevel = achievement.levels[achievement.currentLevel];

                            // Calculate current level progress
                            const prevLevel = achievement.levels[achievement.currentLevel - 1];
                            const currentLevelProgress = prevLevel
                                ? ((achievement.progress - prevLevel.requirement) / (currentLevel.requirement - prevLevel.requirement)) * 100
                                : (achievement.progress / currentLevel.requirement) * 100;

                            // Calculate current level progress values
                            const currentProgress = prevLevel
                                ? (achievement.progress - prevLevel.requirement)
                                : achievement.progress;
                            const levelRequirement = currentLevel
                                ? (currentLevel.requirement - (prevLevel ? prevLevel.requirement : 0))
                                : 'Max';

                            return (
                                <Card key={achievement.id} className="transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold">{achievement.baseTitle}</h4>
                                            <Badge variant="secondary">
                                                Level {achievement.currentLevel}
                                            </Badge>
                                        </div>
                                        {currentLevel && (
                                            <>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {currentLevel.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {currentLevel.description}
                                                </p>
                                            </>
                                        )}
                                        <div>
                                            <Progress
                                                value={currentLevelProgress}
                                                className="h-2 mb-1"
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>{currentProgress}</span>
                                                <span>{levelRequirement}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
