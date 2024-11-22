import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const GameProgress: React.FC = () => {
    const { 
        level, 
        experience, 
        experienceToNextLevel
    } = useGameStore();

    const experiencePercentage = (experience / experienceToNextLevel) * 100;

    return (
        <Card className="w-full mb-4">
            <CardHeader>
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
            </CardHeader>
        </Card>
    );
};
