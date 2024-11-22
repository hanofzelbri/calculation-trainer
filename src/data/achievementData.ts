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
        id: 'total_tasks',
        baseTitle: 'Aufgaben-Meister',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Aufgaben-Starter', description: 'Löse insgesamt 50 Aufgaben', requirement: 50 },
            { level: 2, name: 'Aufgaben-Amateur', description: 'Löse insgesamt 100 Aufgaben', requirement: 100 },
            { level: 3, name: 'Aufgaben-Profi', description: 'Löse insgesamt 250 Aufgaben', requirement: 250 },
            { level: 4, name: 'Aufgaben-Experte', description: 'Löse insgesamt 500 Aufgaben', requirement: 500 },
            { level: 5, name: 'Aufgaben-Meister', description: 'Löse insgesamt 1000 Aufgaben', requirement: 1000 },
            { level: 6, name: 'Aufgaben-Champion', description: 'Löse insgesamt 2000 Aufgaben', requirement: 2000 },
            { level: 7, name: 'Aufgaben-Elite', description: 'Löse insgesamt 3500 Aufgaben', requirement: 3500 },
            { level: 8, name: 'Aufgaben-Legende', description: 'Löse insgesamt 5000 Aufgaben', requirement: 5000 },
            { level: 9, name: 'Aufgaben-Unsterblich', description: 'Löse insgesamt 7500 Aufgaben', requirement: 7500 },
            { level: 10, name: 'Aufgaben-Gott', description: 'Löse insgesamt 10000 Aufgaben', requirement: 10000 }
        ]
    },
    {
        id: 'accuracy_master',
        baseTitle: 'Genauigkeits-Meister',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Genauigkeits-Starter', description: 'Erreiche 60% Genauigkeit', requirement: 60 },
            { level: 2, name: 'Genauigkeits-Amateur', description: 'Erreiche 70% Genauigkeit', requirement: 70 },
            { level: 3, name: 'Genauigkeits-Profi', description: 'Erreiche 75% Genauigkeit', requirement: 75 },
            { level: 4, name: 'Genauigkeits-Experte', description: 'Erreiche 80% Genauigkeit', requirement: 80 },
            { level: 5, name: 'Genauigkeits-Meister', description: 'Erreiche 85% Genauigkeit', requirement: 85 },
            { level: 6, name: 'Genauigkeits-Champion', description: 'Erreiche 90% Genauigkeit', requirement: 90 },
            { level: 7, name: 'Genauigkeits-Elite', description: 'Erreiche 93% Genauigkeit', requirement: 93 },
            { level: 8, name: 'Genauigkeits-Legende', description: 'Erreiche 95% Genauigkeit', requirement: 95 },
            { level: 9, name: 'Genauigkeits-Unsterblich', description: 'Erreiche 97% Genauigkeit', requirement: 97 },
            { level: 10, name: 'Genauigkeits-Gott', description: 'Erreiche 99% Genauigkeit', requirement: 99 }
        ]
    },
    {
        id: 'speed_demon',
        baseTitle: 'Geschwindigkeits-Dämon',
        currentLevel: 0,
        maxLevel: 10,
        progress: 0,
        levels: [
            { level: 1, name: 'Geschwindigkeits-Starter', description: 'Löse eine Aufgabe in unter 5 Sekunden', requirement: 1 },
            { level: 2, name: 'Geschwindigkeits-Amateur', description: 'Löse 3 Aufgaben in unter 5 Sekunden', requirement: 3 },
            { level: 3, name: 'Geschwindigkeits-Profi', description: 'Löse 5 Aufgaben in unter 5 Sekunden', requirement: 5 },
            { level: 4, name: 'Geschwindigkeits-Experte', description: 'Löse 10 Aufgaben in unter 5 Sekunden', requirement: 10 },
            { level: 5, name: 'Geschwindigkeits-Meister', description: 'Löse 15 Aufgaben in unter 5 Sekunden', requirement: 15 },
            { level: 6, name: 'Geschwindigkeits-Champion', description: 'Löse 20 Aufgaben in unter 5 Sekunden', requirement: 20 },
            { level: 7, name: 'Geschwindigkeits-Elite', description: 'Löse 25 Aufgaben in unter 5 Sekunden', requirement: 25 },
            { level: 8, name: 'Geschwindigkeits-Legende', description: 'Löse 30 Aufgaben in unter 5 Sekunden', requirement: 30 },
            { level: 9, name: 'Geschwindigkeits-Unsterblich', description: 'Löse 35 Aufgaben in unter 5 Sekunden', requirement: 35 },
            { level: 10, name: 'Geschwindigkeits-Gott', description: 'Löse 40 Aufgaben in unter 5 Sekunden', requirement: 40 }
        ]
    }
];
