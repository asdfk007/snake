/**
 * 渲染器模块 - 使用Canvas API绘制游戏画面
 */
class Renderer {
    constructor(canvasId) {
        // 获取Canvas元素
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 设置默认网格尺寸
        this.gridWidth = 20;
        this.gridHeight = 15;
        this.cellSize = 20; // 每个格子的像素大小
        
        // 是否已调整大小
        this.resized = false;
    }
    
    /**
     * 初始化渲染器
     * @param {number} gridWidth - 网格宽度
     * @param {number} gridHeight - 网格高度
     */
    init(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.adjustCanvasSize();
    }
    
    /**
     * 调整Canvas大小
     */
    adjustCanvasSize() {
        // 获取游戏屏幕容器
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        
        // 计算可用空间
        const padding = 30; // 留出边距
        const headerHeight = document.querySelector('.game-header').offsetHeight;
        const footerHeight = document.querySelector('.game-footer').offsetHeight;
        const mobileControls = document.querySelector('.mobile-controls');
        const mobileControlsHeight = mobileControls ? mobileControls.offsetHeight : 0;
        
        const availableWidth = gameScreen.clientWidth - padding * 2;
        const availableHeight = gameScreen.clientHeight - headerHeight - footerHeight - mobileControlsHeight - padding * 2;
        
        // 计算每个单元格的最大尺寸
        const maxCellWidth = Math.floor(availableWidth / this.gridWidth);
        const maxCellHeight = Math.floor(availableHeight / this.gridHeight);
        
        // 设置单元格大小为两者较小值
        this.cellSize = Math.max(Math.min(maxCellWidth, maxCellHeight), 10);
        
        // 设置Canvas大小
        this.canvas.width = this.gridWidth * this.cellSize;
        this.canvas.height = this.gridHeight * this.cellSize;
        
        this.resized = true;
    }
    
    /**
     * 清除画布
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 绘制网格背景
     */
    drawGrid() {
        const gridPattern = graphicsManager.createGridPattern(this.cellSize);
        this.ctx.fillStyle = gridPattern || '#eceff1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 绘制蛇
     * @param {Snake} snake - 蛇对象
     */
    drawSnake(snake) {
        const body = snake.getBody();
        
        // 遍历蛇的每个身体部分
        for (let i = 0; i < body.length; i++) {
            const segment = body[i];
            const renderInfo = snake.getSegmentRenderInfo(i);
            
            // 绘制蛇身
            if (renderInfo.type === 'head') {
                // 绘制头部
                const headPattern = graphicsManager.createSnakeHeadPattern(this.cellSize, renderInfo.direction);
                this.ctx.drawImage(
                    headPattern, 
                    segment.x * this.cellSize, 
                    segment.y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                
            } else if (renderInfo.type === 'corner') {
                // 绘制拐角
                const cornerPattern = graphicsManager.createSnakeBodyPattern(this.cellSize, true, renderInfo.direction);
                this.ctx.drawImage(
                    cornerPattern, 
                    segment.x * this.cellSize, 
                    segment.y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                
            } else {
                // 绘制身体直线部分
                const bodyPattern = graphicsManager.createSnakeBodyPattern(this.cellSize, false);
                this.ctx.drawImage(
                    bodyPattern, 
                    segment.x * this.cellSize, 
                    segment.y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }
    
    /**
     * 绘制食物
     * @param {Food} food - 食物对象
     */
    drawFood(food) {
        const position = food.getPosition();
        const isSpecial = food.isSpecialFood();
        
        // 获取食物图案
        const foodPattern = graphicsManager.createFoodPattern(this.cellSize, isSpecial);
        
        // 绘制食物
        this.ctx.drawImage(
            foodPattern,
            position.x * this.cellSize,
            position.y * this.cellSize,
            this.cellSize,
            this.cellSize
        );
    }
    
    /**
     * 绘制障碍物
     * @param {Array} obstacles - 障碍物数组
     */
    drawObstacles(obstacles) {
        // 获取障碍物图案
        const obstaclePattern = graphicsManager.createObstaclePattern(this.cellSize);
        
        // 绘制每个障碍物
        for (const obstacle of obstacles) {
            this.ctx.drawImage(
                obstaclePattern,
                obstacle.x * this.cellSize,
                obstacle.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
        }
    }
    
    /**
     * 绘制分数
     * @param {number} score - 当前分数
     * @param {number} highScore - 最高分
     */
    drawScore(score, highScore) {
        const currentScoreElem = document.getElementById('current-score');
        const highScoreElem = document.getElementById('high-score');
        
        if (currentScoreElem) currentScoreElem.textContent = score;
        if (highScoreElem) highScoreElem.textContent = highScore;
    }
    
    /**
     * 绘制整个游戏场景
     * @param {Snake} snake - 蛇对象
     * @param {Food} food - 食物对象
     * @param {Array} obstacles - 障碍物数组
     * @param {number} score - 当前分数
     * @param {number} highScore - 最高分
     */
    drawGame(snake, food, obstacles, score, highScore) {
        // 如果窗口大小改变，重新调整Canvas大小
        if (!this.resized) {
            this.adjustCanvasSize();
        }
        
        // 清除画布
        this.clear();
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制障碍物
        this.drawObstacles(obstacles);
        
        // 绘制食物
        this.drawFood(food);
        
        // 绘制蛇
        this.drawSnake(snake);
        
        // 绘制分数
        this.drawScore(score, highScore);
    }
    
    /**
     * 绘制游戏结束效果
     */
    drawGameOver() {
        // 创建半透明覆盖层
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制结束文字
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 30px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            i18n.t('gameOver'), 
            this.canvas.width / 2, 
            this.canvas.height / 2
        );
    }
    
    /**
     * 响应窗口大小变化
     */
    handleResize() {
        this.resized = false;
        this.adjustCanvasSize();
    }
}
