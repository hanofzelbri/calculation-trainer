import React from 'react';

interface DisplayNumberProps {
    number: number;
    digitCount: number;
}

export const DisplayNumber: React.FC<DisplayNumberProps> = ({ number, digitCount }) => {
    return (
        <div className="flex items-center justify-end">
            <div>
                {Math.abs(number)
                    .toString()
                    .padStart(digitCount, ' ')
                    .split('')
                    .map((digit, idx) => (
                        <span key={idx} className="inline-block w-8 text-center">
                            {digit}
                        </span>
                    ))}
            </div>
        </div>
    );
};
