import React from 'react';
import { Operation } from '@/types/common';
import { AdditionCalculator } from './AdditionCalculator';
import { SubtractionCalculator } from './SubtractionCalculator';
import { MultiplicationCalculator } from './MultiplicationCalculator';
import { DivisionCalculator } from './DivisionCalculator';

export const Calculator: React.FC = () => {
    const [currentOperation, setCurrentOperation] = React.useState<Operation>(Operation.Addition);

    const renderCalculator = () => {
        switch (currentOperation) {
            case Operation.Addition:
                return <AdditionCalculator />;
            case Operation.Subtraction:
                return <SubtractionCalculator />;
            case Operation.Multiplication:
                return <MultiplicationCalculator />;
            case Operation.Division:
                return <DivisionCalculator />;
            default:
                return <AdditionCalculator />;
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6">
            <div className="mb-4 flex gap-2 justify-center">
                {Object.values(Operation).map((op) => (
                    <button
                        key={op}
                        onClick={() => setCurrentOperation(op)}
                        className={`px-4 py-2 rounded ${currentOperation === op ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {op}
                    </button>
                ))}
            </div>
            {renderCalculator()}
        </div>
    );
};
