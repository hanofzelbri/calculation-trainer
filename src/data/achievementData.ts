import { Achievement } from '../types/achievements';

export const defaultAchievements: Achievement[] = [
    {
        id: 'streak_master',
        baseTitle: 'Serien-Meister',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Serien-Starter', description: 'Löse 2 Aufgaben hintereinander richtig', requirement: 2 },
            { level: 2, name: 'Serien-Amateur', description: 'Löse 3 Aufgaben hintereinander richtig', requirement: 3 },
            { level: 3, name: 'Serien-Profi', description: 'Löse 5 Aufgaben hintereinander richtig', requirement: 5 },
            { level: 4, name: 'Serien-Experte', description: 'Löse 7 Aufgaben hintereinander richtig', requirement: 7 },
            { level: 5, name: 'Serien-Meister', description: 'Löse 10 Aufgaben hintereinander richtig', requirement: 10 },
            { level: 6, name: 'Serien-Champion', description: 'Löse 15 Aufgaben hintereinander richtig', requirement: 15 },
            { level: 7, name: 'Serien-Elite', description: 'Löse 20 Aufgaben hintereinander richtig', requirement: 20 },
            { level: 8, name: 'Serien-Legende', description: 'Löse 30 Aufgaben hintereinander richtig', requirement: 30 },
            { level: 9, name: 'Serien-Unsterblich', description: 'Löse 40 Aufgaben hintereinander richtig', requirement: 40 },
            { level: 10, name: 'Serien-Gott', description: 'Löse 50 Aufgaben hintereinander richtig', requirement: 50 }
        ]
    },
    {
        id: 'daily_warrior',
        baseTitle: 'Täglicher Krieger',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Täglicher Besucher', description: 'Trainiere an 3 aufeinanderfolgenden Tagen', requirement: 3 },
            { level: 2, name: 'Regelmäßiger Gast', description: 'Trainiere an 7 aufeinanderfolgenden Tagen', requirement: 7 },
            { level: 3, name: 'Treuer Schüler', description: 'Trainiere an 14 aufeinanderfolgenden Tagen', requirement: 14 },
            { level: 4, name: 'Beständiger Kämpfer', description: 'Trainiere an 30 aufeinanderfolgenden Tagen', requirement: 30 },
            { level: 5, name: 'Ausdauernder Meister', description: 'Trainiere an 60 aufeinanderfolgenden Tagen', requirement: 60 },
            { level: 6, name: 'Unermüdlicher Champion', description: 'Trainiere an 90 aufeinanderfolgenden Tagen', requirement: 90 },
            { level: 7, name: 'Eiserner Wille', description: 'Trainiere an 120 aufeinanderfolgenden Tagen', requirement: 120 },
            { level: 8, name: 'Legendäre Konstanz', description: 'Trainiere an 180 aufeinanderfolgenden Tagen', requirement: 180 },
            { level: 9, name: 'Ewiger Kämpfer', description: 'Trainiere an 270 aufeinanderfolgenden Tagen', requirement: 270 },
            { level: 10, name: 'Zeitloser Meister', description: 'Trainiere an 365 aufeinanderfolgenden Tagen', requirement: 365 }
        ]
    },
    {
        id: 'number_wizard',
        baseTitle: 'Zahlen-Zauberer',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Zahlen-Lehrling', description: 'Löse insgesamt 25 Aufgaben', requirement: 25 },
            { level: 2, name: 'Zahlen-Geselle', description: 'Löse insgesamt 100 Aufgaben', requirement: 100 },
            { level: 3, name: 'Zahlen-Künstler', description: 'Löse insgesamt 250 Aufgaben', requirement: 250 },
            { level: 4, name: 'Zahlen-Virtuose', description: 'Löse insgesamt 500 Aufgaben', requirement: 500 },
            { level: 5, name: 'Zahlen-Meister', description: 'Löse insgesamt 1.000 Aufgaben', requirement: 1000 },
            { level: 6, name: 'Zahlen-Magier', description: 'Löse insgesamt 2.000 Aufgaben', requirement: 2000 },
            { level: 7, name: 'Zahlen-Erzmagier', description: 'Löse insgesamt 3.500 Aufgaben', requirement: 3500 },
            { level: 8, name: 'Zahlen-Archmagier', description: 'Löse insgesamt 5.000 Aufgaben', requirement: 5000 },
            { level: 9, name: 'Zahlen-Großmeister', description: 'Löse insgesamt 7.500 Aufgaben', requirement: 7500 },
            { level: 10, name: 'Zahlen-Erleuchtet', description: 'Löse insgesamt 10.000 Aufgaben', requirement: 10000 }
        ]
    },
    {
        id: 'time_bender',
        baseTitle: 'Zeit-Beherrscher',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Zeit-Entdecker', description: 'Löse eine Aufgabe in unter 15 Sekunden', requirement: 1 },
            { level: 2, name: 'Zeit-Manipulator', description: 'Löse 5 Aufgaben in unter 15 Sekunden', requirement: 5 },
            { level: 3, name: 'Zeit-Bezwinger', description: 'Löse 15 Aufgaben in unter 15 Sekunden', requirement: 15 },
            { level: 4, name: 'Zeit-Virtuose', description: 'Löse 30 Aufgaben in unter 15 Sekunden', requirement: 30 },
            { level: 5, name: 'Zeit-Meister', description: 'Löse 50 Aufgaben in unter 15 Sekunden', requirement: 50 },
            { level: 6, name: 'Zeit-Herrscher', description: 'Löse 75 Aufgaben in unter 15 Sekunden', requirement: 75 },
            { level: 7, name: 'Zeit-Beherrscher', description: 'Löse 100 Aufgaben in unter 15 Sekunden', requirement: 100 },
            { level: 8, name: 'Zeit-Bezähmer', description: 'Löse 150 Aufgaben in unter 15 Sekunden', requirement: 150 },
            { level: 9, name: 'Zeit-Souverän', description: 'Löse 200 Aufgaben in unter 15 Sekunden', requirement: 200 },
            { level: 10, name: 'Zeit-Transzendent', description: 'Löse 300 Aufgaben in unter 15 Sekunden', requirement: 300 }
        ]
    },
    {
        id: 'addition_master',
        baseTitle: 'Additions-Meister',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Additions-Neuling', description: 'Löse 10 Additions-Aufgaben', requirement: 10 },
            { level: 2, name: 'Additions-Anfänger', description: 'Löse 25 Additions-Aufgaben', requirement: 25 },
            { level: 3, name: 'Additions-Lehrling', description: 'Löse 50 Additions-Aufgaben', requirement: 50 },
            { level: 4, name: 'Additions-Schüler', description: 'Löse 100 Additions-Aufgaben', requirement: 100 },
            { level: 5, name: 'Additions-Kenner', description: 'Löse 200 Additions-Aufgaben', requirement: 200 },
            { level: 6, name: 'Additions-Profi', description: 'Löse 350 Additions-Aufgaben', requirement: 350 },
            { level: 7, name: 'Additions-Experte', description: 'Löse 500 Additions-Aufgaben', requirement: 500 },
            { level: 8, name: 'Additions-Meister', description: 'Löse 750 Additions-Aufgaben', requirement: 750 },
            { level: 9, name: 'Additions-Großmeister', description: 'Löse 1000 Additions-Aufgaben', requirement: 1000 },
            { level: 10, name: 'Additions-Legende', description: 'Löse 1500 Additions-Aufgaben', requirement: 1500 }
        ]
    },
    {
        id: 'subtraction_master',
        baseTitle: 'Subtraktions-Meister',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Subtraktions-Neuling', description: 'Löse 10 Subtraktions-Aufgaben', requirement: 10 },
            { level: 2, name: 'Subtraktions-Anfänger', description: 'Löse 25 Subtraktions-Aufgaben', requirement: 25 },
            { level: 3, name: 'Subtraktions-Lehrling', description: 'Löse 50 Subtraktions-Aufgaben', requirement: 50 },
            { level: 4, name: 'Subtraktions-Schüler', description: 'Löse 100 Subtraktions-Aufgaben', requirement: 100 },
            { level: 5, name: 'Subtraktions-Kenner', description: 'Löse 200 Subtraktions-Aufgaben', requirement: 200 },
            { level: 6, name: 'Subtraktions-Profi', description: 'Löse 350 Subtraktions-Aufgaben', requirement: 350 },
            { level: 7, name: 'Subtraktions-Experte', description: 'Löse 500 Subtraktions-Aufgaben', requirement: 500 },
            { level: 8, name: 'Subtraktions-Meister', description: 'Löse 750 Subtraktions-Aufgaben', requirement: 750 },
            { level: 9, name: 'Subtraktions-Großmeister', description: 'Löse 1000 Subtraktions-Aufgaben', requirement: 1000 },
            { level: 10, name: 'Subtraktions-Legende', description: 'Löse 1500 Subtraktions-Aufgaben', requirement: 1500 }
        ]
    }
];
