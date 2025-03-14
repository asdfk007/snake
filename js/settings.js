/**
 * 设置模块 - 管理游戏设置和难度
 */
class Settings {
    constructor() {
        // 默认设置
        this.defaultSettings = {
            difficulty: 'medium',
            theme: 'light',
            sound: true,
            language: 'zh-CN'
        };
        
        // 当前设置
        this.currentSettings = this.loadSettings();
        
        // 不同难度的游戏参数
        this.difficultySettings = {
            easy: {
                speed: 120, // 毫秒/帧，速度越慢数值越高
                scoreMultiplier: 1,
                growthRate: 1, // 每次吃食物增加的长度
                specialFoodChance: 0.2,
                specialFoodDuration: 12000,
                obstacleCount: 0 // 无障碍物
            },
            medium: {
                speed: 100,
                scoreMultiplier: 1.5,
                growthRate: 1,
                specialFoodChance: 0.15,
                specialFoodDuration: 10000,
                obstacleCount: 5
            },
            hard: {
                speed: 75,
                scoreMultiplier: 2,
                growthRate: 1,
                specialFoodChance: 0.1,
                specialFoodDuration: 8000,
                obstacleCount: 10
            }
        };
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化设置
     */
    init() {
        try {
            // 设置难度选择器
            const difficultySelect = document.getElementById('difficulty-select');
            if (difficultySelect) {
                difficultySelect.value = this.currentSettings.difficulty;
                difficultySelect.addEventListener('change', (e) => {
                    this.setDifficulty(e.target.value);
                    if (window.audioManager) {
                        window.audioManager.playMenuSelectSound();
                    }
                });
            }
            
            // 应用当前设置
            this.applySettings();
        } catch (error) {
            console.error('初始化设置时出错:', error);
        }
    }
    
    /**
     * 加载保存的设置
     * @returns {Object} 设置对象
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('snakeGameSettings');
            if (savedSettings) {
                return { ...this.defaultSettings, ...JSON.parse(savedSettings) };
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
        
        return { ...this.defaultSettings };
    }
    
    /**
     * 保存设置
     */
    saveSettings() {
        try {
            localStorage.setItem('snakeGameSettings', JSON.stringify(this.currentSettings));
        } catch (e) {
            console.error('保存设置失败:', e);
        }
    }
    
    /**
     * 应用当前设置
     */
    applySettings() {
        try {
            // 设置主题
            if (window.graphicsManager) {
                window.graphicsManager.setTheme(this.currentSettings.theme);
            }
            
            // 设置语言
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = this.currentSettings.language;
            }
            
            // 设置声音
            const soundToggle = document.getElementById('sound-toggle');
            if (soundToggle) {
                soundToggle.checked = this.currentSettings.sound;
            }
        } catch (error) {
            console.error('应用设置时出错:', error);
        }
    }
    
    /**
     * 设置难度
     * @param {string} difficulty - 难度级别
     */
    setDifficulty(difficulty) {
        if (['easy', 'medium', 'hard'].includes(difficulty)) {
            this.currentSettings.difficulty = difficulty;
            this.saveSettings();
        }
    }
    
    /**
     * 获取当前难度
     * @returns {string} 当前难度
     */
    getDifficulty() {
        return this.currentSettings.difficulty;
    }
    
    /**
     * 获取当前难度的游戏设置
     * @returns {Object} 难度设置对象
     */
    getDifficultySettings() {
        return this.difficultySettings[this.currentSettings.difficulty];
    }
    
    /**
     * 获取游戏速度
     * @returns {number} 帧间隔(毫秒)
     */
    getGameSpeed() {
        return this.difficultySettings[this.currentSettings.difficulty].speed;
    }
    
    /**
     * 获取障碍物数量
     * @returns {number} 障碍物数量
     */
    getObstacleCount() {
        return this.difficultySettings[this.currentSettings.difficulty].obstacleCount;
    }
    
    /**
     * 生成难度相关的障碍物
     * @param {number} gridWidth - 网格宽度
     * @param {number} gridHeight - 网格高度
     * @returns {Array} 障碍物数组
     */
    generateObstacles(gridWidth, gridHeight) {
        const obstacleCount = this.getObstacleCount();
        const obstacles = [];
        
        // 如果没有障碍物，返回空数组
        if (obstacleCount === 0) return obstacles;
        
        // 定义安全区域，避免在蛇的初始位置附近生成障碍物
        const safeZone = {
            x1: 0, y1: 0,
            x2: 5, y2: 3
        };
        
        // 随机生成障碍物
        for (let i = 0; i < obstacleCount; i++) {
            let position;
            let isValid;
            let attempts = 0;
            
            // 尝试找到有效位置(最多100次尝试)
            do {
                isValid = true;
                position = {
                    x: Math.floor(Math.random() * gridWidth),
                    y: Math.floor(Math.random() * gridHeight)
                };
                
                // 检查是否在安全区域内
                if (
                    position.x >= safeZone.x1 && position.x <= safeZone.x2 &&
                    position.y >= safeZone.y1 && position.y <= safeZone.y2
                ) {
                    isValid = false;
                    continue;
                }
                
                // 检查是否与其他障碍物重叠
                for (const obstacle of obstacles) {
                    if (position.x === obstacle.x && position.y === obstacle.y) {
                        isValid = false;
                        break;
                    }
                }
                
                attempts++;
            } while (!isValid && attempts < 100);
            
            // 如果找到有效位置，添加障碍物
            if (isValid) {
                obstacles.push(position);
            }
        }
        
        return obstacles;
    }
    
    /**
     * 获取生长速率
     * @returns {number} 生长速率
     */
    getGrowthRate() {
        return this.difficultySettings[this.currentSettings.difficulty].growthRate;
    }
    
    /**
     * 获取特殊食物设置
     * @returns {Object} 特殊食物设置
     */
    getSpecialFoodSettings() {
        const { specialFoodChance, specialFoodDuration } = 
            this.difficultySettings[this.currentSettings.difficulty];
        
        return { specialFoodChance, specialFoodDuration };
    }
}

// 创建全局settingsManager实例
window.settingsManager = new Settings();
