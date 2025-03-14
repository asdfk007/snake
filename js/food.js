/**
 * 食物模块 - 处理游戏食物生成和管理
 */
class Food {
    constructor(gridWidth, gridHeight) {
        // 网格尺寸
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        
        // 食物位置
        this.position = { x: 0, y: 0 };
        
        // 特殊食物标志
        this.isSpecial = false;
        
        // 特殊食物计时器
        this.specialFoodTimer = null;
        
        // 特殊食物出现概率
        this.specialFoodChance = 0.15; // 15%几率产生特殊食物
        
        // 特殊食物持续时间(毫秒)
        this.specialFoodDuration = 10000;
    }
    
    /**
     * 生成新的食物位置
     * @param {Array} snakeBody - 蛇身体数组
     * @param {Array} obstacles - 障碍物数组
     */
    generate(snakeBody, obstacles = []) {
        // 清除之前的特殊食物计时器
        if (this.specialFoodTimer) {
            clearTimeout(this.specialFoodTimer);
            this.specialFoodTimer = null;
        }
        
        // 创建一个包含所有占用位置的数组
        const occupiedPositions = [
            ...snakeBody.map(segment => `${segment.x},${segment.y}`),
            ...obstacles.map(obstacle => `${obstacle.x},${obstacle.y}`)
        ];
        
        // 计算可用位置数量
        const totalPositions = this.gridWidth * this.gridHeight;
        const availablePositions = totalPositions - occupiedPositions.length;
        
        if (availablePositions <= 0) {
            // 没有可用位置，游戏应该结束
            console.warn('没有可用的食物位置');
            return false;
        }
        
        // 随机选择一个可用位置的索引
        const randomIndex = Math.floor(Math.random() * availablePositions);
        
        // 找到对应的位置
        let index = 0;
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const posKey = `${x},${y}`;
                if (!occupiedPositions.includes(posKey)) {
                    if (index === randomIndex) {
                        this.position = { x, y };
                        
                        // 决定是否是特殊食物
                        this.isSpecial = Math.random() < this.specialFoodChance;
                        
                        // 如果是特殊食物，设置计时器
                        if (this.isSpecial) {
                            this.specialFoodTimer = setTimeout(() => {
                                this.isSpecial = false;
                                this.specialFoodTimer = null;
                                // 可以触发一个事件通知渲染器更新
                            }, this.specialFoodDuration);
                        }
                        
                        return true;
                    }
                    index++;
                }
            }
        }
        
        return false;
    }
    
    /**
     * 检查是否是特殊食物
     * @returns {boolean} 是否特殊食物
     */
    isSpecialFood() {
        return this.isSpecial;
    }
    
    /**
     * 获取食物位置
     * @returns {Object} 食物坐标
     */
    getPosition() {
        return this.position;
    }
    
    /**
     * 根据难度调整特殊食物概率和持续时间
     * @param {string} difficulty - 难度级别
     */
    adjustForDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.specialFoodChance = 0.2; // 20%
                this.specialFoodDuration = 12000; // 12秒
                break;
            case 'medium':
                this.specialFoodChance = 0.15; // 15%
                this.specialFoodDuration = 10000; // 10秒
                break;
            case 'hard':
                this.specialFoodChance = 0.1; // 10%
                this.specialFoodDuration = 8000; // 8秒
                break;
        }
    }
    
    /**
     * 重置食物状态
     */
    reset() {
        if (this.specialFoodTimer) {
            clearTimeout(this.specialFoodTimer);
            this.specialFoodTimer = null;
        }
        this.isSpecial = false;
    }
}
