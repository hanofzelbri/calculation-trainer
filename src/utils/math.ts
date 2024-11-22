export function getRandomNumber(maxDigits: number): number {
    return Math.floor(Math.random() * Math.pow(10, maxDigits));
}
