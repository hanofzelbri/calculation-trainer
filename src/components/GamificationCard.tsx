import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyQuest, DailyQuestDifficulty } from '../types/achievements';

interface QuestItemProps {
    quest: DailyQuest;
    onClaim: () => void;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onClaim }) => {
    const difficultyColors = {
        [DailyQuestDifficulty.BRONZE]: 'bg-amber-600',
        [DailyQuestDifficulty.SILVER]: 'bg-gray-400',
        [DailyQuestDifficulty.GOLD]: 'bg-yellow-400'
    };

    const difficultyNames = {
        [DailyQuestDifficulty.BRONZE]: 'Bronze',
        [DailyQuestDifficulty.SILVER]: 'Silber',
        [DailyQuestDifficulty.GOLD]: 'Gold'
    };

    return (
        <div className="p-4 border rounded-lg mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`${difficultyColors[quest.difficulty]} text-white px-2 py-1 rounded-full text-xs`}>
                        {difficultyNames[quest.difficulty]}
                    </div>
                    <h4 className="font-medium">{quest.title}</h4>
                </div>
                {quest.completed && !quest.claimed && (
                    <button
                        onClick={onClaim}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-full transition-colors"
                    >
                        +{quest.experienceReward} XP
                    </button>
                )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
            <Progress 
                value={(quest.progress / quest.requirement) * 100}
                className="h-2 mb-1"
            />
            <p className="text-xs text-muted-foreground">
                {quest.progress} / {quest.requirement}
            </p>
        </div>
    );
};

export const GamificationCard: React.FC = () => {
    const { 
        level, 
        experience, 
        experienceToNextLevel, 
        achievements,
        score,
        quests,
        claimQuest
    } = useGameStore();

    const experiencePercentage = (experience / experienceToNextLevel) * 100;

    return (
        <Card className="w-full">
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
                <Tabs defaultValue="achievements" className="w-full">
                    <TabsList className="w-full mb-4">
                        <TabsTrigger value="achievements" className="flex-1">Errungenschaften</TabsTrigger>
                        <TabsTrigger value="quests" className="flex-1">Tägliche Aufgaben</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="achievements">
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="grid grid-cols-2 gap-4">
                                {achievements.map(achievement => {
                                    const currentLevel = achievement.levels[achievement.currentLevel];
                                    const prevLevel = achievement.levels[achievement.currentLevel - 1];
                                    const currentLevelProgress = prevLevel
                                        ? ((achievement.progress - prevLevel.requirement) / (currentLevel.requirement - prevLevel.requirement)) * 100
                                        : (achievement.progress / currentLevel.requirement) * 100;
                                    
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
                                                <Progress 
                                                    value={currentLevelProgress}
                                                    className="h-2 mb-1"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {achievement.progress} / {currentLevel?.requirement}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="quests">
                        <ScrollArea className="h-[400px]">
                            <div className="pr-4">
                                {quests?.map((quest) => (
                                    <QuestItem
                                        key={quest.id}
                                        quest={quest}
                                        onClaim={() => claimQuest(quest.id)}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
