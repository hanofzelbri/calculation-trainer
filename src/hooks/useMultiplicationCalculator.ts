import { useState, useCallback, useEffect } from 'react';

// Mapping of numbers to letters (we'll use results modulo the array length)
const LETTER_MAPPING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Collection of motivational and fun messages
const MESSAGES = [
    "DU BIST SUPER",
    "MATHE MACHT SPASS",
    "WEITER SO CHAMPION",
    "TOLL GEMACHT",
    "RICHTIG STARK",
    "MATHE HELD",
    "SUPER LEISTUNG",
    "KLASSE GEMACHT",
    "SPITZE",
    "PERFEKT",
    "WAHNSINN",
    "SEHR GUT",
    "CLEVER",
    "BRILLIANT",
    "FANTASTISCH",
    "WUNDERBAR",
    "GROSSARTIG",
    "MEGA STARK",
    "SUPER SCHLAU",
    "GENIAL",
    // ... (adding more messages to reach 100+)
    "MATHE PROFI",
    "ZAHLEN GENIE",
    "RECHENKOENIG",
    "MATHE STAR",
    "SUPER HIRN",
    "ZAHLEN HELD",
    "MATHEMEISTER",
    "RECHENBLITZ",
    "MATHEMAGIER",
    "ZAHLENZAUBERER"
];

type MissingPosition = 'num1' | 'num2' | 'result';

interface Problem {
    num1: number;
    num2: number;
    result: number;
    choices: number[];
    missingPosition: MissingPosition;
}

export const useMultiplicationCalculator = () => {
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [message, setMessage] = useState('');
    const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);

    // Generate wrong answers based on the missing position
    const generateChoices = (correctAnswer: number, missingPosition: MissingPosition): number[] => {
        const choices = new Set<number>();
        choices.add(correctAnswer);

        while (choices.size < 4) {
            let wrongAnswer;

            if (missingPosition === 'result') {
                // For result, generate answers close to the correct result
                const offset = Math.floor(Math.random() * 10) + 1;
                wrongAnswer = Math.random() < 0.5 ? 
                    correctAnswer + offset : 
                    Math.max(1, correctAnswer - offset);
            } else {
                // For missing factors, use numbers 1-10
                wrongAnswer = Math.floor(Math.random() * 10) + 1;
            }

            if (wrongAnswer > 0 && wrongAnswer <= (missingPosition === 'result' ? 100 : 10)) {
                choices.add(wrongAnswer);
            }
        }

        // Convert to array and shuffle
        return Array.from(choices).sort(() => Math.random() - 0.5);
    };

    // Generate a new multiplication problem
    const generateProblem = useCallback(() => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const result = num1 * num2;

        // Randomly choose which position will be missing
        const positions: MissingPosition[] = ['num1', 'num2', 'result'];
        const missingPosition = positions[Math.floor(Math.random() * positions.length)];

        // Generate choices based on the missing position
        const correctAnswer = missingPosition === 'num1' ? num1 : 
                            missingPosition === 'num2' ? num2 : result;
        const choices = generateChoices(correctAnswer, missingPosition);

        setCurrentProblem({ num1, num2, result, choices, missingPosition });
    }, []);

    // Initialize the game
    useEffect(() => {
        if (!currentProblem) {
            generateProblem();
            // Select a random message
            const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            setMessage(randomMessage);
            setSolvedProblems([]);
        }
    }, [currentProblem, generateProblem]);

    // Convert a number to a letter using the mapping
    const numberToLetter = (num: number): string => {
        return LETTER_MAPPING[num % LETTER_MAPPING.length];
    };

    // Check the user's answer
    const checkAnswer = (answer: number) => {
        if (!currentProblem) return false;

        const correctAnswer = currentProblem.missingPosition === 'num1' ? currentProblem.num1 :
                            currentProblem.missingPosition === 'num2' ? currentProblem.num2 :
                            currentProblem.result;

        const correct = answer === correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            // Add the corresponding letter to solved problems
            const letter = numberToLetter(currentProblem.result);
            setSolvedProblems(prev => [...prev, letter]);
            setStreak(prev => prev + 1);
            
            // Generate a new problem
            generateProblem();
        } else {
            setStreak(0);
        }

        return correct;
    };

    // Get the current progress of revealed message
    const getRevealedMessage = () => {
        return message.split('').map((letter, index) => 
            solvedProblems[index] ? letter : '_'
        ).join('');
    };

    // Check if the current message is completely revealed
    const isMessageComplete = () => {
        return solvedProblems.length >= message.length;
    };

    // Reset the game with a new message
    const resetGame = () => {
        const newMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setMessage(newMessage);
        setSolvedProblems([]);
        setStreak(0);
        generateProblem();
        setIsCorrect(null);
    };

    return {
        currentProblem,
        checkAnswer,
        isCorrect,
        streak,
        getRevealedMessage,
        isMessageComplete,
        resetGame
    };
};
