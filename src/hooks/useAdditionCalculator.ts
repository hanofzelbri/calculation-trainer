import React from 'react';
import { useSettingsStore } from '@/store/settings.store';

export const useAdditionCalculator = () => {
    const settings = useSettingsStore((state) => state.settings);
    const [numbers, setNumbers] = React.useState<number[]>([]);
    const [userAnswer, setUserAnswer] = React.useState<string[]>([]);
    const [userCarries, setUserCarries] = React.useState<string[]>([]);
    const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
    const [expectedCarries, setExpectedCarries] = React.useState<string[]>([]);
    const [digitCount, setDigitCount] = React.useState<number>(0);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Calculate the required number of digits including potential extra digit for sum
    const calculateDigitCount = (nums: number[]) => {
        const sum = nums.reduce((acc, num) => acc + num, 0);
        const maxInputLength = Math.max(...nums.map(n => Math.abs(n).toString().length));
        const sumLength = Math.abs(sum).toString().length;
        return Math.max(maxInputLength, sumLength);
    };

    const generateNumbers = React.useCallback(() => {
        const newNumbers: number[] = [];
        for (let i = 0; i < settings.addition.numberCount; i++) {
            const min = settings.addition.allowNegative ? -settings.addition.maxNumber : 0;
            const max = settings.addition.maxNumber;
            newNumbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        const newDigitCount = calculateDigitCount(newNumbers);
        setDigitCount(newDigitCount);
        setNumbers(newNumbers);
        setUserAnswer(Array(newDigitCount).fill(''));
        setUserCarries(Array(newDigitCount).fill(''));
        setIsCorrect(null);
        calculateExpectedCarries(newNumbers, newDigitCount);
        // Reset input refs array
        inputRefs.current = Array(newDigitCount * 2).fill(null);

        // Set focus to rightmost answer input after a short delay to ensure refs are set
        setTimeout(() => {
            const lastAnswerInput = inputRefs.current[newDigitCount * 2 - 1];
            lastAnswerInput?.focus();
        }, 0);
    }, [settings.addition]);

    const calculateExpectedCarries = (nums: number[], digits: number) => {
        const carries: string[] = Array(digits).fill('');
        let carry = 0;

        for (let i = 0; i < digits; i++) {
            const sum = nums.reduce((acc, num) => {
                const numStr = Math.abs(num).toString().padStart(digits, '0');
                return acc + parseInt(numStr[digits - 1 - i]);
            }, carry);

            if (sum >= 10) {
                carry = Math.floor(sum / 10);
                carries[digits - 2 - i] = carry.toString(); // Position carry one digit to the left
            } else {
                carry = 0;
            }
        }
        setExpectedCarries(carries);
    };

    React.useEffect(() => {
        generateNumbers();
    }, [generateNumbers]);

    const checkIfCarryNeeded = (index: number): boolean => {
        // Get the digits at the current position (from right to left)
        let sumAtPosition = 0;
        const digitPositions: { num: number, digit: number }[] = [];

        // Add up all digits at this position from each number
        for (const num of numbers) {
            const numStr = Math.abs(num).toString().padStart(digitCount, '0');
            // Since we input from right to left, index is already in the correct order
            const digitAtPosition = parseInt(numStr[index]);
            digitPositions.push({ num, digit: digitAtPosition });
            sumAtPosition += digitAtPosition;
        }

        // Add any previous carry if it exists
        const previousCarry = index > 0 ? parseInt(userCarries[index] || '0') : 0;
        sumAtPosition += previousCarry;

        // If sum at this position is >= 10, we need a carry
        return sumAtPosition >= 10;
    };

    const handleDigitChange = (index: number, value: string, isCarry: boolean = false) => {
        if (value === '' || /^[0-9]$/.test(value)) {
            if (isCarry) {
                const newCarries = [...userCarries];
                newCarries[index] = value;
                setUserCarries(newCarries);

                // After filling carry, move focus to the result input in the same column
                if (value !== '') {
                    const resultInput = inputRefs.current[index + digitCount];
                    resultInput?.focus();
                }
            } else {
                const newAnswer = [...userAnswer];
                newAnswer[index] = value;
                setUserAnswer(newAnswer);

                if (value !== '') {
                    // Check if a carry is needed for the current position
                    const needsCarry = checkIfCarryNeeded(index);
                    
                    if (needsCarry) {
                        // Move focus to the carry input one position to the left
                        const carryInput = inputRefs.current[index - 1];
                        carryInput?.focus();
                    } else if (index > 0) {
                        // If no carry needed and not at leftmost position, move to the next result position
                        const prevInput = inputRefs.current[index + digitCount - 1];
                        prevInput?.focus();
                    }
                }
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctAnswer = numbers.reduce((sum, num) => sum + num, 0);
        const correctAnswerStr = correctAnswer.toString().padStart(digitCount, '0');

        // Convert user answer to string for digit-by-digit comparison
        const userAnswerStr = userAnswer.join('');

        // Check if the answer matches digit by digit
        const isAnswerCorrect = userAnswerStr === correctAnswerStr &&
            userCarries.join('') === expectedCarries.join('');

        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            generateNumbers();
        }
    };

    // Create array of indices for rendering
    const indices = Array.from({ length: digitCount }, (_, i) => i);

    // Focus management
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        isCarry: boolean
    ) => {
        if (e.key === 'ArrowRight' || (e.key >= '0' && e.key <= '9')) {
            const nextIndex = index + 1;
            if (nextIndex < digitCount) {
                const nextRef = inputRefs.current[isCarry ? nextIndex : nextIndex + digitCount];
                nextRef?.focus();
                if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    handleDigitChange(index, e.key, isCarry);
                }
            }
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                const prevRef = inputRefs.current[isCarry ? prevIndex : prevIndex + digitCount];
                prevRef?.focus();
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const targetRef = inputRefs.current[isCarry ? index + digitCount : index];
            targetRef?.focus();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return {
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
    };
};
