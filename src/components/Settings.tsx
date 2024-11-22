import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Settings: React.FC = () => {
    const {
        settings,
        currentMode,
        setSettings,
    } = useGameStore();

    const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
        setSettings(newSettings);
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
                <Label className="text-lg">Rechenoperationen</Label>
                <div className="flex flex-col space-y-6">
                    <div className="space-y-4">
                        <label className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                checked={settings.addition.enabled}
                                onChange={(e) => handleSettingsChange({
                                    addition: { ...settings.addition, enabled: e.target.checked }
                                })}
                                className="w-6 h-6"
                            />
                            <span className="text-lg">Addition (+)</span>
                        </label>
                        {settings.addition.enabled && (
                            <div className="ml-6 space-y-6">
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
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                checked={settings.subtraction.enabled}
                                onChange={(e) => handleSettingsChange({
                                    subtraction: { ...settings.subtraction, enabled: e.target.checked }
                                })}
                                className="w-6 h-6"
                            />
                            <span className="text-lg">Subtraktion (-)</span>
                        </label>
                        {settings.subtraction.enabled && (
                            <div className="ml-6 space-y-6">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <Label htmlFor="testDuration" className="text-lg">Testdauer (Minuten)</Label>
                <Input
                    id="testDuration"
                    type="number"
                    value={settings.testDuration}
                    onChange={(e) => handleSettingsChange({ testDuration: parseInt(e.target.value) })}
                    className="mt-2 text-lg p-6"
                />
            </div>
        </div>
    );
};

export default Settings;