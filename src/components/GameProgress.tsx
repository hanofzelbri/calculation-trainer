import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const GameProgress: React.FC = () => {
    const { 
        level, 
        experience, 
        experienceToNextLevel, 
        achievements,
        score 
    } = useGameStore();

    const experiencePercentage = (experience / experienceToNextLevel) * 100;

    return (
        <Card className="w-full mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                            <Badge variant="outline" className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                                {level}
                            </Badge>
                            <span className="text-sm text-muted-foreground mt-1">Level</span>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Progress value={experiencePercentage} className="h-3" />
                            <p className="text-sm text-muted-foreground mt-1 text-center">
                                {experience} / {experienceToNextLevel} XP
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">{score}</span>
                        <span className="text-sm text-muted-foreground">Punkte</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="mb-4">Errungenschaften</CardTitle>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="grid grid-cols-2 gap-4">
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
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
