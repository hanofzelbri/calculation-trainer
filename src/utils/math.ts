export function getRandomNumber(maxDigits: number, min: number = 1): number {
    const minValue = Math.max(min, Math.pow(10, maxDigits - 1));
    const maxValue = Math.pow(10, maxDigits) - 1;
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

export function getRandomNumberForAddition(maxDigits: number, firstNumber: number | null = null): number {
    if (firstNumber === null) {
        // Generiere die erste Zahl
        return getRandomNumber(maxDigits);
    } else {
        // Generiere die zweite Zahl so, dass die Summe maximal eine Stelle mehr hat
        const maxSum = Math.pow(10, maxDigits + 1) - 1;
        const maxSecondNumber = maxSum - firstNumber;
        const maxAllowed = Math.min(Math.pow(10, maxDigits) - 1, maxSecondNumber);
        return Math.floor(Math.random() * (maxAllowed - 1 + 1)) + 1;
    }
}
