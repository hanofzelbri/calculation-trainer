import React from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Settings: React.FC = () => {
    const {
        settings,
        setSettings,
    } = useCalculatorStore();

    const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
        setSettings(newSettings);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rechenoperationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Addition (+)</CardTitle>
                        <input
                            type="checkbox"
                            checked={settings.addition.enabled}
                            onChange={(e) => handleSettingsChange({
                                addition: { ...settings.addition, enabled: e.target.checked }
                            })}
                            className="w-6 h-6"
                        />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="additionMaxNumber" className="text-lg">Maximale Zahl</Label>
                            <Input
                                id="additionMaxNumber"
                                type="number"
                                min={1}
                                value={settings.addition.maxNumber}
                                onChange={(e) => handleSettingsChange({
                                    addition: { ...settings.addition, maxNumber: parseInt(e.target.value) }
                                })}
                                className="mt-2 text-lg p-6"
                            />
                        </div>
                        <div>
                            <Label htmlFor="additionNumberCount" className="text-lg">Anzahl der Zahlen</Label>
                            <Input
                                id="additionNumberCount"
                                type="number"
                                min={2}
                                value={settings.addition.numberCount}
                                onChange={(e) => handleSettingsChange({
                                    addition: { ...settings.addition, numberCount: parseInt(e.target.value) }
                                })}
                                className="mt-2 text-lg p-6"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Subtraktion (-)</CardTitle>
                        <input
                            type="checkbox"
                            checked={settings.subtraction.enabled}
                            onChange={(e) => handleSettingsChange({
                                subtraction: { ...settings.subtraction, enabled: e.target.checked }
                            })}
                            className="w-6 h-6"
                        />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="subtractionMaxNumber" className="text-lg">Maximale Zahl</Label>
                            <Input
                                id="subtractionMaxNumber"
                                type="number"
                                min={1}
                                value={settings.subtraction.maxNumber}
                                onChange={(e) => handleSettingsChange({
                                    subtraction: { ...settings.subtraction, maxNumber: parseInt(e.target.value) }
                                })}
                                className="mt-2 text-lg p-6"
                            />
                        </div>
                        <div>
                            <Label htmlFor="subtractionNumberCount" className="text-lg">Anzahl der Zahlen</Label>
                            <Input
                                id="subtractionNumberCount"
                                type="number"
                                min={2}
                                value={settings.subtraction.numberCount}
                                onChange={(e) => handleSettingsChange({
                                    subtraction: { ...settings.subtraction, numberCount: parseInt(e.target.value) }
                                })}
                                className="mt-2 text-lg p-6"
                            />
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default Settings;
