import React from 'react';
import { useSettingsStore } from '@/store/settings.store';

export const useSubtractionCalculator = () => {
    const settings = useSettingsStore((state) => state.settings);
    const [numbers, setNumbers] = React.useState<number[]>([]);
    const [userAnswer, setUserAnswer] = React.useState<string[]>([]);
    const [userBorrows, setUserBorrows] = React.useState<string[]>([]);
    const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
    const [expectedBorrows, setExpectedBorrows] = React.useState<string[]>([]);
    const [digitCount, setDigitCount] = React.useState<number>(0);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Calculate the required number of digits
    const calculateDigitCount = (nums: number[]) => {
        const maxInputLength = Math.max(...nums.map(n => Math.abs(n).toString().length));
        return maxInputLength;
    };

    const generateNumbers = React.useCallback(() => {
        const newNumbers: number[] = [];
        // First number should be larger than the second for subtraction
        const max = settings.subtraction.maxNumber;
        const min = settings.subtraction.allowNegative ? -max : 0;
        
        // Generate first number
        const firstNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        newNumbers.push(firstNumber);
        
        // Generate second number (must be smaller than or equal to first number if negative results aren't allowed)
        const secondMax = settings.subtraction.allowNegative ? max : firstNumber;
        const secondMin = min;
        const secondNumber = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;
        newNumbers.push(secondNumber);

        const newDigitCount = calculateDigitCount(newNumbers);
        setDigitCount(newDigitCount);
        setNumbers(newNumbers);
        setUserAnswer(Array(newDigitCount).fill(''));
        setUserBorrows(Array(newDigitCount).fill(''));
        setIsCorrect(null);
        calculateExpectedBorrows(newNumbers, newDigitCount);
        
        // Reset input refs array
        inputRefs.current = Array(newDigitCount * 2).fill(null);

        // Set focus to rightmost answer input after a short delay
        setTimeout(() => {
            const lastAnswerInput = inputRefs.current[newDigitCount * 2 - 1];
            lastAnswerInput?.focus();
        }, 0);
    }, [settings.subtraction]);

    const calculateExpectedBorrows = (nums: number[], digits: number) => {
        const borrows: string[] = Array(digits).fill('');
        let borrow = 0;
        
        // Convert numbers to padded strings for digit-by-digit subtraction
        const num1Str = Math.abs(nums[0]).toString().padStart(digits, '0');
        const num2Str = Math.abs(nums[1]).toString().padStart(digits, '0');
        
        for (let i = digits - 1; i >= 0; i--) {
            let digit1 = parseInt(num1Str[i]) - borrow;
            const digit2 = parseInt(num2Str[i]);
            
            if (digit1 < digit2) {
                // Need to borrow from next column
                digit1 += 10;
                borrow = 1;
                if (i > 0) {
                    borrows[i - 1] = '1';
                }
            } else {
                borrow = 0;
            }
        }
        
        setExpectedBorrows(borrows);
    };

    React.useEffect(() => {
        generateNumbers();
    }, [generateNumbers]);

    const checkIfBorrowNeeded = (index: number): boolean => {
        const num1Str = Math.abs(numbers[0]).toString().padStart(digitCount, '0');
        const num2Str = Math.abs(numbers[1]).toString().padStart(digitCount, '0');
        
        let digit1 = parseInt(num1Str[index]);
        const digit2 = parseInt(num2Str[index]);
        
        // Consider previous borrows
        if (index > 0) {
            const previousBorrow = parseInt(userBorrows[index - 1] || '0');
            digit1 -= previousBorrow;
        }
        
        return digit1 < digit2;
    };

    const handleDigitChange = (index: number, value: string, isBorrow: boolean = false) => {
        if (value === '' || /^[0-9]$/.test(value)) {
            if (isBorrow) {
                const newBorrows = [...userBorrows];
                newBorrows[index] = value;
                setUserBorrows(newBorrows);

                // After filling borrow, move focus to the result input in the same column
                if (value !== '') {
                    const resultInput = inputRefs.current[index + digitCount];
                    resultInput?.focus();
                }
            } else {
                const newAnswer = [...userAnswer];
                newAnswer[index] = value;
                setUserAnswer(newAnswer);

                if (value !== '') {
                    // Check if a borrow is needed for the current position
                    const needsBorrow = checkIfBorrowNeeded(index);
                    
                    if (needsBorrow) {
                        // Move focus to the borrow input one position to the left
                        const borrowInput = inputRefs.current[index - 1];
                        borrowInput?.focus();
                    } else if (index > 0) {
                        // If no borrow needed and not at leftmost position, move to the next result position
                        const prevInput = inputRefs.current[index + digitCount - 1];
                        prevInput?.focus();
                    }
                }
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = numbers[0] - numbers[1];
        const resultStr = Math.abs(result).toString().padStart(digitCount, '0');

        // Convert user answer to string for digit-by-digit comparison
        const userAnswerStr = userAnswer.join('');

        // Check if the answer matches digit by digit
        const isAnswerCorrect = userAnswerStr === resultStr &&
            userBorrows.join('') === expectedBorrows.join('');

        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            generateNumbers();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        isBorrow: boolean
    ) => {
        if (e.key === 'ArrowRight' || (e.key >= '0' && e.key <= '9')) {
            const nextIndex = index + 1;
            if (nextIndex < digitCount) {
                const nextRef = inputRefs.current[isBorrow ? nextIndex : nextIndex + digitCount];
                nextRef?.focus();
                if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    handleDigitChange(index, e.key, isBorrow);
                }
            }
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                const prevRef = inputRefs.current[isBorrow ? prevIndex : prevIndex + digitCount];
                prevRef?.focus();
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const targetRef = inputRefs.current[isBorrow ? index + digitCount : index];
            targetRef?.focus();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const indices = Array.from({ length: digitCount }, (_, i) => i);

    return {
        numbers,
        userAnswer,
        userBorrows,
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
