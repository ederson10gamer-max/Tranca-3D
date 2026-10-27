// Configuração da Combinação Secreta
const SECRET_COMBINATION = "1980";

// Estado atual dos 4 rotores [Rotor0, Rotor1, Rotor2, Rotor3]
let currentCombination = 0;

// Controlo de rotação da câmara de visualização 3D
let isDragging = false;
let hasDragged = false; // CORREÇÃO: Diferenciar clique de arrastamento
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: -15, y: -30 };

const lockElement = document.getElementById('lock');
const sceneElement = document.getElementById('scene');
const statusElement = document.getElementById('status');
const rotorElements = document.querySelectorAll('.rotor-track');

// --- SISTEMA DE ROTAÇÃO DA CÂMARA (MOUSE DRAG) ---
sceneElement.addEventListener('mousedown', (e) => {
    // Só inicia o arrastamento se clicar na cena ou corpo do cadeado, não nos rotores diretamente
    if (e.target.classList.contains('rotor-face') || e.target.classList.contains('rotor-track')) {
        return; 
    }
    isDragging = true;
    hasDragged = false;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    let deltaX = e.clientX - previousMousePosition.x;
    let deltaY = e.clientY - previousMousePosition.y;

    // Se mover mais de 5 píxeis, cancela o clique do rotor
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDragged = true;
    }

    rotation.y += deltaX * 0.5;
    rotation.x -= deltaY * 0.5;
    
    rotation.x = Math.max(-60, Math.min(60, rotation.x));

    lockElement.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// --- SUPORTE PARA ECRÃS TÁTEIS (MOBILE) ---
sceneElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 0) return;
    if (e.target.classList.contains('rotor-face') || e.target.classList.contains('rotor-track')) {
        return; 
    }
    isDragging = true;
    hasDragged = false;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length === 0) return;
    
    let deltaX = e.touches[0].clientX - previousMousePosition.x;
    let deltaY = e.touches[0].clientY - previousMousePosition.y;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDragged = true;
    }

    rotation.y += deltaX * 0.5;
    rotation.x -= deltaY * 0.5;
    rotation.x = Math.max(-60, Math.min(60, rotation.x));
    
    lockElement.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

window.addEventListener('touchend', () => {
    isDragging = false;
});

// --- LÓGICA DE CONTROLO DOS ROTORES ---
function rotateRotor(rotorIndex) {
    // CORREÇÃO: Se o utilizador estava a arrastar a câmara, não roda o rotor
    if (hasDragged) return; 

    currentCombination[rotorIndex] = (currentCombination[rotorIndex] + 1) % 10;
    
    let angle = currentCombination[rotorIndex] * 36;
    
    if (rotorElements[rotorIndex]) {
        rotorElements[rotorIndex].style.transform = `rotateX(${-angle}deg)`;
    }
    
    checkCombination();
}

// Validação da senha
function checkCombination() {
    const isMatch = currentCombination.every((val, index) => val === parseInt(SECRET_COMBINATION[index]));
    
    if (!statusElement) return;
    
    if (isMatch) {
        lockElement.classList.add('unlocked');
        statusElement.textContent = "🔓 COMBINAÇÃO CORRETA!";
        statusElement.classList.add('unlocked');
    } else {
        lockElement.classList.remove('unlocked');
        statusElement.textContent = "🔒 BLOQUEADO";
        statusElement.classList.remove('unlocked');
    }
}
