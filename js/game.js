/**
 * 游戏主模块 - 整合所有其他模块，实现游戏逻辑
 */
class Game {
    constructor() {
        // 游戏区域尺寸
        this.gridWidth = 20;
        this.gridHeight = 15;
        
        // 游戏组件
        this.snake = null;
        this.food = null;
        this.renderer = null;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameLoopId = null;
        
        // 障碍物数组
        this.obstacles = [];
        
        // 用于防止多个按键在一个循环内改变多次方向
        this.directionChanged = false;
        
        // 初始化游戏
        this.init();
    }
    
    /**
     * 初始化游戏
     */
    init() {
        // 创建游戏组件
        this.snake = new Snake(this.gridWidth, this.gridHeight);
        this.food = new Food(this.gridWidth, this.gridHeight);
        this.renderer = new Renderer('game-canvas');
        
        // 初始化渲染器
        this.renderer.init(this.gridWidth, this.gridHeight);
        
        // 窗口大小改变时，重新调整画布大小
        window.addEventListener('resize', () => {
            if (this.renderer) {
                this.renderer.handleResize();
            }
        });
        
        // 初始页面加载时触发一次调整
        window.addEventListener('load', () => {
            if (this.renderer) {
                setTimeout(() => {
                    this.renderer.handleResize();
                }, 100);
            }
        });
        
        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            // ESC 键用于暂停
            if (e.key === 'Escape' && this.isRunning) {
                if (this.isPaused) {
                    this.resume();
                    ui.showScreen('game');
                } else {
                    this.pause();
                    ui.showScreen('pause');
                }
            }
        });
        
        // 根据难度调整食物设置
        const difficulty = settingsManager.getDifficulty();
        this.food.adjustForDifficulty(difficulty);
        
        // 设置记分板难度
        scoreboard.setDifficulty(difficulty);
        
        // 更新初始分数显示
        scoreboard.updateScoreDisplay();
    }
    
    /**
     * 开始游戏
     */
    start() {
        if (this.isRunning) return;
        
        // 重置游戏状态
        this.reset();
        
        // 标记游戏为运行状态
        this.isRunning = true;
        this.isPaused = false;
        
        // 生成初始食物
        this.food.generate(this.snake.getBody(), this.obstacles);
        
        // 启动游戏循环
        this.startGameLoop();
    }
    
    /**
     * 暂停游戏
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        this.stopGameLoop();
    }
    
    /**
     * 继续游戏
     */
    resume() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.isPaused = false;
        this.startGameLoop();
    }
    
    /**
     * 停止游戏
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.stopGameLoop();
    }
    
    /**
     * 重新开始游戏
     */
    restart() {
        this.stop();
        this.start();
    }
    
    /**
     * 重置游戏状态
     */
    reset() {
        // 重置蛇
        this.snake.reset();
        
        // 重置食物
        this.food.reset();
        
        // 重置分数
        scoreboard.reset();
        
        // 重置输入控制
        inputManager.reset();
        
        // 生成障碍物
        this.obstacles = settingsManager.generateObstacles(this.gridWidth, this.gridHeight);
        
        // 根据当前难度调整食物设置
        const difficulty = settingsManager.getDifficulty();
        this.food.adjustForDifficulty(difficulty);
        
        // 设置记分板难度
        scoreboard.setDifficulty(difficulty);
    }
    
    /**
     * 启动游戏循环
     */
    startGameLoop() {
        // 如果已经有游戏循环在运行，先停止
        if (this.gameLoopId) {
            this.stopGameLoop();
        }
        
        // 获取游戏速度
        const speed = settingsManager.getGameSpeed();
        
        // 创建新的游戏循环
        this.gameLoopId = setInterval(() => {
            this.update();
        }, speed);
    }
    
    /**
     * 停止游戏循环
     */
    stopGameLoop() {
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
        }
    }
    
    /**
     * 更新游戏状态
     */
    update() {
        if (!this.isRunning || this.isPaused) return;
        
        // 获取输入方向
        const direction = inputManager.getDirection();
        inputManager.updateDirection();
        
        // 移动蛇
        this.snake.move(direction);
        
        // 检查是否吃到食物
        if (this.snake.checkFood(this.food.getPosition())) {
            // 吃到食物
            const isSpecial = this.food.isSpecialFood();
            
            // 播放音效
            if (isSpecial) {
                audioManager.playSpecialFoodSound();
            } else {
                audioManager.playFoodSound();
            }
            
            // 增加分数
            scoreboard.calculateScoreFromLength(this.snake.getLength(), isSpecial);
            
            // 生成新食物
            this.food.generate(this.snake.getBody(), this.obstacles);
        }
        
        // 检查碰撞
        if (
            this.snake.checkCollisionWithSelf() || 
            this.snake.checkCollisionWithObstacles(this.obstacles)
        ) {
            // 游戏结束
            this.gameOver();
            return;
        }
        
        // 绘制游戏
        this.render();
    }
    
    /**
     * 渲染游戏
     */
    render() {
        if (!this.renderer) return;
        
        this.renderer.drawGame(
            this.snake,
            this.food,
            this.obstacles,
            scoreboard.getScore(),
            scoreboard.getHighestScore()
        );
    }
    
    /**
     * 游戏结束
     */
    gameOver() {
        // 停止游戏
        this.stop();
        
        // 播放游戏结束音效
        audioManager.playGameOverSound();
        
        // 更新高分记录
        const isNewHighScore = scoreboard.updateHighScores();
        
        // 设置最终蛇长度
        scoreboard.setFinalSnakeLength(this.snake.getLength());
        
        // 更新最终分数显示
        scoreboard.updateFinalScore();
        
        // 在画布上显示游戏结束效果
        this.renderer.drawGameOver();
        
        // 显示游戏结束屏幕
        ui.showGameOver(scoreboard.getScore(), isNewHighScore);
    }
    
    /**
     * 调整游戏大小
     */
    resize() {
        if (this.renderer) {
            this.renderer.handleResize();
        }
    }
}

// 在DOM加载完成后创建游戏实例
document.addEventListener('DOMContentLoaded', () => {
    // 确保等待UI和其他组件准备好
    setTimeout(() => {
        // 创建游戏实例并挂载到全局window对象
        window.game = new Game();
    }, 100);
});

// 添加错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`游戏错误: ${message} at ${source}:${lineno}:${colno}`, error);
    return true;
};
