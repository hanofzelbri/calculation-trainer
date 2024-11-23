import React from 'react';
import { Button } from './ui/button';
import { DigitInput } from './DigitInput';
import { DisplayNumber } from './DisplayNumber';
import { useAdditionCalculator } from '@/hooks/useAdditionCalculator';

export const AdditionCalculator: React.FC = () => {
    const {
        numbers,
        userAnswer,
        userCarries,
        isCorrect,
        digitCount,
        indices,
        handleDigitChange,
        handleSubmit,
        handleKeyDown,
        handleFocus,
        inputRefs
    } = useAdditionCalculator();

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
                <div className="font-mono text-4xl font-bold space-y-2">
                    {/* Numbers */}
                    {numbers.map((num, index) => (
                        <div className="flex justify-end" key={index}>
                            {index > 0 && <span className="mr-4">+</span>}
                            <DisplayNumber
                                key={index}
                                number={num}
                                digitCount={digitCount}
                            />
                        </div>
                    ))}

                    {/* Carry inputs */}
                    <div className="text-gray-500 h-8 flex justify-end">
                        <span className="mr-4">+</span>
                        {indices.map((i) => (
                            <DigitInput
                                key={`carry-${i}`}
                                ref={el => inputRefs.current[i] = el}
                                value={userCarries[i]}
                                onChange={(value) => handleDigitChange(i, value, true)}
                                onKeyDown={(e) => handleKeyDown(e, i, true)}
                                onFocus={handleFocus}
                                dataIndex={i}
                                dataType="carry"
                                isCarry
                            />
                        ))}
                    </div>

                    <div className="border-t-4 border-black pt-2" />

                    {/* Answer inputs */}
                    <div className="flex justify-end pt-2">
                        {indices.map((i) => (
                            <DigitInput
                                key={`answer-${i}`}
                                ref={el => inputRefs.current[i + digitCount] = el}
                                value={userAnswer[i]}
                                onChange={(value) => handleDigitChange(i, value)}
                                onKeyDown={(e) => handleKeyDown(e, i, false)}
                                onFocus={handleFocus}
                                dataIndex={i}
                                dataType="answer"
                                isCorrect={isCorrect}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full mt-4"
                disabled={userAnswer.some(digit => digit === '')}
            >
                Überprüfen
            </Button>
        </form>
    );
};
