/* ============================================================
   BIRTHDAY SURPRISE — script.js
   Nikhil's Birthday Website by Gopika ❤️
   ============================================================ */

// ─── SCREEN ORDER ───────────────────────────────────────────
const SCREENS = [
    'screen-intro',
    'screen-story',
    'screen-unlock',
    'screen-yesno',
    'screen-puzzle',
    'screen-slideshow',
    'screen-final'
];
let currentScreenIndex = 0;

// ─── AUDIO HELPERS ──────────────────────────────────────────
function playSound(id) {
    const a = document.getElementById(id);
    if (a) { a.currentTime = 0; a.play().catch(() => {}); }
}

function toggleMusic() {
    const bgm = document.getElementById('bgm');
    const icon = document.getElementById('musicIcon');
    const status = document.getElementById('musicStatus');
    if (bgm.paused) {
        bgm.play();
        icon.textContent = '🎵';
        status.textContent = 'Music';
    } else {
        bgm.pause();
        icon.textContent = '🔇';
        status.textContent = 'Paused';
    }
}

// ─── NAVIGATION ─────────────────────────────────────────────
function goToScreen(screenId) {
    const current = document.querySelector('.screen.active');
    if (current) {
        current.classList.remove('active');
        current.style.pointerEvents = 'none';
    }
    const next = document.getElementById(screenId);
    if (!next) return;
    next.classList.add('active');

    const idx = SCREENS.indexOf(screenId);
    if (idx !== -1) {
        currentScreenIndex = idx;
        updateDots(idx);
    }

    // Stop slideshow music if leaving slideshow
    if (screenId !== 'screen-slideshow') {
        const slideMus = document.getElementById('slideshowMusic');
        if (slideMus) { slideMus.pause(); slideMus.currentTime = 0; }
        const bgm = document.getElementById('bgm');
        if (bgm && bgm.paused) bgm.play().catch(() => {});
    }

    // Screen-specific init
    if (screenId === 'screen-story')      initStory();
    if (screenId === 'screen-unlock')     initUnlock();
    if (screenId === 'screen-yesno')      initYesNo();
    if (screenId === 'screen-puzzle')     initPuzzle();
    if (screenId === 'screen-slideshow')  initSlideshow();
    if (screenId === 'screen-final')      initFinal();
}

function updateDots(idx) {
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
    });
}

// ─── SCREEN 1: INTRO ────────────────────────────────────────
function startSurprise() {
    playSound('clickSound');
    const bgm = document.getElementById('bgm');
    bgm.volume = 0.35;
    bgm.play().then(() => {
        document.getElementById('musicToggle').classList.remove('hidden');
    }).catch(() => {});

    document.getElementById('progress-dots').classList.remove('hidden');
    goToScreen('screen-story');
}

// ─── SCREEN 2: STORY ────────────────────────────────────────
function initStory() {
    const para = document.getElementById('story-1');
    const nextBtn = document.getElementById('story-next-btn');

    if (para) para.classList.remove('visible');
    nextBtn.classList.remove('visible');
    nextBtn.style.display = 'none';

    setTimeout(() => {
        if (para) para.classList.add('visible');
    }, 400);

    setTimeout(() => {
        nextBtn.style.display = 'inline-block';
        setTimeout(() => nextBtn.classList.add('visible'), 60);
    }, 1200);
}

// ─── SCREEN 3: UNLOCK ───────────────────────────────────────
const UNLOCK_ANSWER = 'i lubbuu pappu';
const WRONG_MSGS = [
    "Ayyoo wrong aanu 😏",
    "Sherikkum ariyilla alle? 😂",
    "Hint venoo? 😌",
    "Correct type cheyyu baby 😘",
    "Almost… but not enough love 😜",
    "Kidilam try! Pakshe wrong 🙈",
];
const PARTIAL_MSGS = [
    "Close aanu 😍",
    "Kurachu koodi baki und 😏",
    "Almost there… 🥺",
];

let unlockDone = false;

function initUnlock() {
    unlockDone = false;
    const input = document.getElementById('unlockInput');
    input.value = '';
    document.getElementById('unlockFeedback').textContent = '';
    document.getElementById('inputProgressFill').style.width = '0%';
    document.getElementById('lockIcon').classList.remove('unlocked');
    input.focus();
}

function checkUnlockInput() {
    if (unlockDone) return;
    const val = document.getElementById('unlockInput').value.toLowerCase().trim();
    const fill = document.getElementById('inputProgressFill');

    // Progress bar
    
    const progress = Math.min(100, Math.round((val.length / UNLOCK_ANSWER.length) * 100));
    fill.style.width = progress + '%';

    // Check partial
    if (UNLOCK_ANSWER.startsWith(val) && val.length > 4) {
        fill.style.background = 'linear-gradient(90deg, #ff9a44, #ff6b6b)';
    } else {
        fill.style.background = '';
    }
}

function submitUnlock() {
    if (unlockDone) return;
    playSound('clickSound');
    const val = document.getElementById('unlockInput').value.toLowerCase().trim();
    const feedback = document.getElementById('unlockFeedback');

    if (val === UNLOCK_ANSWER) {
        unlockDone = true;
        feedback.textContent = 'Aww 😭💖 I love you more!';
        feedback.style.color = '#ff758f';
        document.getElementById('lockIcon').classList.add('unlocked');
        document.getElementById('lockIcon').textContent = '🔓';
        playSound('successSound');

        // Heart burst
        const burst = document.getElementById('heartBurst');
        burst.classList.remove('hidden');
        burst.innerHTML = '💖 💕 💖 💕 💖';
        setTimeout(() => burst.classList.add('hidden'), 1100);

        setTimeout(() => goToScreen('screen-yesno'), 1800);
    } else if (UNLOCK_ANSWER.startsWith(val) && val.length > 6) {
        feedback.textContent = PARTIAL_MSGS[Math.floor(Math.random() * PARTIAL_MSGS.length)];
        feedback.style.color = '#ffd166';
    } else {
        feedback.textContent = WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)];
        feedback.style.color = '#ff758f';
    }
}

// Allow Enter key
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('unlockInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitUnlock();
        });
    }
});

// ─── SCREEN 4: YES/NO ───────────────────────────────────────
const NO_MSGS = ["Ayyoo! Ithalla 😏", "Correct answer ariyam enikk 😌", "Try again baby 😘", "Nee ithu click cheyyanda! 😂", "Enikk ariyam nee YES parayanam ennu 😌"];
let noBtnCooldown = false;

function initYesNo() {
    const noBtn   = document.getElementById('noBtn');
    const feedback = document.getElementById('yesnoFeedback');
    feedback.textContent = '';
    noBtnCooldown = false;

    // Place NO button inside the card, beside YES
    setTimeout(() => {
        const yesRect = document.getElementById('yesBtn').getBoundingClientRect();
        noBtn.style.left    = (yesRect.right + 16) + 'px';
        noBtn.style.top     = yesRect.top + 'px';
        noBtn.style.display = 'block';
    }, 50);

    noBtn.onclick = (e) => { e.preventDefault(); teleportNo(); };
    noBtn.ontouchstart = (e) => { e.preventDefault(); teleportNo(); };

    setTimeout(() => {
        function onMouseMove(e) {
            if (!document.getElementById('screen-yesno').classList.contains('active')) {
                document.removeEventListener('mousemove', onMouseMove);
                noBtn.style.display = 'none';
                return;
            }
            const rect = noBtn.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            if (Math.hypot(e.clientX - cx, e.clientY - cy) < 80) teleportNo();
        }
        document.addEventListener('mousemove', onMouseMove);
    }, 400);
}

function teleportNo() {
    if (noBtnCooldown) return;
    noBtnCooldown = true;
    setTimeout(() => { noBtnCooldown = false; }, 350);

    const noBtn   = document.getElementById('noBtn');
    const feedback = document.getElementById('yesnoFeedback');
    playSound('clickSound');
    feedback.textContent = NO_MSGS[Math.floor(Math.random() * NO_MSGS.length)];

    // Constrain movement strictly inside the card
    const card  = document.querySelector('#screen-yesno .card');
    const cRect = card.getBoundingClientRect();
    const btnW  = 130;
    const btnH  = 48;
    const pad   = 12;

    const minX = cRect.left   + pad;
    const maxX = cRect.right  - btnW - pad;
    const minY = cRect.top    + pad;
    const maxY = cRect.bottom - btnH - pad;

    noBtn.style.left    = (minX + Math.random() * Math.max(0, maxX - minX)) + 'px';
    noBtn.style.top     = (minY + Math.random() * Math.max(0, maxY - minY)) + 'px';
    noBtn.style.display = 'block';
}

function answerYes() {
    playSound('successSound');
    const feedback = document.getElementById('yesnoFeedback');
    feedback.textContent = "I knew it 😍 Love you sooo much!";
    document.getElementById('yesBtn').disabled = true;
    document.getElementById('noBtn').style.display = 'none';
    spawnHeartBurst(8);
    setTimeout(() => goToScreen('screen-puzzle'), 1800);
}

// ─── SCREEN 5: PUZZLE ───────────────────────────────────────
// Replace this URL with your own photo URL or local file like "puzzle.jpg"
const PUZZLE_IMG = 'images/img4.jpeg';
let draggedPiece = null;
let selectedPiece = null;
let moveCount = 0;

function initPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    moveCount = 0;
    selectedPiece = null;
    document.getElementById('puzzle-moves').textContent = 'Moves: 0';
    document.getElementById('puzzle-success-msg').textContent = '';
    document.getElementById('puzzle-success-msg').classList.remove('visible');
    const nextBtn = document.getElementById('next-to-slideshow');
    nextBtn.style.display = 'none';
    nextBtn.classList.remove('visible');

    const order = [0,1,2,3,4,5,6,7,8].sort(() => Math.random() - 0.5);

    // Determine board size based on screen width
    const isMobile = window.innerWidth <= 500;
    const boardSize = isMobile ? 240 : 270;
    const pieceSize = boardSize / 3;

    order.forEach((val) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;
        piece.dataset.val = val;

        const row = Math.floor(val / 3);
        const col = val % 3;
        piece.style.backgroundImage = `url(${PUZZLE_IMG})`;
        piece.style.backgroundSize  = `${boardSize}px ${boardSize}px`;
        piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

        // Mouse Drag and Drop
        piece.addEventListener('dragstart', (e) => { draggedPiece = piece; piece.style.opacity = '0.5'; });
        piece.addEventListener('dragend',   ()  => { piece.style.opacity = '1'; });
        piece.addEventListener('dragover',  (e) => { e.preventDefault(); piece.classList.add('drag-over'); });
        piece.addEventListener('dragleave', ()  => { piece.classList.remove('drag-over'); });
        piece.addEventListener('drop',      (e) => {
            e.preventDefault();
            piece.classList.remove('drag-over');
            if (draggedPiece && draggedPiece !== piece) {
                swapPieces(draggedPiece, piece);
            }
        });

        // Click / Tap to swap
        piece.addEventListener('click', () => {
            if (!selectedPiece) {
                selectedPiece = piece;
                piece.classList.add('drag-over');
            } else if (selectedPiece === piece) {
                selectedPiece.classList.remove('drag-over');
                selectedPiece = null;
            } else {
                selectedPiece.classList.remove('drag-over');
                swapPieces(selectedPiece, piece);
                selectedPiece = null;
            }
        });

        board.appendChild(piece);
    });
}

function swapPieces(p1, p2) {
    const tmpVal = p1.dataset.val;
    const tmpBg  = p1.style.backgroundPosition;
    p1.dataset.val              = p2.dataset.val;
    p1.style.backgroundPosition = p2.style.backgroundPosition;
    p2.dataset.val              = tmpVal;
    p2.style.backgroundPosition = tmpBg;
    
    moveCount++;
    document.getElementById('puzzle-moves').textContent = `Moves: ${moveCount}`;
    playSound('clickSound');
    checkPuzzle();
}

function checkPuzzle() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let won = true;
    pieces.forEach((p, i) => { if (parseInt(p.dataset.val) !== i) won = false; });
    if (won) {
        playSound('successSound');
        const msg = document.getElementById('puzzle-success-msg');
        msg.textContent = 'Yayy! You did it baby! Enikk ariyam nee smart aanu 😘';
        msg.classList.add('visible');
        pieces.forEach(p => p.draggable = false);
        const btn = document.getElementById('next-to-slideshow');
        btn.style.display = 'inline-block';
        setTimeout(() => btn.classList.add('visible'), 60);
        spawnHeartBurst(6);
    }
}

// ─── SCREEN 6: SLIDESHOW ────────────────────────────────────
let slideIndex  = 0;
let slideTimer  = null;
const CAPTIONS  = [
    'Every second with you is special… 💕',
    'You make every day brighter ☀️',
    'Missing you is my hobby 🥺',
    'Together forever, my love ❤️',
];

function initSlideshow() {
    clearInterval(slideTimer);
    const slides = document.querySelectorAll('.slide');
    slides.forEach(s => s.classList.remove('active-slide'));
    slideIndex = 0;
    slides[0].classList.add('active-slide');

    // Build dots
    const dotsEl = document.getElementById('slideDots');
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'slide-dot' + (i === 0 ? ' active' : '');
        d.onclick = () => jumpSlide(i);
        dotsEl.appendChild(d);
    });

    const nextBtn = document.getElementById('next-to-final');
    nextBtn.style.display = 'none';
    nextBtn.classList.remove('visible');

    // Pause background music and play love.mp3
    const bgm = document.getElementById('bgm');
    if (bgm) bgm.pause();
    const slideMus = document.getElementById('slideshowMusic');
    if (slideMus) {
        slideMus.currentTime = 0;
        slideMus.volume = 0.7;
        slideMus.play().catch(() => {});
    }

    slideTimer = setInterval(() => advanceSlide(slides), 4000);
}

function advanceSlide(slides) {
    slides[slideIndex].classList.remove('active-slide');
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = slides.length - 1;
        clearInterval(slideTimer);
        // Stop slideshow music when slideshow ends and resume background music
        const slideMus = document.getElementById('slideshowMusic');
        if (slideMus) { slideMus.pause(); slideMus.currentTime = 0; }
        const bgm = document.getElementById('bgm');
        if (bgm && bgm.paused) bgm.play().catch(() => {});
        const btn = document.getElementById('next-to-final');
        btn.style.display = 'inline-block';
        setTimeout(() => btn.classList.add('visible'), 60);
        return;
    }
    slides[slideIndex].classList.add('active-slide');
    document.querySelectorAll('.slide-dot').forEach((d, i) => d.classList.toggle('active', i === slideIndex));
}

function jumpSlide(idx) {
    const slides = document.querySelectorAll('.slide');
    slides[slideIndex].classList.remove('active-slide');
    slideIndex = idx;
    slides[slideIndex].classList.add('active-slide');
    document.querySelectorAll('.slide-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// ─── SCREEN 7: FINAL ────────────────────────────────────────
function initFinal() {
    shootConfetti();
    playSound('successSound');
    const lines = document.querySelectorAll('.letter-line');
    lines.forEach(l => l.classList.remove('visible'));
    let d = 500;
    lines.forEach(l => {
        setTimeout(() => l.classList.add('visible'), d);
        d += 700;
    });
}

function replayCelebration() {
    playSound('successSound');
    shootConfetti();
    spawnHeartBurst(12);
}

// ─── HEARTS BACKGROUND ──────────────────────────────────────
const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💓', '🌹', '✨'];

function spawnHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    heart.style.left     = (Math.random() * 98) + 'vw';
    heart.style.fontSize = (Math.random() * 16 + 10) + 'px';
    const dur = (Math.random() * 4 + 5);
    heart.style.animationDuration = dur + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000 + 200);
}

function spawnHeartBurst(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(spawnHeart, i * 120);
    }
}

// ─── CONFETTI ───────────────────────────────────────────────
let confettiRunning = false;
const CONF_COLORS = ['#ff4d6d','#ff758f','#ffd6e0','#fff','#c9184a','#ff9a44','#ffe0b2'];

function shootConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 140 }, () => ({
        x:    Math.random() * canvas.width,
        y:    Math.random() * -canvas.height,
        r:    Math.random() * 7 + 3,
        dx:   Math.random() * 4 - 2,
        dy:   Math.random() * 3 + 2,
        rot:  Math.random() * 360,
        drot: Math.random() * 6 - 3,
        color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));

    let frame = 0;
    const MAX_FRAMES = 260;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, 1 - frame / MAX_FRAMES);
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
            }
            ctx.restore();
            p.y   += p.dy;
            p.x   += p.dx;
            p.rot += p.drot;
            if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        });
        frame++;
        if (frame < MAX_FRAMES) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
}

// ─── INIT ───────────────────────────────────────────────────
window.addEventListener('load', () => {
    // Spawn hearts continuously
    setInterval(spawnHeart, 700);

    // Button click sounds
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('btn-yes') && !btn.classList.contains('btn-no')) {
                playSound('clickSound');
            }
        });
    });
});

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});
