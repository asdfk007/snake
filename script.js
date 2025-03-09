// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// 游戏难度设置
const DIFFICULTY = {
    EASY: 'easy',    // 慢速
    MEDIUM: 'medium', // 中速
    HARD: 'hard'     // 快速
};

const SPEED_BY_DIFFICULTY = {
    [DIFFICULTY.EASY]: 150,    // 每150毫秒更新一次
    [DIFFICULTY.MEDIUM]: 120,  // 每120毫秒更新一次
    [DIFFICULTY.HARD]: 100     // 每100毫秒更新一次（原始速度）
};

let currentDifficulty = DIFFICULTY.HARD; // 默认难度为快速

// 本地化文本
const LANGUAGES = {
    ZH: 'zh',
    EN: 'en',
    RU: 'ru',
    FR: 'fr',
    DE: 'de',
    ES: 'es',
    JA: 'ja'
};

let currentLanguage = LANGUAGES.ZH; // 默认语言为中文

// 多语言文本
const i18n = {
    [LANGUAGES.ZH]: {
        game_title: "贪吃蛇游戏",
        score: "分数: ",
        high_score: "最高分: ",
        control_instruction: "使用方向键或WASD键控制蛇的移动",
        gamepad_support: "也支持游戏手柄控制！",
        mobile_instruction: "在手机上，您可以使用虚拟方向键或滑动屏幕来控制",
        select_difficulty: "选择难度:",
        difficulty_easy: "慢速",
        difficulty_medium: "中速",
        difficulty_hard: "快速",
        start_game: "开始游戏",
        game_paused: "游戏已暂停",
        continue_game: "继续游戏",
        restart_game: "重新开始",
        menu_instruction: "使用↑↓方向键选择，回车或START确认",
        ready_continue: "准备继续",
        game_over: "游戏结束!",
        your_score: "你的分数: ",
        controls_title: "操作说明:",
        key_instruction: "↑ ↓ ← → 方向键或WASD键: 控制蛇的移动",
        gamepad_instruction: "游戏手柄: 方向键或左摇杆控制移动，START键暂停",
        space_instruction: "空格键: 暂停/继续",
        touch_instruction: "触摸控制: 使用屏幕下方的虚拟按钮或滑动",
        pause_game: "暂停",
        language_select: "选择语言",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    },
    [LANGUAGES.EN]: {
        game_title: "Snake Game",
        score: "Score: ",
        high_score: "High Score: ",
        control_instruction: "Use arrow keys or WASD to control the snake",
        gamepad_support: "Gamepad supported!",
        mobile_instruction: "On mobile, use virtual controls or swipe to move",
        select_difficulty: "Select Difficulty:",
        difficulty_easy: "Easy",
        difficulty_medium: "Medium",
        difficulty_hard: "Hard",
        start_game: "Start Game",
        game_paused: "Game Paused",
        continue_game: "Continue",
        restart_game: "Restart",
        menu_instruction: "Use ↑↓ to select, Enter or START to confirm",
        ready_continue: "Ready to Continue",
        game_over: "Game Over!",
        your_score: "Your Score: ",
        controls_title: "Controls:",
        key_instruction: "↑ ↓ ← → or WASD: Move snake",
        gamepad_instruction: "Gamepad: D-pad or left stick to move, START to pause",
        space_instruction: "Space: Pause/Continue",
        touch_instruction: "Touch Control: Use virtual buttons or swipe",
        pause_game: "Pause",
        language_select: "Select Language",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    },
    [LANGUAGES.RU]: {
        game_title: "Змейка",
        score: "Счет: ",
        high_score: "Рекорд: ",
        control_instruction: "Используйте стрелки или WASD для управления змейкой",
        gamepad_support: "Поддержка геймпада!",
        mobile_instruction: "На мобильном используйте виртуальные кнопки или свайпы",
        select_difficulty: "Выберите сложность:",
        difficulty_easy: "Легкий",
        difficulty_medium: "Средний",
        difficulty_hard: "Сложный",
        start_game: "Начать игру",
        game_paused: "Пауза",
        continue_game: "Продолжить",
        restart_game: "Начать заново",
        menu_instruction: "Используйте ↑↓ для выбора, Enter или START для подтверждения",
        ready_continue: "Готов продолжить",
        game_over: "Игра окончена!",
        your_score: "Ваш счет: ",
        controls_title: "Управление:",
        key_instruction: "↑ ↓ ← → или WASD: Управление змейкой",
        gamepad_instruction: "Геймпад: D-pad или стик для движения, START для паузы",
        space_instruction: "Пробел: Пауза/Продолжить",
        touch_instruction: "Сенсор: Используйте виртуальные кнопки или свайпы",
        pause_game: "Пауза",
        language_select: "Выберите язык",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    },
    [LANGUAGES.FR]: {
        game_title: "Jeu du Serpent",
        score: "Score: ",
        high_score: "Meilleur Score: ",
        control_instruction: "Utilisez les flèches ou WASD pour contrôler le serpent",
        gamepad_support: "Manette supportée!",
        mobile_instruction: "Sur mobile, utilisez les contrôles virtuels ou glissez",
        select_difficulty: "Sélectionnez la difficulté:",
        difficulty_easy: "Facile",
        difficulty_medium: "Moyen",
        difficulty_hard: "Difficile",
        start_game: "Commencer",
        game_paused: "Jeu en Pause",
        continue_game: "Continuer",
        restart_game: "Recommencer",
        menu_instruction: "Utilisez ↑↓ pour sélectionner, Entrée ou START pour confirmer",
        ready_continue: "Prêt à continuer",
        game_over: "Partie Terminée!",
        your_score: "Votre score: ",
        controls_title: "Contrôles:",
        key_instruction: "↑ ↓ ← → ou WASD: Déplacer le serpent",
        gamepad_instruction: "Manette: D-pad ou stick pour bouger, START pour pause",
        space_instruction: "Espace: Pause/Continuer",
        touch_instruction: "Tactile: Utilisez les boutons virtuels ou glissez",
        pause_game: "Pause",
        language_select: "Choisir la langue",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    },
    [LANGUAGES.DE]: {
        game_title: "Schlangen-Spiel",
        score: "Punktzahl: ",
        high_score: "Höchstpunktzahl: ",
        control_instruction: "Benutze Pfeiltasten oder WASD zur Steuerung",
        gamepad_support: "Gamepad unterstützt!",
        mobile_instruction: "Auf Mobilgeräten, nutze virtuelle Steuerung oder Wischen",
        select_difficulty: "Schwierigkeit wählen:",
        difficulty_easy: "Leicht",
        difficulty_medium: "Mittel",
        difficulty_hard: "Schwer",
        start_game: "Spiel starten",
        game_paused: "Spiel pausiert",
        continue_game: "Fortsetzen",
        restart_game: "Neustart",
        menu_instruction: "↑↓ zum Auswählen, Enter oder START zum Bestätigen",
        ready_continue: "Bereit fortzufahren",
        game_over: "Spiel vorbei!",
        your_score: "Deine Punktzahl: ",
        controls_title: "Steuerung:",
        key_instruction: "↑ ↓ ← → oder WASD: Schlange steuern",
        gamepad_instruction: "Gamepad: D-pad oder Stick zum Bewegen, START für Pause",
        space_instruction: "Leertaste: Pause/Fortsetzen",
        touch_instruction: "Touch: Nutze virtuelle Tasten oder Wischgesten",
        pause_game: "Pause",
        language_select: "Sprache wählen",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    },
    [LANGUAGES.ES]: {
        game_title: "Juego de la Serpiente",
        score: "Puntuación: ",
        high_score: "Puntuación Máxima: ",
        control_instruction: "Usa las flechas o WASD para controlar la serpiente",
        gamepad_support: "¡Mando compatible!",
        mobile_instruction: "En móvil, usa controles virtuales o desliza",
        select_difficulty: "Selecciona dificultad:",
        difficulty_easy: "Fácil",
        difficulty_medium: "Medio",
        difficulty_hard: "Difícil",
        start_game: "Comenzar",
        game_paused: "Juego Pausado",
        continue_game: "Continuar",
        restart_game: "Reiniciar",
        menu_instruction: "Usa ↑↓ para seleccionar, Enter o START para confirmar",
        ready_continue: "Listo para continuar",
        game_over: "¡Juego Terminado!",
        your_score: "Tu puntuación: ",
        controls_title: "Controles:",
        key_instruction: "↑ ↓ ← → o WASD: Mover serpiente",
        gamepad_instruction: "Mando: D-pad o stick para mover, START para pausar",
        space_instruction: "Espacio: Pausar/Continuar",
        touch_instruction: "Táctil: Usa botones virtuales o desliza",
        pause_game: "Pausa",
        language_select: "Seleccionar idioma",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    },
    [LANGUAGES.JA]: {
        game_title: "スネークゲーム",
        score: "スコア: ",
        high_score: "ハイスコア: ",
        control_instruction: "矢印キーまたはWASDキーでヘビを操作",
        gamepad_support: "ゲームパッド対応！",
        mobile_instruction: "モバイルでは、仮想ボタンまたはスワイプで操作",
        select_difficulty: "難易度選択:",
        difficulty_easy: "イージー",
        difficulty_medium: "ノーマル",
        difficulty_hard: "ハード",
        start_game: "ゲーム開始",
        game_paused: "一時停止中",
        continue_game: "続ける",
        restart_game: "リスタート",
        menu_instruction: "↑↓で選択、EnterまたはSTARTで決定",
        ready_continue: "続行準備完了",
        game_over: "ゲームオーバー！",
        your_score: "あなたのスコア: ",
        controls_title: "操作方法:",
        key_instruction: "↑ ↓ ← → またはWASD: ヘビの移動",
        gamepad_instruction: "ゲームパッド: D-padまたはスティックで移動、STARTで一時停止",
        space_instruction: "スペース: 一時停止/再開",
        touch_instruction: "タッチ操作: 仮想ボタンまたはスワイプ",
        pause_game: "一時停止",
        language_select: "言語選択",
        language_zh: "中文",
        language_en: "English",
        language_ru: "Русский",
        language_fr: "Français",
        language_de: "Deutsch",
        language_es: "Español",
        language_ja: "日本語"
    }
};

// 游戏元素
let snake, food, direction, nextDirection, score, gameInterval, isPaused;

// 最高分记录
let highScore = 0;

// 游戏状态
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    PAUSE_MENU: 'pause_menu',
    COUNTDOWN: 'countdown',
    GAME_OVER: 'game_over'
};
let currentGameState = GAME_STATE.MENU;

// 暂停菜单选项
const PAUSE_MENU_OPTIONS = {
    CONTINUE: 0,
    DIFFICULTY: 1,  // 新增难度选项
    RESTART: 2      // 重新开始选项移到最后
};
let selectedPauseOption = PAUSE_MENU_OPTIONS.CONTINUE;

// 倒计时变量
let countdownValue = 3;
let countdownInterval;

// 方向常量
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

// 游戏速度（毫秒）
let gameSpeed = SPEED_BY_DIFFICULTY[currentDifficulty];

// 游戏手柄变量
let gamepadAPI = {
    connected: false,
    controller: {},
    possibleStartButtons: [9, 7, 8, 3],
    possibleConfirmButtons: [0, 1, 2],
    possibleSelectButtons: [8, 6],
    prevButtons: [],
    dpadIndices: {
        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15
    },
    leftStickIndices: {
        HORIZONTAL: 0,
        VERTICAL: 1
    },
    stickThreshold: 0.5
};

// 添加遥感状态跟踪
let prevLeftStickX = 0;
let prevLeftStickY = 0;

// 屏幕元素
const menuScreen = document.getElementById('menuScreen');
const pauseMenuScreen = document.getElementById('pauseMenuScreen');
const countdownScreen = document.getElementById('countdownScreen');
const countdownDisplay = document.getElementById('countdown');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const finalScoreDisplay = document.getElementById('finalScore');
const finalHighScoreDisplay = document.getElementById('finalHighScore');
const startButton = document.getElementById('startButton');
const continueButton = document.getElementById('continueButton');
const restartFromPauseButton = document.getElementById('restartFromPauseButton');
const restartButton = document.getElementById('restartButton');
const languageToggle = document.getElementById('languageToggle');

// 难度选择按钮
const easyModeButton = document.getElementById('easyMode');
const mediumModeButton = document.getElementById('mediumMode');
const hardModeButton = document.getElementById('hardMode');
const difficultyButtons = [easyModeButton, mediumModeButton, hardModeButton];

// 暂停菜单选项元素
const pauseMenuOptions = [continueButton, restartFromPauseButton];

// 获取虚拟方向键元素
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const pauseBtn = document.getElementById('pauseBtn');

// 游戏结束界面
const gameOverDifficultySelector = document.createElement('div');
gameOverDifficultySelector.className = 'difficulty-selector';
gameOverDifficultySelector.innerHTML = `
    <p data-i18n="select_difficulty">选择难度:</p>
    <div class="difficulty-options">
        <button id="gameOverEasyMode" class="difficulty-option" data-i18n="difficulty_easy">慢速</button>
        <button id="gameOverMediumMode" class="difficulty-option" data-i18n="difficulty_medium">中速</button>
        <button id="gameOverHardMode" class="difficulty-option selected" data-i18n="difficulty_hard">快速</button>
    </div>
`;

// 在游戏结束界面的分数显示和重新开始按钮之间插入难度选择器
const endScores = gameOverScreen.querySelector('.end-scores');
endScores.after(gameOverDifficultySelector);

// 获取游戏结束界面的难度选择按钮
const gameOverEasyModeButton = document.getElementById('gameOverEasyMode');
const gameOverMediumModeButton = document.getElementById('gameOverMediumMode');
const gameOverHardModeButton = document.getElementById('gameOverHardMode');
const gameOverDifficultyButtons = [gameOverEasyModeButton, gameOverMediumModeButton, gameOverHardModeButton];

// 修改暂停菜单的HTML结构
pauseMenuScreen.innerHTML = `
    <h2 data-i18n="game_paused">游戏已暂停</h2>
    <div class="menu-options">
        <button id="continueButton" class="menu-option selected" data-i18n="continue_game">继续游戏</button>
        <div class="difficulty-selector">
            <p data-i18n="select_difficulty">选择难度:</p>
            <div class="difficulty-options">
                <button id="pauseEasyMode" class="difficulty-option" data-i18n="difficulty_easy">慢速</button>
                <button id="pauseMediumMode" class="difficulty-option" data-i18n="difficulty_medium">中速</button>
                <button id="pauseHardMode" class="difficulty-option selected" data-i18n="difficulty_hard">快速</button>
            </div>
        </div>
        <button id="restartFromPauseButton" class="menu-option" data-i18n="restart_game">重新开始</button>
    </div>
    <p class="menu-hint" data-i18n="menu_instruction">使用↑↓方向键选择，回车或START确认</p>
`;

// 获取暂停菜单中的难度选择按钮
const pauseEasyModeButton = document.getElementById('pauseEasyMode');
const pauseMediumModeButton = document.getElementById('pauseMediumMode');
const pauseHardModeButton = document.getElementById('pauseHardMode');
const pauseDifficultyButtons = [pauseEasyModeButton, pauseMediumModeButton, pauseHardModeButton];

// 触摸控制变量
let touchStartX = 0;
let touchStartY = 0;
const touchThreshold = 30; // 滑动阈值

// 处理难度选择的滑动
function handleDifficultySwipe(event, buttons) {
    const touchEndX = event.changedTouches[0].clientX;
    const dx = touchEndX - touchStartX;
    
    if (Math.abs(dx) > touchThreshold) {
        const currentIndex = buttons.findIndex(btn => btn.classList.contains('selected'));
        if (dx < 0 && currentIndex < buttons.length - 1) {
            // 向左滑动
            setDifficulty(Object.values(DIFFICULTY)[currentIndex + 1]);
        } else if (dx > 0 && currentIndex > 0) {
            // 向右滑动
            setDifficulty(Object.values(DIFFICULTY)[currentIndex - 1]);
        }
    }
}

// 为所有难度选择器添加触摸事件
[menuScreen, gameOverScreen, pauseMenuScreen].forEach(screen => {
    const difficultySelector = screen.querySelector('.difficulty-selector');
    if (difficultySelector) {
        // 添加滑动事件
        difficultySelector.addEventListener('touchstart', function(event) {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            event.preventDefault();
        });

        difficultySelector.addEventListener('touchend', function(event) {
            const buttons = screen === menuScreen ? difficultyButtons :
                          screen === gameOverScreen ? gameOverDifficultyButtons :
                          pauseDifficultyButtons;
            handleDifficultySwipe(event, buttons);
            event.preventDefault();
        });
        
        // 为每个难度按钮添加直接点击事件
        const difficultyOptions = difficultySelector.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach((btn, index) => {
            btn.addEventListener('touchend', function(event) {
                event.stopPropagation(); // 防止冒泡到父级元素
                // 设置相应的难度
                setDifficulty(Object.values(DIFFICULTY)[index]);
                event.preventDefault();
            });
        });
    }
});

// 优化触摸屏控制
canvas.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    event.preventDefault();
});

canvas.addEventListener('touchmove', function(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }
    
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // 确保滑动足够长再改变方向（避免意外触发）
    if (Math.abs(dx) < touchThreshold && Math.abs(dy) < touchThreshold) {
        return;
    }
    
    // 确定滑动方向
    if (Math.abs(dx) > Math.abs(dy)) {
        // 水平滑动
        if (dx > 0 && direction !== LEFT) {
            nextDirection = RIGHT;
        } else if (dx < 0 && direction !== RIGHT) {
            nextDirection = LEFT;
        }
    } else {
        // 垂直滑动
        if (dy > 0 && direction !== UP) {
            nextDirection = DOWN;
        } else if (dy < 0 && direction !== DOWN) {
            nextDirection = UP;
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
    event.preventDefault();
});

// 音效系统
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 创建音效的函数
function createSound(type, options) {
    return () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = type;
        
        if (Array.isArray(options.frequency)) {
            oscillator.frequency.setValueAtTime(options.frequency[0], audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(options.frequency[1], audioContext.currentTime + options.duration);
        } else {
            oscillator.frequency.setValueAtTime(options.frequency, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(options.volume || 0.5, audioContext.currentTime);
        if (options.fadeOut) {
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + options.duration);
        }
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + options.duration);
    };
}

// 定义所有音效
const SOUNDS = {
    button: createSound('square', {
        frequency: 800,
        duration: 0.1,
        volume: 0.3,
        fadeOut: true
    }),
    move: createSound('sine', {
        frequency: [300, 600],
        duration: 0.15,
        volume: 0.2,
        fadeOut: true
    }),
    select: createSound('sine', {
        frequency: 1000,
        duration: 0.1,
        volume: 0.3,
        fadeOut: true
    }),
    countdown: createSound('square', {
        frequency: 500,
        duration: 0.2,
        volume: 0.4,
        fadeOut: true
    }),
    start: createSound('triangle', {
        frequency: [400, 800],
        duration: 0.3,
        volume: 0.5,
        fadeOut: true
    }),
    eat: createSound('square', {
        frequency: [600, 200],
        duration: 0.2,
        volume: 0.4,
        fadeOut: true
    }),
    die: createSound('sawtooth', {
        frequency: [300, 100],
        duration: 0.5,
        volume: 0.4,
        fadeOut: true
    })
};

// 播放音效的函数
function playSound(soundName) {
    try {
        // 如果audioContext被暂停（浏览器策略），则恢复它
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        SOUNDS[soundName]();
    } catch (e) {
        console.log('播放音效失败:', e);
    }
}

// 初始化游戏
function initGame() {
    // 蛇的初始位置（中间）
    snake = [
        { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }
    ];
    
    // 添加初始长度
    for (let i = 1; i < 3; i++) {
        snake.push({ x: snake[0].x, y: snake[0].y + i });
    }
    
    // 初始方向
    direction = UP;
    nextDirection = UP;
    
    // 生成食物
    generateFood();
    
    // 重置分数
    score = 0;
    scoreDisplay.textContent = score;
    
    // 游戏未暂停
    isPaused = false;
}

// 生成食物
function generateFood() {
    let validPosition = false;
    let newFood;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // 确保食物不在蛇的身体上
        validPosition = true;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    food = newFood;
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
        // 蛇头用深绿色，身体用绿色
        ctx.fillStyle = i === 0 ? '#00C800' : '#00FF00';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        
        // 添加内边框使蛇身看起来有分节效果
        ctx.strokeStyle = '#005000';
        ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
    
    // 绘制食物
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    const centerX = food.x * gridSize + gridSize / 2;
    const centerY = food.y * gridSize + gridSize / 2;
    const radius = gridSize / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}

// 移动蛇
function moveSnake() {
    direction = nextDirection;
    
    // 计算新的头部位置
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // 检查是否撞到墙壁
    if (newHead.x < 0 || newHead.x >= gridWidth || newHead.y < 0 || newHead.y >= gridHeight) {
        playSound('die');
        gameOver();
        return;
    }
    
    // 检查是否撞到自己
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            playSound('die');
            gameOver();
            return;
        }
    }
    
    // 在蛇头前添加新位置
    snake.unshift(newHead);
    
    // 检查是否吃到食物
    if (newHead.x === food.x && newHead.y === food.y) {
        playSound('eat');
        // 增加分数
        score++;
        scoreDisplay.textContent = score;
        
        // 生成新食物
        generateFood();
        
        // 增加游戏速度
        if (score % 5 === 0 && gameSpeed > 50) {
            gameSpeed -= 5;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        // 如果没有吃到食物，删除尾部
        snake.pop();
    }
}

// 更新最高分
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        // 保存到localStorage
        try {
            localStorage.setItem('snakeHighScore', highScore);
        } catch (e) {
            console.log('无法保存最高分到localStorage');
        }
    }
}

// 加载保存的最高分
function loadHighScore() {
    try {
        const savedScore = localStorage.getItem('snakeHighScore');
        if (savedScore !== null) {
            highScore = parseInt(savedScore, 10);
            highScoreDisplay.textContent = highScore;
        }
    } catch (e) {
        console.log('无法从localStorage加载最高分');
    }
}

// 游戏循环
function gameLoop() {
    if (!isPaused) {
        moveSnake();
        drawGame();
    }
}

// 游戏结束
function gameOver() {
    clearInterval(gameInterval);
    
    // 更新最高分
    updateHighScore();
    
    finalScoreDisplay.textContent = score;
    finalHighScoreDisplay.textContent = highScore;
    gameOverScreen.classList.remove('hidden');
    currentGameState = GAME_STATE.GAME_OVER;
}

// 开始游戏
function startGame() {
    menuScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // 根据选择的难度设置游戏速度
    gameSpeed = SPEED_BY_DIFFICULTY[currentDifficulty];
    
    initGame();
    drawGame();
    
    // 设置游戏状态为进行中
    currentGameState = GAME_STATE.PLAYING;
    isPaused = false;
    
    // 启动游戏循环
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    
    // 开始游戏手柄轮询
    startGamepadPolling();
}

// 创建语言选择弹窗
function createLanguageDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'language-dialog hidden';
    dialog.innerHTML = `
        <div class="language-dialog-content">
            <h2 data-i18n="language_select">选择语言</h2>
            <div class="language-options">
                <button data-lang="${LANGUAGES.ZH}" class="language-option">中文</button>
                <button data-lang="${LANGUAGES.EN}" class="language-option">English</button>
                <button data-lang="${LANGUAGES.RU}" class="language-option">Русский</button>
                <button data-lang="${LANGUAGES.FR}" class="language-option">Français</button>
                <button data-lang="${LANGUAGES.DE}" class="language-option">Deutsch</button>
                <button data-lang="${LANGUAGES.ES}" class="language-option">Español</button>
                <button data-lang="${LANGUAGES.JA}" class="language-option">日本語</button>
            </div>
        </div>
    `;
    
    document.querySelector('.game-container').appendChild(dialog);
    
    // 为每个语言选项添加点击事件
    dialog.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            currentLanguage = selectedLang;
            updateLanguage();
            dialog.classList.add('hidden');
        });
    });
    
    return dialog;
}

// 修改语言切换按钮的文本和行为
function updateLanguageToggle() {
    languageToggle.textContent = currentLanguage === LANGUAGES.ZH ? 'E/文' : '文/E';
}

// 修改toggleLanguage函数
function toggleLanguage() {
    // 如果游戏正在进行，先暂停游戏并显示暂停菜单
    if (currentGameState === GAME_STATE.PLAYING) {
        isPaused = true;
        currentGameState = GAME_STATE.PAUSE_MENU;
        showPauseMenu();
    }
    const dialog = document.querySelector('.language-dialog');
    dialog.classList.remove('hidden');
    
    // 初始化语言选择状态
    initializeLanguageSelection();
}

// 修改语言选择相关变量和函数
let selectedLanguageIndex = 0;
const LANGUAGE_GRID = {
    COLS: 7  // 只保留单行布局
};
const languageOptions = [LANGUAGES.ZH, LANGUAGES.EN, LANGUAGES.RU, LANGUAGES.FR, LANGUAGES.DE, LANGUAGES.ES, LANGUAGES.JA];

function selectNextLanguage(direction) {
    const totalLanguages = languageOptions.length;
    
    switch (direction) {
        case 'right':
            if (selectedLanguageIndex < totalLanguages - 1) {
                selectedLanguageIndex++;
                updateLanguageSelection();
            }
            break;
        case 'left':
            if (selectedLanguageIndex > 0) {
                selectedLanguageIndex--;
                updateLanguageSelection();
            }
            break;
    }
}

function initializeLanguageSelection() {
    selectedLanguageIndex = languageOptions.indexOf(currentLanguage);
    updateLanguageSelection();
}

function updateLanguageSelection() {
    const buttons = document.querySelectorAll('.language-option');
    buttons.forEach((button, index) => {
        button.classList.remove('selected');
        if (index === selectedLanguageIndex) {
            button.classList.add('selected');
        }
    });
}

function confirmLanguageSelection() {
    const selectedLang = languageOptions[selectedLanguageIndex];
    currentLanguage = selectedLang;
    updateLanguage();
    const dialog = document.querySelector('.language-dialog');
    dialog.classList.add('hidden');
    
    // 如果游戏之前在进行，显示暂停菜单
    if (currentGameState === GAME_STATE.PLAYING) {
        currentGameState = GAME_STATE.PAUSE_MENU;
        showPauseMenu();
    }
}

// 更新setDifficulty函数
function setDifficulty(difficulty) {
    playSound('select');
    currentDifficulty = difficulty;
    
    // 更新所有界面的难度选择按钮样式
    difficultyButtons.forEach(btn => btn.classList.remove('selected'));
    gameOverDifficultyButtons.forEach(btn => btn.classList.remove('selected'));
    pauseDifficultyButtons.forEach(btn => btn.classList.remove('selected'));
    
    switch (difficulty) {
        case DIFFICULTY.EASY:
            easyModeButton.classList.add('selected');
            gameOverEasyModeButton.classList.add('selected');
            pauseEasyModeButton.classList.add('selected');
            break;
        case DIFFICULTY.MEDIUM:
            mediumModeButton.classList.add('selected');
            gameOverMediumModeButton.classList.add('selected');
            pauseMediumModeButton.classList.add('selected');
            break;
        case DIFFICULTY.HARD:
            hardModeButton.classList.add('selected');
            gameOverHardModeButton.classList.add('selected');
            pauseHardModeButton.classList.add('selected');
            break;
    }
    
    // 如果在游戏中更改难度，立即更新游戏速度
    if (currentGameState === GAME_STATE.PLAYING || currentGameState === GAME_STATE.PAUSE_MENU) {
        gameSpeed = SPEED_BY_DIFFICULTY[currentDifficulty];
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }
}

// 暂停/继续游戏
function togglePause() {
    if (currentGameState === GAME_STATE.PLAYING) {
        isPaused = true;
        currentGameState = GAME_STATE.PAUSE_MENU;  // 改为显示暂停菜单
        showPauseMenu();
        console.log("游戏已暂停，显示菜单");
    } else if (currentGameState === GAME_STATE.PAUSE_MENU) {
        // 如果在暂停菜单，则继续游戏（带倒计时）
        startCountdown();
    }
}

// 显示暂停菜单
function showPauseMenu() {
    pauseMenuScreen.classList.remove('hidden');
    selectedPauseOption = PAUSE_MENU_OPTIONS.CONTINUE;  // 默认选中"继续游戏"
    updatePauseMenuSelection();
}

// 隐藏暂停菜单
function hidePauseMenu() {
    pauseMenuScreen.classList.add('hidden');
}

// 开始倒计时
function startCountdown() {
    hidePauseMenu();
    currentGameState = GAME_STATE.COUNTDOWN;
    countdownValue = 3;
    countdownDisplay.textContent = countdownValue;
    countdownScreen.classList.remove('hidden');
    
    // 清除任何现有的倒计时
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 设置倒计时
    countdownInterval = setInterval(function() {
        countdownValue--;
        playSound('countdown');
        countdownDisplay.textContent = countdownValue;
        
        if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            playSound('start');
            continueAfterCountdown();
        }
    }, 1000);
    
    console.log("开始倒计时: 3秒");
}

// 倒计时结束后继续游戏
function continueAfterCountdown() {
    countdownScreen.classList.add('hidden');
    resumeGame();
}

// 继续游戏
function resumeGame() {
    isPaused = false;
    currentGameState = GAME_STATE.PLAYING;
    console.log("游戏已继续");
}

// 更新暂停菜单选项高亮
function updatePauseMenuSelection() {
    const continueButton = document.getElementById('continueButton');
    const difficultySelector = pauseMenuScreen.querySelector('.difficulty-selector');
    const restartButton = document.getElementById('restartFromPauseButton');
    
    // 移除所有选项的高亮
    continueButton.classList.remove('selected');
    difficultySelector.classList.remove('selected');
    restartButton.classList.remove('selected');
    
    // 根据当前选择添加高亮
    switch (selectedPauseOption) {
        case PAUSE_MENU_OPTIONS.CONTINUE:
            continueButton.classList.add('selected');
            break;
        case PAUSE_MENU_OPTIONS.DIFFICULTY:
            difficultySelector.classList.add('selected');
            // 确保难度选择器可以点击
            difficultySelector.style.pointerEvents = 'auto';
            break;
        case PAUSE_MENU_OPTIONS.RESTART:
            restartButton.classList.add('selected');
            break;
    }
}

// 为主菜单中的难度选择按钮添加点击事件
easyModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.EASY);
});

mediumModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.MEDIUM);
});

hardModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.HARD);
});

// 为暂停菜单中的难度选择按钮添加点击事件
pauseEasyModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.EASY);
});

pauseMediumModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.MEDIUM);
});

pauseHardModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.HARD);
});

// 游戏手柄连接事件
window.addEventListener("gamepadconnected", function(e) {
    console.log("游戏手柄已连接: " + e.gamepad.id);
    gamepadAPI.connected = true;
    gamepadAPI.controller = e.gamepad;
    
    // 初始化按钮状态数组
    const gamepad = navigator.getGamepads()[gamepadAPI.controller.index];
    if (gamepad) {
        gamepadAPI.prevButtons = Array.from(gamepad.buttons, button => button.pressed);
    }
    
    // 显示手柄连接提示
    showGamepadConnectedMessage();
});

// 游戏手柄断开事件
window.addEventListener("gamepaddisconnected", function(e) {
    console.log("游戏手柄已断开: " + e.gamepad.id);
    gamepadAPI.connected = false;
});

// 显示手柄连接提示
function showGamepadConnectedMessage() {
    const container = document.querySelector('.game-container');
    const message = document.createElement('div');
    message.className = 'gamepad-message';
    message.innerHTML = '游戏手柄已连接！';
    
    container.appendChild(message);
    
    // 3秒后自动消失
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(message);
        }, 500);
    }, 3000);
}

// 启动游戏手柄轮询
function startGamepadPolling() {
    // 如果已经有轮询，不再重复创建
    if (window.gamepadPollInterval) {
        clearInterval(window.gamepadPollInterval);
    }
    
    // 每16毫秒轮询一次手柄状态 (约60fps)
    window.gamepadPollInterval = setInterval(checkGamepadInput, 16);
}

// 检查游戏手柄输入
function checkGamepadInput() {
    if (!gamepadAPI.connected) return;
    
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];
    
    if (!gamepad) return;

    // 检查START和SELECT按钮
    const selectPressed = gamepadAPI.possibleSelectButtons.some(index => {
        const wasPressed = gamepadAPI.prevButtons[index];
        const isPressed = gamepad.buttons[index].pressed;
        return isPressed && !wasPressed;
    });

    const startPressed = gamepadAPI.possibleStartButtons.some(index => {
        const wasPressed = gamepadAPI.prevButtons[index];
        const isPressed = gamepad.buttons[index].pressed;
        return isPressed && !wasPressed;
    });

    const confirmPressed = gamepadAPI.possibleConfirmButtons.some(index => {
        const wasPressed = gamepadAPI.prevButtons[index];
        const isPressed = gamepad.buttons[index].pressed;
        return isPressed && !wasPressed;
    });
    
    // 获取方向键状态
    const upButtonWasPressed = gamepadAPI.prevButtons[gamepadAPI.dpadIndices.UP];
    const upButtonIsPressed = gamepad.buttons[gamepadAPI.dpadIndices.UP].pressed;
    const downButtonWasPressed = gamepadAPI.prevButtons[gamepadAPI.dpadIndices.DOWN];
    const downButtonIsPressed = gamepad.buttons[gamepadAPI.dpadIndices.DOWN].pressed;
    const leftButtonWasPressed = gamepadAPI.prevButtons[gamepadAPI.dpadIndices.LEFT];
    const leftButtonIsPressed = gamepad.buttons[gamepadAPI.dpadIndices.LEFT].pressed;
    const rightButtonWasPressed = gamepadAPI.prevButtons[gamepadAPI.dpadIndices.RIGHT];
    const rightButtonIsPressed = gamepad.buttons[gamepadAPI.dpadIndices.RIGHT].pressed;

    // 获取摇杆状态
    const leftStickX = gamepad.axes[gamepadAPI.leftStickIndices.HORIZONTAL];
    const leftStickY = gamepad.axes[gamepadAPI.leftStickIndices.VERTICAL];
    
    // 处理语言选择弹窗的状态
    const languageDialog = document.querySelector('.language-dialog');
    const isLanguageDialogOpen = !languageDialog.classList.contains('hidden');
    
    if (isLanguageDialogOpen) {
        // 在语言选择弹窗中的控制，只使用左右方向键
        if (leftButtonIsPressed && !leftButtonWasPressed) {
            selectNextLanguage('left');
        } else if (rightButtonIsPressed && !rightButtonWasPressed) {
            selectNextLanguage('right');
        }
        
        if (confirmPressed || startPressed) {
            confirmLanguageSelection();
        }
        
        // 更新按钮状态并返回
        for (let i = 0; i < gamepad.buttons.length; i++) {
            gamepadAPI.prevButtons[i] = gamepad.buttons[i].pressed;
        }
        return;
    }

    // SELECT按钮打开语言选择
    if (selectPressed) {
        toggleLanguage();
        // 更新按钮状态并返回
        for (let i = 0; i < gamepad.buttons.length; i++) {
            gamepadAPI.prevButtons[i] = gamepad.buttons[i].pressed;
        }
        return;
    }

    // START按钮处理
    if (startPressed) {
        switch (currentGameState) {
            case GAME_STATE.PLAYING:
                togglePause();
                break;
            case GAME_STATE.PAUSE_MENU:
                if (selectedPauseOption !== PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    confirmPauseMenuSelection();
                }
                break;
            case GAME_STATE.MENU:
            case GAME_STATE.GAME_OVER:
                startGame();
                break;
        }
        // 更新按钮状态并返回
        for (let i = 0; i < gamepad.buttons.length; i++) {
            gamepadAPI.prevButtons[i] = gamepad.buttons[i].pressed;
        }
        return;
    }
    
    // 游戏中的移动控制
    if (currentGameState === GAME_STATE.PLAYING) {
        // 使用方向键和摇杆控制移动
        if (upButtonIsPressed) {
            if (direction !== DOWN) {
                if (!upButtonWasPressed) {
                    playSound('move');
                }
                nextDirection = UP;
            }
        } else if (leftStickY < -gamepadAPI.stickThreshold) {
            if (direction !== DOWN) nextDirection = UP;
        }
        
        if (downButtonIsPressed) {
            if (direction !== UP) {
                if (!downButtonWasPressed) {
                    playSound('move');
                }
                nextDirection = DOWN;
            }
        } else if (leftStickY > gamepadAPI.stickThreshold) {
            if (direction !== UP) nextDirection = DOWN;
        }
        
        if (leftButtonIsPressed) {
            if (direction !== RIGHT) {
                if (!leftButtonWasPressed) {
                    playSound('move');
                }
                nextDirection = LEFT;
            }
        } else if (leftStickX < -gamepadAPI.stickThreshold) {
            if (direction !== RIGHT) nextDirection = LEFT;
        }
        
        if (rightButtonIsPressed) {
            if (direction !== LEFT) {
                if (!rightButtonWasPressed) {
                    playSound('move');
                }
                nextDirection = RIGHT;
            }
        } else if (leftStickX > gamepadAPI.stickThreshold) {
            if (direction !== LEFT) nextDirection = RIGHT;
        }
    }
    
    // 其他游戏状态的处理
    switch (currentGameState) {
        case GAME_STATE.MENU:
            // 使用方向键或摇杆选择难度
            if ((leftButtonIsPressed && !leftButtonWasPressed) || 
                (leftStickX < -gamepadAPI.stickThreshold && Math.abs(prevLeftStickX) <= gamepadAPI.stickThreshold)) {
                const currentIndex = difficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                if (currentIndex > 0) {
                    setDifficulty(Object.values(DIFFICULTY)[currentIndex - 1]);
                }
            } else if ((rightButtonIsPressed && !rightButtonWasPressed) || 
                       (leftStickX > gamepadAPI.stickThreshold && Math.abs(prevLeftStickX) <= gamepadAPI.stickThreshold)) {
                const currentIndex = difficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                if (currentIndex < difficultyButtons.length - 1) {
                    setDifficulty(Object.values(DIFFICULTY)[currentIndex + 1]);
                }
            }
            break;
            
        case GAME_STATE.PAUSE_MENU:
            // 使用上下方向键或摇杆在选项间移动
            if ((upButtonIsPressed && !upButtonWasPressed) || 
                (leftStickY < -gamepadAPI.stickThreshold && Math.abs(prevLeftStickY) <= gamepadAPI.stickThreshold)) {
                selectedPauseOption = (selectedPauseOption - 1 + Object.keys(PAUSE_MENU_OPTIONS).length) % Object.keys(PAUSE_MENU_OPTIONS).length;
                updatePauseMenuSelection();
            } else if ((downButtonIsPressed && !downButtonWasPressed) || 
                      (leftStickY > gamepadAPI.stickThreshold && Math.abs(prevLeftStickY) <= gamepadAPI.stickThreshold)) {
                selectedPauseOption = (selectedPauseOption + 1) % Object.keys(PAUSE_MENU_OPTIONS).length;
                updatePauseMenuSelection();
            }

            // 在难度选择区域时使用左右方向键或摇杆选择难度
            if (selectedPauseOption === PAUSE_MENU_OPTIONS.DIFFICULTY) {
                if ((leftButtonIsPressed && !leftButtonWasPressed) || 
                    (leftStickX < -gamepadAPI.stickThreshold && Math.abs(prevLeftStickX) <= gamepadAPI.stickThreshold)) {
                    const currentIndex = pauseDifficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                    if (currentIndex > 0) {
                        setDifficulty(Object.values(DIFFICULTY)[currentIndex - 1]);
                    }
                } else if ((rightButtonIsPressed && !rightButtonWasPressed) || 
                          (leftStickX > gamepadAPI.stickThreshold && Math.abs(prevLeftStickX) <= gamepadAPI.stickThreshold)) {
                    const currentIndex = pauseDifficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                    if (currentIndex < pauseDifficultyButtons.length - 1) {
                        setDifficulty(Object.values(DIFFICULTY)[currentIndex + 1]);
                    }
                }
            }

            // 添加对确认按钮（A键）的支持
            if (confirmPressed) {
                if (selectedPauseOption !== PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    confirmPauseMenuSelection();
                }
            }
            break;
            
        case GAME_STATE.GAME_OVER:
            // 使用方向键或摇杆选择难度
            if ((leftButtonIsPressed && !leftButtonWasPressed) || 
                (leftStickX < -gamepadAPI.stickThreshold && Math.abs(prevLeftStickX) <= gamepadAPI.stickThreshold)) {
                const currentIndex = gameOverDifficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                if (currentIndex > 0) {
                    setDifficulty(Object.values(DIFFICULTY)[currentIndex - 1]);
                }
            } else if ((rightButtonIsPressed && !rightButtonWasPressed) || 
                       (leftStickX > gamepadAPI.stickThreshold && Math.abs(prevLeftStickX) <= gamepadAPI.stickThreshold)) {
                const currentIndex = gameOverDifficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                if (currentIndex < gameOverDifficultyButtons.length - 1) {
                    setDifficulty(Object.values(DIFFICULTY)[currentIndex + 1]);
                }
            }
            break;
    }
    
    // 更新按钮和摇杆状态
    for (let i = 0; i < gamepad.buttons.length; i++) {
        gamepadAPI.prevButtons[i] = gamepad.buttons[i].pressed;
    }
    prevLeftStickX = leftStickX;
    prevLeftStickY = leftStickY;
}

// 事件监听器
startButton.addEventListener('click', function() {
    playSound('button');
    startGame();
});

restartButton.addEventListener('click', function() {
    playSound('button');
    startGame();
});

continueButton.addEventListener('click', function() {
    playSound('button');
    startCountdown();
});

restartFromPauseButton.addEventListener('click', function() {
    playSound('button');
    hidePauseMenu();
    startGame();
});

// 语言切换按钮点击事件
languageToggle.addEventListener('click', toggleLanguage);

// 键盘控制
document.addEventListener('keydown', function(event) {
    // 阻止方向键、WASD和空格键的默认行为（页面滚动）
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'Enter', 'Escape'].includes(event.key)) {
        event.preventDefault();
    }
    
    // 在倒计时状态下，忽略大多数按键输入
    if (currentGameState === GAME_STATE.COUNTDOWN) {
        return;
    }
    
    // 在暂停菜单状态下的特殊控制
    if (currentGameState === GAME_STATE.PAUSE_MENU) {
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (selectedPauseOption === PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    const currentIndex = pauseDifficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                    if (currentIndex > 0) {
                        setDifficulty(Object.values(DIFFICULTY)[currentIndex - 1]);
                    }
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (selectedPauseOption === PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    const currentIndex = pauseDifficultyButtons.findIndex(btn => btn.classList.contains('selected'));
                    if (currentIndex < pauseDifficultyButtons.length - 1) {
                        setDifficulty(Object.values(DIFFICULTY)[currentIndex + 1]);
                    }
                }
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (selectedPauseOption === PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    selectedPauseOption = PAUSE_MENU_OPTIONS.CONTINUE;
                } else {
                    selectedPauseOption = (selectedPauseOption - 1 + Object.keys(PAUSE_MENU_OPTIONS).length) % Object.keys(PAUSE_MENU_OPTIONS).length;
                }
                updatePauseMenuSelection();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (selectedPauseOption === PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    selectedPauseOption = PAUSE_MENU_OPTIONS.RESTART;
                } else {
                    selectedPauseOption = (selectedPauseOption + 1) % Object.keys(PAUSE_MENU_OPTIONS).length;
                }
                updatePauseMenuSelection();
                break;
            case 'Enter':
            case ' ':
                if (selectedPauseOption !== PAUSE_MENU_OPTIONS.DIFFICULTY) {
                    confirmPauseMenuSelection();
                }
                break;
            case 'Escape':
                startCountdown();
                break;
        }
        return;
    }
    
    // 其他游戏状态下的控制
    switch(event.key) {
        // 方向键控制
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== DOWN && currentGameState === GAME_STATE.PLAYING) {
                playSound('move');
                nextDirection = UP;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== UP && currentGameState === GAME_STATE.PLAYING) {
                playSound('move');
                nextDirection = DOWN;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== RIGHT && currentGameState === GAME_STATE.PLAYING) {
                playSound('move');
                nextDirection = LEFT;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== LEFT && currentGameState === GAME_STATE.PLAYING) {
                playSound('move');
                nextDirection = RIGHT;
            }
            break;
        case ' ': // 空格键
        case 'Escape': // Esc键
            if (currentGameState === GAME_STATE.MENU) {
                startGame();
            } else if (currentGameState === GAME_STATE.PLAYING) {
                togglePause();
            } else if (currentGameState === GAME_STATE.GAME_OVER) {
                startGame();
            }
            break;
        case 'Enter': // 回车键
            if (currentGameState === GAME_STATE.MENU) {
                startGame();
            } else if (currentGameState === GAME_STATE.GAME_OVER) {
                startGame();
            }
            break;
    }
});

// 虚拟方向键事件处理
upBtn.addEventListener('touchstart', function(event) {
    if (direction !== DOWN) {
        playSound('move');
        nextDirection = UP;
    }
    event.preventDefault();
});

downBtn.addEventListener('touchstart', function(event) {
    if (direction !== UP) {
        playSound('move');
        nextDirection = DOWN;
    }
    event.preventDefault();
});

leftBtn.addEventListener('touchstart', function(event) {
    if (direction !== RIGHT) {
        playSound('move');
        nextDirection = LEFT;
    }
    event.preventDefault();
});

rightBtn.addEventListener('touchstart', function(event) {
    if (direction !== LEFT) {
        playSound('move');
        nextDirection = RIGHT;
    }
    event.preventDefault();
});

pauseBtn.addEventListener('touchstart', function(event) {
    togglePause();
    event.preventDefault();
});

// 同样支持点击事件（非触摸设备）
upBtn.addEventListener('click', function() {
    if (direction !== DOWN) {
        nextDirection = UP;
    }
});

downBtn.addEventListener('click', function() {
    if (direction !== UP) {
        nextDirection = DOWN;
    }
});

leftBtn.addEventListener('click', function() {
    if (direction !== RIGHT) {
        nextDirection = LEFT;
    }
});

rightBtn.addEventListener('click', function() {
    if (direction !== LEFT) {
        nextDirection = RIGHT;
    }
});

pauseBtn.addEventListener('click', togglePause);

// 自适应画布大小
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const maxWidth = container.clientWidth - 40; // 减去padding
    
    if (maxWidth < canvas.width) {
        const ratio = canvas.height / canvas.width;
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = (maxWidth * ratio) + 'px';
    } else {
        canvas.style.width = '';
        canvas.style.height = '';
    }
    
    // 检测是否为移动设备并适当调整界面
    if (isMobileDevice()) {
        // 调整屏幕大小，使其在移动设备上更易于触摸
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.fontSize = '16px';
        });
        
        // 增加难度选择按钮的触摸区域
        document.querySelectorAll('.difficulty-option').forEach(btn => {
            btn.style.margin = '10px 5px';
        });
    }
}

// 检测是否为移动设备
function isMobileDevice() {
    return (window.innerWidth <= 850) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

// 初始调整和窗口大小变化时调整
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 初始化：加载最高分，更新语言
loadHighScore();
updateLanguage();

// 初始化时显示主菜单，设置游戏状态
menuScreen.classList.remove('hidden');
currentGameState = GAME_STATE.MENU;

// 初始启动游戏手柄轮询，确保在主菜单界面就能检测到手柄输入
startGamepadPolling();

// 为游戏结束界面的难度选择按钮添加点击事件
gameOverEasyModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.EASY);
    updateGameOverDifficultyButtons(DIFFICULTY.EASY);
});

gameOverMediumModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.MEDIUM);
    updateGameOverDifficultyButtons(DIFFICULTY.MEDIUM);
});

gameOverHardModeButton.addEventListener('click', function() {
    setDifficulty(DIFFICULTY.HARD);
    updateGameOverDifficultyButtons(DIFFICULTY.HARD);
});

// 更新游戏结束界面的难度选择按钮状态
function updateGameOverDifficultyButtons(difficulty) {
    gameOverDifficultyButtons.forEach(btn => btn.classList.remove('selected'));
    switch (difficulty) {
        case DIFFICULTY.EASY:
            gameOverEasyModeButton.classList.add('selected');
            break;
        case DIFFICULTY.MEDIUM:
            gameOverMediumModeButton.classList.add('selected');
            break;
        case DIFFICULTY.HARD:
            gameOverHardModeButton.classList.add('selected');
            break;
    }
}

// 确认当前选择的菜单选项
function confirmPauseMenuSelection() {
    switch (selectedPauseOption) {
        case PAUSE_MENU_OPTIONS.CONTINUE:
            startCountdown();
            break;
        case PAUSE_MENU_OPTIONS.DIFFICULTY:
            // 难度选择不需要特殊处理，因为已经在选择时更新了
            break;
        case PAUSE_MENU_OPTIONS.RESTART:
            hidePauseMenu();
            startGame();
            break;
    }
}

// 修改暂停菜单的HTML结构，添加暂停按钮
const gamePauseButton = document.createElement('button');
gamePauseButton.id = 'gamePauseButton';
gamePauseButton.className = 'game-pause-button';
gamePauseButton.setAttribute('data-i18n', 'pause_game');
gamePauseButton.textContent = i18n[currentLanguage].pause_game; // 设置初始文本
document.querySelector('.game-container').appendChild(gamePauseButton);

// 为暂停按钮添加点击事件
gamePauseButton.addEventListener('click', function() {
    if (currentGameState === GAME_STATE.PLAYING) {
        togglePause();
    }
});

// 修改事件监听器部分
// 事件监听器
startButton.addEventListener('click', function() {
    playSound('button');
    startGame();
});

restartButton.addEventListener('click', function() {
    playSound('button');
    startGame();
});

// 为暂停菜单中的按钮添加点击事件
document.getElementById('continueButton').addEventListener('click', function() {
    if (currentGameState === GAME_STATE.PAUSE_MENU) {
        startCountdown();
    }
});

document.getElementById('restartFromPauseButton').addEventListener('click', function() {
    if (currentGameState === GAME_STATE.PAUSE_MENU) {
        hidePauseMenu();
        startGame();
    }
});

// 初始化时创建语言选择弹窗
const languageDialog = createLanguageDialog();

// 更新updateLanguage函数
function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLanguage][key]) {
            el.textContent = i18n[currentLanguage][key];
        }
    });
    
    updateLanguageToggle();
} 