import React from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const Settings: React.FC = () => {
    const {
        settings,
        setSettings,
    } = useCalculatorStore();

    const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
        setSettings({ ...settings, ...newSettings });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Addition Settings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Addition</CardTitle>
                        <Checkbox
                            id="addition-enabled"
                            checked={settings.addition.enabled}
                            onCheckedChange={(checked) =>
                                handleSettingsChange({
                                    addition: { ...settings.addition, enabled: checked === true }
                                })
                            }
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="addition-max-number">Maximale Zahl</Label>
                            <Input
                                id="addition-max-number"
                                type="number"
                                value={settings.addition.maxNumber}
                                onChange={(e) =>
                                    handleSettingsChange({
                                        addition: { ...settings.addition, maxNumber: parseInt(e.target.value) }
                                    })
                                }
                                min={1}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="addition-number-count">Anzahl der Zahlen</Label>
                            <Input
                                id="addition-number-count"
                                type="number"
                                value={settings.addition.numberCount}
                                onChange={(e) =>
                                    handleSettingsChange({
                                        addition: { ...settings.addition, numberCount: parseInt(e.target.value) }
                                    })
                                }
                                min={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Subtraction Settings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subtraktion</CardTitle>
                        <Checkbox
                            id="subtraction-enabled"
                            checked={settings.subtraction.enabled}
                            onCheckedChange={(checked) =>
                                handleSettingsChange({
                                    subtraction: { ...settings.subtraction, enabled: checked === true }
                                })
                            }
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subtraction-max-number">Maximale Zahl</Label>
                            <Input
                                id="subtraction-max-number"
                                type="number"
                                value={settings.subtraction.maxNumber}
                                onChange={(e) =>
                                    handleSettingsChange({
                                        subtraction: { ...settings.subtraction, maxNumber: parseInt(e.target.value) }
                                    })
                                }
                                min={1}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtraction-number-count">Anzahl der Zahlen</Label>
                            <Input
                                id="subtraction-number-count"
                                type="number"
                                value={settings.subtraction.numberCount}
                                onChange={(e) =>
                                    handleSettingsChange({
                                        subtraction: { ...settings.subtraction, numberCount: parseInt(e.target.value) }
                                    })
                                }
                                min={2}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="subtraction-allow-negative"
                                checked={settings.subtraction.allowNegative}
                                onCheckedChange={(checked) =>
                                    handleSettingsChange({
                                        subtraction: { ...settings.subtraction, allowNegative: checked === true }
                                    })
                                }
                            />
                            <Label
                                htmlFor="subtraction-allow-negative"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Negative Zahlen erlauben
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Multiplication Settings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Multiplikation</CardTitle>
                        <Checkbox
                            id="multiplication-enabled"
                            checked={settings.multiplication.enabled}
                            onCheckedChange={(checked) =>
                                handleSettingsChange({
                                    multiplication: { ...settings.multiplication, enabled: checked === true }
                                })
                            }
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="multiplication-max-number">Maximale erste Zahl</Label>
                            <Input
                                id="multiplication-max-number"
                                type="number"
                                value={settings.multiplication.maxNumber}
                                onChange={(e) =>
                                    handleSettingsChange({
                                        multiplication: { ...settings.multiplication, maxNumber: parseInt(e.target.value) }
                                    })
                                }
                                min={1}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="multiplication-max-multiplier">Maximale zweite Zahl (1-9)</Label>
                            <Input
                                id="multiplication-max-multiplier"
                                type="number"
                                value={settings.multiplication.maxMultiplier}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    const clampedValue = Math.min(Math.max(value, 1), 9);
                                    handleSettingsChange({
                                        multiplication: { ...settings.multiplication, maxMultiplier: clampedValue }
                                    });
                                }}
                                min={1}
                                max={9}
                            />
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default Settings;
