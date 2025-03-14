/**
 * UI模块 - 处理游戏界面元素和屏幕切换
 */
class UI {
    constructor() {
        // 所有屏幕
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            settings: document.getElementById('settings-screen'),
            highScores: document.getElementById('high-scores-screen'),
            pause: document.getElementById('pause-screen'),
            gameOver: document.getElementById('game-over-screen')
        };
        
        // 当前活动屏幕
        this.activeScreen = 'start';
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化UI事件监听
     */
    init() {
        // 开始游戏按钮
        document.getElementById('start-game').addEventListener('click', () => {
            this.showScreen('game');
            audioManager.playButtonSound();
            game.start();
        });
        
        // 设置按钮
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showScreen('settings');
            audioManager.playButtonSound();
        });
        
        // 最高分按钮
        document.getElementById('high-scores-btn').addEventListener('click', () => {
            this.showScreen('highScores');
            audioManager.playButtonSound();
            scoreboard.updateHighScoresList();
        });
        
        // 从设置返回按钮 - 确保正确处理语言更改
        document.getElementById('back-from-settings').addEventListener('click', () => {
            // 应用语言按钮可能没有被点击，强制应用当前选择的语言
            const languageSelect = document.getElementById('language-select');
            if (languageSelect && window.i18n) {
                const currentLang = languageSelect.value;
                const savedLang = window.i18n.currentLanguage;
                
                if (currentLang !== savedLang) {
                    // 语言选择已更改但未应用，询问用户
                    if (confirm('您更改了语言但未应用，是否应用更改？')) {
                        // 手动触发应用按钮点击
                        const applyBtn = document.getElementById('apply-language');
                        if (applyBtn) {
                            applyBtn.click();
                        }
                    }
                }
            }
            
            this.showScreen('start');
            if (window.audioManager) {
                window.audioManager.playButtonSound();
            }
        });
        
        // 从高分返回按钮
        document.getElementById('back-from-scores').addEventListener('click', () => {
            this.showScreen('start');
            audioManager.playButtonSound();
        });
        
        // 难度选项卡
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                scoreboard.updateHighScoresList(btn.dataset.difficulty);
                audioManager.playMenuSelectSound();
            });
        });
        
        // 游戏暂停按钮
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.showScreen('pause');
            audioManager.playButtonSound();
            game.pause();
        });
        
        // 游戏继续按钮
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.showScreen('game');
            audioManager.playButtonSound();
            game.resume();
        });
        
        // 游戏重新开始按钮
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.showScreen('game');
            audioManager.playButtonSound();
            game.restart();
        });
        
        // 退出按钮
        document.getElementById('exit-btn').addEventListener('click', () => {
            this.showScreen('start');
            audioManager.playButtonSound();
            game.stop();
        });
        
        // 游戏结束再玩一次按钮
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.showScreen('game');
            audioManager.playButtonSound();
            game.restart();
        });
        
        // 游戏结束主菜单按钮
        document.getElementById('main-menu-btn').addEventListener('click', () => {
            this.showScreen('start');
            audioManager.playButtonSound();
            game.stop();
        });
        
        // 主题切换
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // 样式处理在GraphicsManager中完成
                audioManager.playButtonSound();
            });
        });
        
        // 窗口大小改变事件
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 阻止游戏区域的触摸事件滚动页面
        document.getElementById('game-canvas').addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // 初始显示开始屏幕
        this.showScreen('start');
    }
    
    /**
     * 显示指定屏幕
     * @param {string} screenId - 屏幕ID
     */
    showScreen(screenId) {
        if (!this.screens[screenId]) return;
        
        // 隐藏所有屏幕
        for (const id in this.screens) {
            if (this.screens[id]) {
                this.screens[id].classList.add('hidden');
            }
        }
        
        // 显示指定屏幕
        this.screens[screenId].classList.remove('hidden');
        this.activeScreen = screenId;
        
        // 页面重新聚焦时更新Canvas
        if (screenId === 'game' && game) {
            setTimeout(() => {
                if (game.renderer) {
                    game.renderer.handleResize();
                }
            }, 10);
        }
    }
    
    /**
     * 处理窗口大小改变
     */
    handleResize() {
        // 如果当前在游戏屏幕，更新Canvas大小
        if (this.activeScreen === 'game' && game && game.renderer) {
            game.renderer.handleResize();
        }
    }
    
    /**
     * 显示游戏结束屏幕
     * @param {number} score - 最终分数
     * @param {boolean} isNewHighScore - 是否新高分
     */
    showGameOver(score, isNewHighScore) {
        // 更新最终分数
        document.getElementById('final-score').textContent = score;
        
        // 显示/隐藏新高分提示
        document.getElementById('new-high-score').classList.toggle('hidden', !isNewHighScore);
        
        // 如果是新高分，播放特殊音效
        if (isNewHighScore) {
            setTimeout(() => {
                audioManager.playHighScoreSound();
            }, 500);
        }
        
        // 显示游戏结束屏幕
        this.showScreen('gameOver');
    }
    
    /**
     * 更新分数显示
     * @param {number} score - 当前分数
     * @param {number} highScore - 最高分
     */
    updateScore(score, highScore) {
        document.getElementById('current-score').textContent = score;
        document.getElementById('high-score').textContent = highScore;
    }
    
    /**
     * 获取当前活动屏幕
     * @returns {string} 活动屏幕ID
     */
    getActiveScreen() {
        return this.activeScreen;
    }
    
    /**
     * 检查是否在游戏屏幕
     * @returns {boolean} 是否在游戏屏幕
     */
    isGameScreenActive() {
        return this.activeScreen === 'game';
    }
}

// 确保游戏能正常运行的初始化代码
document.addEventListener('DOMContentLoaded', () => {
    // 创建全局UI实例
    window.ui = new UI();

    // 检查必要全局对象是否已创建
    if (!window.scoreboard) {
        window.scoreboard = new Scoreboard();
    }
    
    if (!window.settingsManager) {
        window.settingsManager = new Settings();
    }
    
    // 确保i18n正确加载
    if (!window.i18n) {
        console.error('i18n对象不存在，可能导致语言功能问题');
    } else {
        // 强制更新一次翻译
        window.i18n.updateTranslations();
    }
});
