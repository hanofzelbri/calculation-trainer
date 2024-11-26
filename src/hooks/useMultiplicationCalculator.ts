import { useState, useCallback, useEffect } from 'react';

// Collection of motivational messages
const MESSAGES = [
    // German messages
    "DU BIST SUPER",
    "WEITER SO CHAMPION",
    "DAS WAR SPITZE",
    "TOLL GEMACHT",
    "RICHTIG STARK",
    "MATHE MACHT SPASS",
    "DU BIST EIN HELD",
    "KLASSE LEISTUNG",
    "EINFACH PERFEKT",
    "DU SCHAFFST DAS",
    "MEGA COOL",
    "SEHR GUT GEMACHT",
    "DU BIST SCHLAU",
    "STARK GERECHNET",
    "SUPER ERGEBNIS",
    "WEITER SO PROFI",
    "ECHT KLASSE",
    "DU BIST GENIAL",
    "PRIMA ARBEIT",
    "TOP LEISTUNG",
    "BLEIB AM BALL",
    "DU BIST AUF KURS",
    "WAHNSINN WIE GUT",
    "MATHE IST DEIN DING",
    "SUPER FORTSCHRITTE",
    "DU WIRST IMMER BESSER",
    "RICHTIG TOLL GEMACHT",
    "WEITER SO SUPERSTAR",
    "DAS KLAPPT JA SUPER",
    "MATHE MACHT DIR SPASS",
    "DU BIST EIN MATHE ASS",
    "TOLL WIE DU DAS MACHST",
    "SUPER KONZENTRIERT",
    "DAS IST DER WEG",
    "RICHTIG GUT GERECHNET",
    "DU BIST AUF EINER WELLE",
    "MATHE IST DEINE STAERKE",
    "DAS MACHT RICHTIG SPASS",
    "EINFACH NUR SPITZE",
    "DU BIST EIN MATHEGENIE",
    // English messages
    "YOU ARE AMAZING",
    "KEEP IT UP CHAMPION",
    "WELL DONE FRIEND",
    "BRILLIANT WORK",
    "SUPER SMART",
    "MATH IS FUN",
    "YOU ARE A STAR",
    "AWESOME JOB",
    "SIMPLY PERFECT",
    "YOU CAN DO THIS",
    "REALLY COOL",
    "GREAT PROGRESS",
    "YOU ARE BRILLIANT",
    "MATH GENIUS",
    "EXCELLENT WORK",
    "KEEP GOING PRO",
    "TOTALLY AWESOME",
    "YOU ARE INCREDIBLE",
    "FANTASTIC JOB",
    "TOP PERFORMANCE"
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
    const [currentMessage, setCurrentMessage] = useState('');
    const [solvedLetters, setSolvedLetters] = useState<boolean[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [isMessageComplete, setIsMessageComplete] = useState(false);
    const [nextLetterIndex, setNextLetterIndex] = useState(0);

    const generateProblem = useCallback(() => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const result = num1 * num2;

        const positions: MissingPosition[] = ['num1', 'num2', 'result'];
        const missingPosition = positions[Math.floor(Math.random() * positions.length)];

        let correctAnswer: number;
        if (missingPosition === 'num1') correctAnswer = num1;
        else if (missingPosition === 'num2') correctAnswer = num2;
        else correctAnswer = result;

        // Generate wrong answers
        const wrongAnswers = new Set<number>();
        while (wrongAnswers.size < 3) {
            let wrongAnswer: number;
            if (missingPosition === 'result') {
                // For result, use other possible multiplication results
                const possibleResults = [];
                for (let i = 1; i <= 10; i++) {
                    for (let j = 1; j <= 10; j++) {
                        if (i * j !== result) possibleResults.push(i * j);
                    }
                }
                wrongAnswer = possibleResults[Math.floor(Math.random() * possibleResults.length)];
            } else {
                // For num1 or num2, use numbers 1-10
                wrongAnswer = Math.floor(Math.random() * 10) + 1;
            }
            if (wrongAnswer !== correctAnswer) {
                wrongAnswers.add(wrongAnswer);
            }
        }

        // Create and shuffle choices
        const choices = [...wrongAnswers, correctAnswer];
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        return {
            num1,
            num2,
            result,
            missingPosition,
            choices
        };
    }, []);

    const startNewMessage = useCallback(() => {
        const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setCurrentMessage(message);
        setSolvedLetters(new Array(message.length).fill(false));
        setIsMessageComplete(false);
        setStreak(0);
        setNextLetterIndex(0);
        setCurrentProblem(generateProblem());
    }, [generateProblem]);

    useEffect(() => {
        startNewMessage();
    }, [startNewMessage]);

    const findNextUnrevealedLetterIndex = (currentIndex: number, solvedLetters: boolean[]) => {
        let index = currentIndex;
        while (index < solvedLetters.length) {
            if (!solvedLetters[index] && currentMessage[index] !== ' ') {
                return index;
            }
            index++;
        }
        return -1; // No more letters to reveal
    };

    const checkAnswer = useCallback((answer: number) => {
        if (!currentProblem) return;

        const isAnswerCorrect = (
            (currentProblem.missingPosition === 'num1' && answer === currentProblem.num1) ||
            (currentProblem.missingPosition === 'num2' && answer === currentProblem.num2) ||
            (currentProblem.missingPosition === 'result' && answer === currentProblem.result)
        );

        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            setStreak(prev => prev + 1);
            
            // Reveal next unrevealed letter
            const nextIndex = findNextUnrevealedLetterIndex(nextLetterIndex, solvedLetters);
            
            if (nextIndex !== -1) {
                const newSolvedLetters = [...solvedLetters];
                newSolvedLetters[nextIndex] = true;
                setSolvedLetters(newSolvedLetters);
                setNextLetterIndex(nextIndex + 1);
                
                // Check if all letters are revealed
                const remainingLetters = findNextUnrevealedLetterIndex(nextIndex + 1, newSolvedLetters);
                if (remainingLetters === -1) {
                    setIsMessageComplete(true);
                } else {
                    setCurrentProblem(generateProblem());
                }
            }
        } else {
            setStreak(0);
        }
    }, [currentProblem, generateProblem, nextLetterIndex, solvedLetters, currentMessage]);

    const getRevealedMessage = useCallback(() => {
        return currentMessage.split('').map((letter, index) => ({
            letter,
            revealed: solvedLetters[index],
            isSpace: letter === ' '
        }));
    }, [currentMessage, solvedLetters]);

    return {
        currentProblem,
        checkAnswer,
        isCorrect,
        streak,
        getRevealedMessage,
        isMessageComplete,
        startNewMessage
    };
};
