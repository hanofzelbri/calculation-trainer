import React from 'react';
import { DailyQuest } from '../types/achievements';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface QuestRewardPopupProps {
    quest: DailyQuest;
    onClose: () => void;
}

const QuestRewardPopup: React.FC<QuestRewardPopupProps> = ({ quest, onClose }) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <DialogTitle className="text-2xl font-bold mb-4">
                            Aufgabe abgeschlossen!
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-6">
                        {quest.motivationalMessage}
                    </p>
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <p className="text-blue-800 font-semibold">
                                + {quest.experienceReward} XP
                            </p>
                        </CardContent>
                    </Card>
                    <Button onClick={onClose} className="w-full">
                        Weiter
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuestRewardPopup;
