import React from 'react';

interface DisplayNumberProps {
    number: number;
    digitCount: number;
    isLast: boolean;
}

export const DisplayNumber: React.FC<DisplayNumberProps> = ({ number, digitCount, isLast }) => {
    return (
        <div className="flex items-center justify-end">
            {isLast && (
                <div className="border-b-4 border-black pb-2">
                    <span className="mr-4">+</span>
                </div>
            )}
            <div className={isLast ? "border-b-4 border-black pb-2" : ""}>
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
