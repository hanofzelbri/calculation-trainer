// Globale Variablen
let currentNumbers = [];
let correctAnswer = 0;
let maxDigits = 0;
let currentMode = 'practice';
let hearts = 3;
let score = 0;
let taskStartTime = null;
let pomodoroInterval = null;
let testInterval = null;
let testMode = false;
let testStarted = false;

// Timer-Funktionen
function startPomodoro() {
    let time = 25 * 60; // 25 Minuten
    updatePomodoroDisplay(time);
    
    pomodoroInterval = setInterval(() => {
        time--;
        updatePomodoroDisplay(time);
        
        if (time <= 0) {
            clearInterval(pomodoroInterval);
            alert('Pomodoro-Zeit ist um! Mache eine Pause.');
        }
    }, 1000);
}

function startTestTimer() {
    const duration = parseInt(document.getElementById('testDuration').value) * 60;
    let time = duration;
    updateTestDisplay(time);
    
    testInterval = setInterval(() => {
        time--;
        updateTestDisplay(time);
        
        if (time <= 0) {
            clearInterval(testInterval);
            endTest();
        }
    }, 1000);
}

function updatePomodoroDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById('pomodoroTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTestDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById('testTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Modus-Funktionen
function switchMode(mode) {
    currentMode = mode;
    testMode = (mode === 'test');
    testStarted = false;
    
    // UI-Elemente aktualisieren
    document.querySelector('.hearts').classList.toggle('hidden', !testMode);
    document.querySelector('.test-timer').classList.toggle('hidden', !testMode);
    document.querySelector('.test-settings').classList.toggle('hidden', !testMode);
    document.querySelector('.pomodoro').classList.toggle('hidden', testMode);
    document.querySelector('.task-container').classList.toggle('hidden', testMode && !testStarted);
    
    // Modi-Buttons aktualisieren
    document.getElementById('practiceMode').classList.toggle('active', !testMode);
    document.getElementById('testMode').classList.toggle('active', testMode);
    
    // Button Text ändern
    const actionButton = document.getElementById('newTask');
    actionButton.textContent = testMode ? 'Test starten' : 'Neue Aufgabe';
    
    // Timer zurücksetzen
    if (testMode) {
        hearts = 3;
        score = 0;
        updateHearts();
        updateScore();
        if (testInterval) clearInterval(testInterval);
    } else {
        if (testInterval) clearInterval(testInterval);
        if (pomodoroInterval) clearInterval(pomodoroInterval);
        startPomodoro();
        createNewTask();
    }
}

function updateHearts() {
    const heartIcons = document.querySelectorAll('.hearts i');
    heartIcons.forEach((icon, index) => {
        icon.classList.toggle('lost', index >= hearts);
    });
}

function updateScore() {
    document.getElementById('currentScore').textContent = score;
}

function endTest() {
    alert(`Test beendet! Dein Score: ${score}`);
    switchMode('practice');
}

// Aufgaben-Funktionen
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

function padNumber(num, length) {
    const numStr = String(num);
    return ' '.repeat(length - numStr.length) + numStr;
}

function addToHistory(numbers, answer, time) {
    const historyList = document.querySelector('.history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const task = numbers.join(' + ') + ' = ' + answer;
    const timeStr = `${Math.floor(time / 1000)} Sekunden`;
    
    historyItem.innerHTML = `
        <span>${task}</span>
        <span>${timeStr}</span>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Funktion zum Erstellen einer neuen Aufgabe
function createNewTask() {
    const maxNumber = parseInt(document.getElementById('maxNumber').value);
    const numberCount = parseInt(document.getElementById('numberCount').value);
    
    // Zahlen generieren
    currentNumbers = [];
    for (let i = 0; i < numberCount; i++) {
        currentNumbers.push(getRandomNumber(maxNumber));
    }
    
    // Korrekte Antwort berechnen
    correctAnswer = currentNumbers.reduce((sum, num) => sum + num, 0);
    
    // Maximale Anzahl der Stellen bestimmen
    maxDigits = Math.max(...currentNumbers.map(num => String(num).length), String(correctAnswer).length);
    
    // Zahlen anzeigen
    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = '';
    
    // Plus-Operator hinzufügen
    const operatorDiv = document.createElement('div');
    operatorDiv.className = 'operator';
    operatorDiv.textContent = '+';
    numbersDiv.appendChild(operatorDiv);
    
    // Zahlen mit Einzelziffern anzeigen
    currentNumbers.forEach((num, index) => {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'number';
        
        const paddedNum = padNumber(num, maxDigits);
        [...paddedNum].forEach((char, digitIndex) => {
            const digitDiv = document.createElement('div');
            digitDiv.className = 'digit';
            // Nur Ziffern anzeigen, keine Leerzeichen
            digitDiv.textContent = char === ' ' ? '' : char;
            // Leere Zellen trotzdem die gleiche Breite geben
            if (char === ' ') {
                digitDiv.style.visibility = 'hidden';
            }
            numberDiv.appendChild(digitDiv);
        });
        
        numbersDiv.appendChild(numberDiv);
        
        // Linie vor der letzten Zahl hinzufügen
        if (index === currentNumbers.length - 1) {
            const line = document.createElement('div');
            line.className = 'line';
            numbersDiv.appendChild(line);
        }
    });
    
    // Übertragsfelder erstellen
    const carriesDiv = document.getElementById('carries');
    carriesDiv.innerHTML = '';
    
    // Container für die Ausrichtung der Übertragsfelder
    const carriesContainer = document.createElement('div');
    carriesContainer.className = 'input-container';
    carriesDiv.appendChild(carriesContainer);
    
    // Übertragsfelder erstellen (von rechts nach links)
    for (let i = maxDigits - 1; i >= 0; i--) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'carry-input';
        input.dataset.position = i;
        input.addEventListener('input', handleCarryInput);
        input.addEventListener('keydown', handleInputKeydown);
        carriesContainer.appendChild(input);
    }
    
    // Antwortfelder erstellen
    const answerGrid = document.getElementById('answer-grid');
    answerGrid.innerHTML = '';
    
    // Container für die Ausrichtung der Antwortfelder
    const answerContainer = document.createElement('div');
    answerContainer.className = 'input-container';
    answerGrid.appendChild(answerContainer);
    
    // Antwortfelder erstellen (von rechts nach links)
    for (let i = maxDigits - 1; i >= 0; i--) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'answer-input';
        input.dataset.position = i;
        input.addEventListener('input', handleAnswerInput);
        input.addEventListener('keydown', handleInputKeydown);
        answerContainer.appendChild(input);
    }
    
    // Überprüfen-Button deaktivieren
    document.getElementById('checkAnswer').disabled = true;
    
    // Feedback zurücksetzen
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('feedback').textContent = '';
    
    taskStartTime = Date.now();
}

// Funktion zur Behandlung von Tastatureingaben
function handleInputKeydown(e) {
    if (e.key === 'Tab') {
        e.preventDefault(); // Standard Tab-Verhalten verhindern
        moveToNextField(e.target);
    }
}

// Funktion zum Bewegen des Fokus zum nächsten Feld
function moveToNextField(currentInput) {
    const currentPosition = parseInt(currentInput.dataset.position);
    const isCarryInput = currentInput.classList.contains('carry-input');
    const isAnswerInput = currentInput.classList.contains('answer-input');
    
    if (isAnswerInput) {
        // Von Result zu Carry eine Position weiter links
        const carryInputs = Array.from(document.querySelectorAll('.carry-input'));
        
        const targetPosition = currentPosition + 1;

        if (targetPosition < maxDigits) {
            const targetCarry = carryInputs.find(input => parseInt(input.dataset.position) === targetPosition);
            
            if (targetCarry) {
                targetCarry.focus();
            }
        }
    } else if (isCarryInput) {
        // Von Carry zu Result an gleicher Position
        const answerInputs = Array.from(document.querySelectorAll('.answer-input'));
        
        const targetAnswer = answerInputs.find(input => parseInt(input.dataset.position) === currentPosition);
        
        if (targetAnswer) {
            targetAnswer.focus();
        }
    }
}

// Funktion zur Behandlung der Antworteingabe
function handleAnswerInput(e) {
    if (e.target.value) {
        // Nur Zahlen erlauben
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
        
        if (value) {
            console.log('Moving to next field after answer input');
            moveToNextField(e.target);
        }
    }
    
    // Prüfen ob alle Felder ausgefüllt sind
    if (checkAllFieldsFilled()) {
        document.getElementById('checkAnswer').disabled = false;
    } else {
        document.getElementById('checkAnswer').disabled = true;
    }
}

// Funktion zur Behandlung der Übertragseingabe
function handleCarryInput(e) {
    if (e.target.value) {
        // Nur Zahlen erlauben
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
        
        if (value) {
            moveToNextField(e.target);
        }
    }
}

// Funktion zum Prüfen, ob alle Antwortfelder ausgefüllt sind
function checkAllFieldsFilled() {
    const answerInputs = document.querySelectorAll('.answer-input');
    const allFilled = Array.from(answerInputs).every(input => input.value !== '');
    return allFilled;
}

// Funktion zum Überprüfen der Antwort
function checkAnswer() {
    const answerInputs = document.querySelectorAll('.answer-input');
    const userAnswer = Array.from(answerInputs)
        .map(input => input.value)
        .join('');
    
    const timeTaken = Date.now() - taskStartTime;
    
    if (parseInt(userAnswer) === correctAnswer) {
        document.getElementById('feedback').textContent = '🎉 Super! Das ist richtig!';
        document.getElementById('feedback').className = 'feedback correct';
        
        if (testMode) {
            score++;
            updateScore();
        }
        
        // Zur Historie hinzufügen
        addToHistory(currentNumbers, correctAnswer, timeTaken);
        
        // Neue Aufgabe nach kurzer Verzögerung
        setTimeout(createNewTask, 1000);
    } else {
        document.getElementById('feedback').textContent = '😕 Das stimmt leider nicht. Versuch es noch einmal!';
        document.getElementById('feedback').className = 'feedback incorrect';
        
        if (testMode) {
            hearts--;
            updateHearts();
            if (hearts === 0) {
                endTest();
            }
        }
    }
}

// Event-Handler für den Button
function handleActionButton() {
    if (testMode && !testStarted) {
        // Test starten
        testStarted = true;
        document.querySelector('.task-container').classList.remove('hidden');
        document.querySelector('.test-settings').classList.add('hidden');
        startTestTimer();
    }
    
    createNewTask();
    
    // Sicherstellen, dass der Fokus auf dem ersten (rechtesten) Antwortfeld liegt
    setTimeout(() => {
        const answerInputs = document.querySelectorAll('.answer-input');
        if (answerInputs.length > 0) {
            answerInputs[0].focus();
        }
    }, 0);
}

// Event Listener
document.getElementById('newTask').addEventListener('click', handleActionButton);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);
document.getElementById('startPomodoro').addEventListener('click', startPomodoro);
document.getElementById('practiceMode').addEventListener('click', () => switchMode('practice'));
document.getElementById('testMode').addEventListener('click', () => switchMode('test'));

// Erste Aufgabe beim Laden der Seite erstellen
document.addEventListener('DOMContentLoaded', () => {
    switchMode('practice');
});

document.getElementById('calculate').addEventListener('click', function() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const result = num1 + num2;
    document.getElementById('result').innerText = `Ergebnis: ${result}`;
});
