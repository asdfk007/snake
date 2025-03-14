/**
 * 图形生成模块 - 使用Canvas API创建游戏视觉元素
 */
class GraphicsManager {
    constructor() {
        // 当前主题
        this.theme = this.getSavedTheme() || 'light';
        
        // 图形缓存
        this.cache = {
            gridPattern: null,
            snakeHeadPattern: {},
            snakeBodyPattern: {},
            foodPattern: {},
            specialFoodPattern: {},
            obstaclePattern: {}
        };
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化图形管理器
     */
    init() {
        // 应用主题
        document.body.setAttribute('data-theme', this.theme);
        
        // 设置主题选择器
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.theme === this.theme);
            btn.addEventListener('click', () => {
                this.setTheme(btn.dataset.theme);
                // 更新选中状态
                themeButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                audioManager.playButtonSound();
            });
        });
        
        // 清除缓存，需要重新创建图形
        this.clearCache();
    }
    
    /**
     * 获取保存的主题
     */
    getSavedTheme() {
        return localStorage.getItem('snakeGameTheme');
    }
    
    /**
     * 设置主题
     * @param {string} theme - 主题名称
     */
    setTheme(theme) {
        if (['light', 'dark', 'colorful'].includes(theme)) {
            this.theme = theme;
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('snakeGameTheme', theme);
            
            // 主题改变时清除缓存，需要重新创建图形
            this.clearCache();
        }
    }
    
    /**
     * 清除图形缓存
     */
    clearCache() {
        for (const key in this.cache) {
            if (typeof this.cache[key] === 'object' && this.cache[key] !== null) {
                if (Array.isArray(this.cache[key])) {
                    this.cache[key] = [];
                } else {
                    this.cache[key] = {};
                }
            } else {
                this.cache[key] = null;
            }
        }
    }
    
    /**
     * 获取CSS变量值
     * @param {string} name - CSS变量名称
     * @returns {string} CSS变量值
     */
    getCssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    
    /**
     * 创建离屏Canvas
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @returns {HTMLCanvasElement} Canvas元素
     */
    createOffscreenCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
    
    /**
     * 创建网格图案
     * @param {number} cellSize - 单元格大小
     * @returns {CanvasPattern} 网格图案
     */
    createGridPattern(cellSize) {
        if (this.cache.gridPattern) {
            return this.cache.gridPattern;
        }
        
        const canvas = this.createOffscreenCanvas(cellSize, cellSize);
        const ctx = canvas.getContext('2d');
        
        const gridColor = this.getCssVar('--grid-color');
        const bgColor = this.getCssVar('--bg-color');
        
        // 填充背景
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cellSize, cellSize);
        
        // 绘制网格线
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, cellSize);
        ctx.moveTo(0, 0);
        ctx.lineTo(cellSize, 0);
        ctx.stroke();
        
        // 创建并缓存图案
        const pattern = ctx.createPattern(canvas, 'repeat');
        this.cache.gridPattern = pattern;
        
        return pattern;
    }
    
    /**
     * 创建蛇头图案
     * @param {number} cellSize - 单元格大小
     * @param {string} direction - 方向 ('up', 'down', 'left', 'right')
     * @returns {HTMLCanvasElement} 蛇头Canvas
     */
    createSnakeHeadPattern(cellSize, direction) {
        if (this.cache.snakeHeadPattern[direction]) {
            return this.cache.snakeHeadPattern[direction];
        }
        
        const canvas = this.createOffscreenCanvas(cellSize, cellSize);
        const ctx = canvas.getContext('2d');
        
        const snakeColor = this.getCssVar('--snake-color');
        const padding = cellSize * 0.05;
        const eyeSize = cellSize * 0.15;
        const headRadius = (cellSize - padding * 2) / 2;
        
        // 绘制头部圆形
        ctx.fillStyle = snakeColor;
        ctx.beginPath();
        ctx.arc(cellSize / 2, cellSize / 2, headRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 根据方向设置眼睛位置
        let eyeX1, eyeY1, eyeX2, eyeY2;
        
        switch (direction) {
            case 'up':
                eyeX1 = cellSize / 2 - eyeSize * 1.5;
                eyeY1 = cellSize / 2 - eyeSize * 1.5;
                eyeX2 = cellSize / 2 + eyeSize * 1.5;
                eyeY2 = cellSize / 2 - eyeSize * 1.5;
                break;
            case 'down':
                eyeX1 = cellSize / 2 - eyeSize * 1.5;
                eyeY1 = cellSize / 2 + eyeSize * 1.5;
                eyeX2 = cellSize / 2 + eyeSize * 1.5;
                eyeY2 = cellSize / 2 + eyeSize * 1.5;
                break;
            case 'left':
                eyeX1 = cellSize / 2 - eyeSize * 1.5;
                eyeY1 = cellSize / 2 - eyeSize * 1.5;
                eyeX2 = cellSize / 2 - eyeSize * 1.5;
                eyeY2 = cellSize / 2 + eyeSize * 1.5;
                break;
            case 'right':
                eyeX1 = cellSize / 2 + eyeSize * 1.5;
                eyeY1 = cellSize / 2 - eyeSize * 1.5;
                eyeX2 = cellSize / 2 + eyeSize * 1.5;
                eyeY2 = cellSize / 2 + eyeSize * 1.5;
                break;
        }
        
        // 绘制眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼球
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeSize / 2, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, eyeSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 缓存图案
        this.cache.snakeHeadPattern[direction] = canvas;
        
        return canvas;
    }
    
    /**
     * 创建蛇身图案
     * @param {number} cellSize - 单元格大小
     * @param {boolean} isCorner - 是否拐角部分
     * @param {string} direction - 方向组合 (用于拐角: 'up-right', 'right-down'等)
     * @returns {HTMLCanvasElement} 蛇身Canvas
     */
    createSnakeBodyPattern(cellSize, isCorner, direction) {
        const key = isCorner ? `corner-${direction}` : 'body';
        if (this.cache.snakeBodyPattern[key]) {
            return this.cache.snakeBodyPattern[key];
        }
        
        const canvas = this.createOffscreenCanvas(cellSize, cellSize);
        const ctx = canvas.getContext('2d');
        
        const snakeColor = this.getCssVar('--snake-color');
        const padding = cellSize * 0.1;
        const size = cellSize - padding * 2;
        
        ctx.fillStyle = snakeColor;
        
        if (!isCorner) {
            // 简单的圆角矩形用于直线部分
            ctx.beginPath();
            ctx.roundRect(padding, padding, size, size, size / 4);
            ctx.fill();
        } else {
            // 绘制拐角部分
            let startX, startY, endX, endY;
            
            // 根据连接方向设置起止点
            switch(direction) {
                case 'up-right':
                case 'right-up':
                    startX = cellSize / 2;
                    startY = cellSize - padding;
                    endX = cellSize - padding;
                    endY = cellSize / 2;
                    break;
                case 'right-down':
                case 'down-right':
                    startX = padding;
                    startY = cellSize / 2;
                    endX = cellSize / 2;
                    endY = cellSize - padding;
                    break;
                case 'down-left':
                case 'left-down':
                    startX = cellSize / 2;
                    startY = padding;
                    endX = padding;
                    endY = cellSize / 2;
                    break;
                case 'left-up':
                case 'up-left':
                    startX = cellSize - padding;
                    startY = cellSize / 2;
                    endX = cellSize / 2;
                    endY = padding;
                    break;
                default:
                    // 默认为垂直部分
                    ctx.fillRect(padding, 0, size, cellSize);
                    break;
            }
            
            // 绘制连接线
            ctx.beginPath();
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.strokeStyle = snakeColor;
            ctx.moveTo(startX, startY);
            ctx.lineTo(cellSize / 2, cellSize / 2);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        // 缓存图案
        this.cache.snakeBodyPattern[key] = canvas;
        
        return canvas;
    }
    
    /**
     * 创建食物图案
     * @param {number} cellSize - 单元格大小
     * @param {boolean} isSpecial - 是否特殊食物
     * @returns {HTMLCanvasElement} 食物Canvas
     */
    createFoodPattern(cellSize, isSpecial) {
        const key = isSpecial ? 'special' : 'normal';
        if (this.cache.foodPattern[key]) {
            return this.cache.foodPattern[key];
        }
        
        const canvas = this.createOffscreenCanvas(cellSize, cellSize);
        const ctx = canvas.getContext('2d');
        
        const foodColor = isSpecial ? 
            this.getCssVar('--special-food-color') : 
            this.getCssVar('--food-color');
        const padding = cellSize * 0.15;
        const radius = (cellSize - padding * 2) / 2;
        
        // 创建渐变
        const gradient = ctx.createRadialGradient(
            cellSize / 2, cellSize / 2, radius * 0.2,
            cellSize / 2, cellSize / 2, radius
        );
        gradient.addColorStop(0, isSpecial ? '#e91e63' : '#e53935');
        gradient.addColorStop(1, foodColor);
        
        // 绘制圆形
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cellSize / 2, cellSize / 2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(cellSize * 0.35, cellSize * 0.35, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 如果是特殊食物，添加星形
        if (isSpecial) {
            this.drawStar(ctx, cellSize / 2, cellSize / 2, 5, radius * 0.6, radius * 0.3);
        }
        
        // 缓存图案
        this.cache.foodPattern[key] = canvas;
        
        return canvas;
    }
    
    /**
     * 绘制星形
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} cx - 中心x坐标
     * @param {number} cy - 中心y坐标
     * @param {number} spikes - 星形尖角数量
     * @param {number} outerRadius - 外半径
     * @param {number} innerRadius - 内半径
     */
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * 创建障碍物图案
     * @param {number} cellSize - 单元格大小
     * @returns {HTMLCanvasElement} 障碍物Canvas
     */
    createObstaclePattern(cellSize) {
        if (this.cache.obstaclePattern.basic) {
            return this.cache.obstaclePattern.basic;
        }
        
        const canvas = this.createOffscreenCanvas(cellSize, cellSize);
        const ctx = canvas.getContext('2d');
        
        const obstacleColor = this.getCssVar('--obstacle-color');
        const padding = cellSize * 0.1;
        const size = cellSize - padding * 2;
        
        // 绘制主体
        ctx.fillStyle = obstacleColor;
        ctx.fillRect(padding, padding, size, size);
        
        // 添加纹理
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        
        // 随机线条
        for (let i = 0; i < 4; i++) {
            const x1 = padding + Math.random() * size;
            const y1 = padding + Math.random() * size;
            const x2 = padding + Math.random() * size;
            const y2 = padding + Math.random() * size;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // 缓存图案
        this.cache.obstaclePattern.basic = canvas;
        
        return canvas;
    }
    
    /**
     * 检查初始化状态
     */
    checkInitStatus() {
        if (!this.initialized) {
            this.init();
            this.updateThemeButtonStates();
        }
    }
    
    /**
     * 更新主题按钮状态
     */
    updateThemeButtonStates() {
        // 清除所有选中状态
        this.themeButtons.forEach(btn => btn.classList.remove('selected'));
        
        // 设置当前主题按钮选中
        const currentBtn = Array.from(this.themeButtons).find(
            btn => btn.dataset.theme === this.currentTheme
        );
        
        if (currentBtn) {
            currentBtn.classList.add('selected');
        }
    }
}

// 创建全局图形管理器实例
window.graphicsManager = new GraphicsManager();

// 确保DOM加载完成后检查初始化状态
document.addEventListener('DOMContentLoaded', () => {
    console.log('图形模块检查初始化状态');
    
    // 确保主题选择器正确设置
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons.length > 0) {
        // 更新主题按钮的选中状态
        themeButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.theme === window.graphicsManager.theme);
        });
        
        console.log('主题按钮状态已更新');
    }
});
