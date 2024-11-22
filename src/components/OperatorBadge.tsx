import React from 'react';
import { Badge } from './ui/badge';
import { Operation } from '@/types/common';

interface OperatorBadgeProps {
    operator: Operation;
}

export const OperatorBadge: React.FC<OperatorBadgeProps> = ({ operator }) => {
    const colorMap = {
        [Operation.Addition]: 'bg-blue-100 text-blue-800',
        [Operation.Subtraction]: 'bg-purple-100 text-purple-800',
        [Operation.Multiplication]: 'bg-green-100 text-green-800',
        [Operation.Division]: 'bg-orange-100 text-orange-800',
    };

    return (
        <Badge className={`${colorMap[operator]} border-none`}>
            {operator}
        </Badge>
    );
};
