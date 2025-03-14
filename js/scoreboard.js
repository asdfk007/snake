/**
 * 分数记录模块 - 处理分数计算与记录
 */
class Scoreboard {
    constructor() {
        this.currentScore = 0;
        this.highScores = this.loadHighScores();
        this.currentDifficulty = 'medium'; // 默认难度
    }
    
    /**
     * 加载保存的最高分记录
     */
    loadHighScores() {
        try {
            const savedScores = localStorage.getItem('snakeGameHighScores');
            if (savedScores) {
                return JSON.parse(savedScores);
            }
        } catch (e) {
            console.error('加载最高分失败:', e);
        }
        
        // 如果无法加载或没有保存的分数，创建默认结构
        return {
            easy: [],
            medium: [],
            hard: []
        };
    }
    
    /**
     * 保存最高分记录
     */
    saveHighScores() {
        try {
            localStorage.setItem('snakeGameHighScores', JSON.stringify(this.highScores));
        } catch (e) {
            console.error('保存最高分失败:', e);
        }
    }
    
    /**
     * 增加当前分数
     * @param {number} points - 增加的分数点数
     * @param {boolean} isSpecialFood - 是否特殊食物
     * @returns {number} 增加后的总分
     */
    addScore(points, isSpecialFood = false) {
        // 如果是特殊食物，分数翻倍
        const scoreToAdd = isSpecialFood ? points * 2 : points;
        
        // 根据难度调整得分
        const difficultyMultiplier = this.getDifficultyMultiplier();
        const adjustedScore = Math.floor(scoreToAdd * difficultyMultiplier);
        
        this.currentScore += adjustedScore;
        
        // 更新显示
        this.updateScoreDisplay();
        
        return this.currentScore;
    }
    
    /**
     * 获取难度分数乘数
     * @returns {number} 分数乘数
     */
    getDifficultyMultiplier() {
        switch (this.currentDifficulty) {
            case 'easy': return 1;
            case 'medium': return 1.5;
            case 'hard': return 2;
            default: return 1;
        }
    }
    
    /**
     * 设置当前难度
     * @param {string} difficulty - 难度级别
     */
    setDifficulty(difficulty) {
        if (['easy', 'medium', 'hard'].includes(difficulty)) {
            this.currentDifficulty = difficulty;
        }
    }
    
    /**
     * 获取当前分数
     * @returns {number} 当前分数
     */
    getScore() {
        return this.currentScore;
    }
    
    /**
     * 获取当前难度的最高分
     * @returns {number} 当前难度的最高分
     */
    getHighestScore() {
        const scores = this.highScores[this.currentDifficulty];
        return scores.length > 0 ? scores[0].score : 0;
    }
    
    /**
     * 检查当前分数是否是新的最高分
     * @returns {boolean} 是否是新的最高分
     */
    isNewHighScore() {
        return this.currentScore > this.getHighestScore();
    }
    
    /**
     * 更新最高分记录
     * @returns {boolean} 是否是新的最高分
     */
    updateHighScores() {
        if (this.currentScore <= 0) return false;
        
        const isNew = this.isNewHighScore();
        
        // 添加新记录
        this.highScores[this.currentDifficulty].push({
            score: this.currentScore,
            date: new Date().toISOString(),
            length: null // 可以在游戏结束时设置蛇的长度
        });
        
        // 按分数降序排序
        this.highScores[this.currentDifficulty].sort((a, b) => b.score - a.score);
        
        // 只保留前10个记录
        if (this.highScores[this.currentDifficulty].length > 10) {
            this.highScores[this.currentDifficulty] = this.highScores[this.currentDifficulty].slice(0, 10);
        }
        
        // 保存到本地存储
        this.saveHighScores();
        
        return isNew;
    }
    
    /**
     * 更新分数显示
     */
    updateScoreDisplay() {
        const currentScoreElem = document.getElementById('current-score');
        const highScoreElem = document.getElementById('high-score');
        
        if (currentScoreElem) {
            currentScoreElem.textContent = this.currentScore;
        }
        
        if (highScoreElem) {
            highScoreElem.textContent = this.getHighestScore();
        }
    }
    
    /**
     * 更新最终分数显示
     */
    updateFinalScore() {
        const finalScoreElem = document.getElementById('final-score');
        const newHighScoreElem = document.getElementById('new-high-score');
        
        if (finalScoreElem) {
            finalScoreElem.textContent = this.currentScore;
        }
        
        if (newHighScoreElem) {
            newHighScoreElem.classList.toggle('hidden', !this.isNewHighScore());
        }
    }
    
    /**
     * 重置当前分数
     */
    reset() {
        this.currentScore = 0;
        this.updateScoreDisplay();
    }
    
    /**
     * 更新最高分列表显示
     * @param {string} difficulty - 难度级别
     */
    updateHighScoresList(difficulty = null) {
        // 如果没有指定难度，使用当前难度
        const selectedDifficulty = difficulty || this.currentDifficulty;
        
        // 获取高分列表容器
        const listContainer = document.getElementById('high-scores-list');
        if (!listContainer) return;
        
        // 清空当前列表
        listContainer.innerHTML = '';
        
        // 获取指定难度的分数
        const scores = this.highScores[selectedDifficulty];
        
        if (scores.length === 0) {
            // 如果没有记录
            const noScoreItem = document.createElement('div');
            noScoreItem.className = 'score-item';
            noScoreItem.innerHTML = `<span>${i18n.t('noScores')}</span>`;
            listContainer.appendChild(noScoreItem);
        } else {
            // 添加所有记录
            scores.forEach((score, index) => {
                const scoreItem = document.createElement('div');
                scoreItem.className = 'score-item';
                
                // 格式化日期
                const date = new Date(score.date);
                const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                
                scoreItem.innerHTML = `
                    <span>${index + 1}. ${score.score}</span>
                    <span>${formattedDate}</span>
                `;
                
                listContainer.appendChild(scoreItem);
            });
        }
    }
    
    /**
     * 根据蛇的长度计算分数
     * @param {number} length - 蛇的长度
     * @param {boolean} isSpecialFood - 是否特殊食物
     * @returns {number} 计算的分数
     */
    calculateScoreFromLength(length, isSpecialFood) {
        // 基础分 = 蛇长度 * 10
        const baseScore = length * 10;
        
        return this.addScore(baseScore, isSpecialFood);
    }
    
    /**
     * 设置蛇的最终长度
     * @param {number} length - 蛇的最终长度
     */
    setFinalSnakeLength(length) {
        if (this.highScores[this.currentDifficulty].length > 0) {
            // 设置最新记录的蛇长度
            this.highScores[this.currentDifficulty][0].length = length;
            this.saveHighScores();
        }
    }
}

// 创建全局scoreboard实例
window.scoreboard = new Scoreboard();
