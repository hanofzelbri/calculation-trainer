import { Achievement } from '../types/achievements';

export const defaultAchievements: Achievement[] = [
    {
        id: 'streak_master',
        baseTitle: 'Serien-Meister',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Serien-Starter', description: 'Löse 5 Aufgaben hintereinander richtig', requirement: 5 },
            { level: 2, name: 'Serien-Amateur', description: 'Löse 10 Aufgaben hintereinander richtig', requirement: 10 },
            { level: 3, name: 'Serien-Profi', description: 'Löse 20 Aufgaben hintereinander richtig', requirement: 20 },
            { level: 4, name: 'Serien-Experte', description: 'Löse 35 Aufgaben hintereinander richtig', requirement: 35 },
            { level: 5, name: 'Serien-Meister', description: 'Löse 50 Aufgaben hintereinander richtig', requirement: 50 },
            { level: 6, name: 'Serien-Champion', description: 'Löse 75 Aufgaben hintereinander richtig', requirement: 75 },
            { level: 7, name: 'Serien-Elite', description: 'Löse 100 Aufgaben hintereinander richtig', requirement: 100 },
            { level: 8, name: 'Serien-Legende', description: 'Löse 150 Aufgaben hintereinander richtig', requirement: 150 },
            { level: 9, name: 'Serien-Unsterblich', description: 'Löse 200 Aufgaben hintereinander richtig', requirement: 200 },
            { level: 10, name: 'Serien-Gott', description: 'Löse 300 Aufgaben hintereinander richtig', requirement: 300 }
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
            { level: 1, name: 'Zahlen-Lehrling', description: 'Löse insgesamt 50 Aufgaben', requirement: 50 },
            { level: 2, name: 'Zahlen-Geselle', description: 'Löse insgesamt 200 Aufgaben', requirement: 200 },
            { level: 3, name: 'Zahlen-Künstler', description: 'Löse insgesamt 500 Aufgaben', requirement: 500 },
            { level: 4, name: 'Zahlen-Virtuose', description: 'Löse insgesamt 1.000 Aufgaben', requirement: 1000 },
            { level: 5, name: 'Zahlen-Meister', description: 'Löse insgesamt 2.500 Aufgaben', requirement: 2500 },
            { level: 6, name: 'Zahlen-Magier', description: 'Löse insgesamt 5.000 Aufgaben', requirement: 5000 },
            { level: 7, name: 'Zahlen-Erzmagier', description: 'Löse insgesamt 10.000 Aufgaben', requirement: 10000 },
            { level: 8, name: 'Zahlen-Archmagier', description: 'Löse insgesamt 25.000 Aufgaben', requirement: 25000 },
            { level: 9, name: 'Zahlen-Großmeister', description: 'Löse insgesamt 50.000 Aufgaben', requirement: 50000 },
            { level: 10, name: 'Zahlen-Erleuchtet', description: 'Löse insgesamt 100.000 Aufgaben', requirement: 100000 }
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
        id: 'math_explorer',
        baseTitle: 'Mathe-Entdecker',
        currentLevel: 0,
        maxLevel: 5,
        progress: 0,
        levels: [
            { level: 1, name: 'Neugieriger Rechner', description: 'Löse Aufgaben mit 2 verschiedenen Operatoren', requirement: 2 },
            { level: 2, name: 'Vielseitiger Denker', description: 'Löse Aufgaben mit 3 verschiedenen Operatoren', requirement: 3 },
            { level: 3, name: 'Mathe-Forscher', description: 'Löse Aufgaben mit 4 verschiedenen Operatoren', requirement: 4 },
            { level: 4, name: 'Mathe-Pionier', description: 'Löse Aufgaben mit allen verfügbaren Operatoren', requirement: 5 },
            { level: 5, name: 'Mathe-Universalist', description: 'Löse 50 Aufgaben mit jedem verfügbaren Operator', requirement: 50 }
        ]
    }
];
