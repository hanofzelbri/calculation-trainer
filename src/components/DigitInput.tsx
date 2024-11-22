import React from 'react';
import { Input } from './ui/input';

interface DigitInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    dataIndex: number;
    dataType: string;
    isCarry?: boolean;
    isCorrect?: boolean | null;
}

export const DigitInput = React.forwardRef<HTMLInputElement, DigitInputProps>(
    ({ value, onChange, onKeyDown, onFocus, dataIndex, dataType, isCarry, isCorrect }, ref) => {
        return (
            <Input
                ref={ref}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                className={`w-8 h-8 border border-gray-300 rounded text-center text-3xl leading-8 p-0 m-0 focus:outline-none focus:border-blue-500 ${
                    !isCarry && isCorrect !== undefined
                        ? isCorrect === true
                            ? 'border-bgreen-500'
                            : isCorrect === false
                            ? 'border-red-500'
                            : ''
                        : ''
                }`}
                data-index={dataIndex}
                data-type={dataType}
                style={{ textAlign: 'center', lineHeight: '2rem' }}
            />
        );
    }
);
