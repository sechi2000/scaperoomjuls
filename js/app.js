/* app.js - Lógica Protocolo 25 */
(() => {
    const screen = document.getElementById('screen');
    const beep = document.getElementById('beep');
    const successSound = document.getElementById('successSound');
    const errorSound = document.getElementById('errorSound');

    /* util: appending a line */
    function appendLine(text, className) {
        const el = document.createElement('div');
        el.className = 'terminal-line' + (className ? ' ' + className : '');
        el.textContent = text;
        screen.appendChild(el);
        screen.scrollTop = screen.scrollHeight;
        return el;
    }

    /* print with delay (simple) */
    function printLine(text, delay = 800) {
        return new Promise(resolve => {
            setTimeout(() => {
                appendLine(text);
                try { beep.currentTime = 0; beep.play(); } catch (e) { }
                resolve();
            }, delay);
        });
    }

    /* typewriter for a line (optional, nicer feel) */
    function typeLine(text, speed = 18) {
        return new Promise(resolve => {
            const el = document.createElement('div');
            el.className = 'terminal-line';
            screen.appendChild(el);
            screen.scrollTop = screen.scrollHeight;
            let i = 0;
            function step() {
                if (i <= text.length) {
                    el.textContent = text.slice(0, i) + (i % 2 ? '_' : '');
                    i++;
                    try { beep.currentTime = 0; } catch (e) { }
                    setTimeout(step, speed);
                } else {
                    el.textContent = text;
                    resolve();
                }
            }
            step();
        });
    }

    async function start() {
        await printLine('PROTOCOLO_25 // ACCESO RESTRINGIDO', 400);
        await printLine('Introduce el código de autorización para acceder al sistema:\n', 700);

        // input UI
        const inputLine = document.createElement('div');
        inputLine.className = 'terminal-line';
        inputLine.innerHTML = 'Código: <input id="codeInput" class="terminal" type="text" maxlength="8" autofocus /><span class="blink"> </span>';
        screen.appendChild(inputLine);
        const codeInput = document.getElementById('codeInput');
        codeInput.focus();

        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                validateCode(codeInput.value.trim());
            }
        });
    }

    function showResultMessage(text, ok = true) {
        const cls = ok ? 'success' : 'error';
        appendLine(text, cls);
        try {
            if (ok) { successSound.currentTime = 0; successSound.play(); }
            else { errorSound.currentTime = 0; errorSound.play(); }
        } catch (e) { }
    }

    function validateCode(code) {
        if (code === '27122000') {
            showResultMessage('Acceso concedido. Bienvenida, Agente Juls.', true);
            // small visual glitch: add class to a heading maybe
            setTimeout(() => { showMission(); }, 900);
        } else {
            showResultMessage('Error de autenticación. Movimiento no autorizado detectado.', false);
        }
    }

    async function showMission() {
        // clear screen elegantly
        await new Promise(r => setTimeout(r, 300));
        screen.innerHTML = '';

        const missionText = [
            'Bienvenida, agente.',
            'Tu misión ha sido activada.',
            'Objetivo: Restaurar el archivo perdido del PROTOCOLO_25.',
            'Ubicación: Madrid, Zona Ponzano.',
            'Hora: 20:00 horas.',
            'Nivel de prioridad: MÁXIMO.',
            'Inicia la secuencia cuando estés lista...'
        ];

        for (let i = 0; i < missionText.length; i++) {
            await typeLine(missionText[i], 20);
            await new Promise(r => setTimeout(r, 300));
        }

        setTimeout(showPuzzleIntro, 700);
    }

    function showPuzzleIntro() {
        const p = document.createElement('div');
        p.className = 'puzzle-line';
        p.textContent = '\nArchivo encriptado detectado.\nPara restaurar el sistema, responde correctamente:';
        screen.appendChild(p);

        // question
        const q = document.createElement('div');
        q.className = 'terminal-line';
        q.textContent = '¿Qué palabra oculta representa el movimiento constante de la misión? (pista: lugar del evento)';
        screen.appendChild(q);

        // input
        const container = document.createElement('div');
        container.className = 'terminal-line';
        container.innerHTML = 'Respuesta: <input id="puzzleInput" class="terminal" type="text" maxlength="20" autofocus /> <span class="blink"></span>';
        screen.appendChild(container);

        const pi = document.getElementById('puzzleInput');
        pi.focus();
        pi.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkPuzzle(pi.value.trim());
        });
    }

    function checkPuzzle(answer) {
        if (!answer) return;
        if (answer.toLowerCase() === 'vaivén' || answer.toLowerCase() === 'vaiven') {
            showResultMessage('Correcto. Archivo restaurado. Misión completada.', true);
            // visual flourish: add glitch banner and final screen
            setTimeout(finalSequence, 1200);
        } else {
            showResultMessage('Respuesta incorrecta. El sistema permanece bloqueado.', false);
        }
    }

    /* final cinematic */
    function finalSequence() {
        // small glitch effect: append styled heading
        const banner = document.createElement('div');
        banner.className = 'terminal-line glitch';
        banner.setAttribute('data-text', 'ARCHIVO RESTAURADO — PROTOCOLO 25');
        banner.textContent = 'ARCHIVO RESTAURADO — PROTOCOLO 25';
        screen.appendChild(banner);
        try { successSound.currentTime = 0; successSound.play(); } catch (e) { }
        setTimeout(() => {
            appendLine('Iniciando transferencia final...', 'note');
        }, 500);

        setTimeout(() => {
            appendLine('ARCHIVO: J2000 — RESTAURACIÓN COMPLETA', 'success');
        }, 1600);

        // finish: "Fin de transmisión" fade
        setTimeout(() => {
            appendLine('\nFin de la transmisión.', 'note');
            // optional: fade out screen
            setTimeout(() => {
                // subtle fade (CSS not needed; inline)
                screen.style.transition = 'opacity 1s ease';
                screen.style.opacity = '0.02';
            }, 2600);
        }, 2600);
    }

    // start
    start();

})();
