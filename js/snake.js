/**
 * 蛇模块 - 处理蛇的移动和状态
 */
class Snake {
    constructor(gridWidth, gridHeight) {
        // 网格尺寸
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        
        // 蛇身体，数组中第一个元素是蛇头
        this.body = [
            { x: 3, y: 1 }, // 头部
            { x: 2, y: 1 }, // 身体
            { x: 1, y: 1 }  // 尾部
        ];
        
        // 默认移动方向
        this.direction = 'right';
        
        // 上次移动方向
        this.lastDirection = 'right';
        
        // 是否刚刚吃到食物
        this.justAte = false;
    }
    
    /**
     * 移动蛇
     * @param {string} direction - 移动方向
     * @returns {Object} 新的头部位置
     */
    move(direction) {
        // 更新方向
        this.lastDirection = this.direction;
        this.direction = direction;
        
        // 获取当前头部
        const head = this.body[0];
        
        // 根据方向计算新头部位置
        const newHead = { ...head }; // 复制头部
        
        switch(direction) {
            case 'up':
                newHead.y -= 1;
                break;
            case 'down':
                newHead.y += 1;
                break;
            case 'left':
                newHead.x -= 1;
                break;
            case 'right':
                newHead.x += 1;
                break;
        }
        
        // 实现穿墙
        if (newHead.x < 0) newHead.x = this.gridWidth - 1;
        if (newHead.x >= this.gridWidth) newHead.x = 0;
        if (newHead.y < 0) newHead.y = this.gridHeight - 1;
        if (newHead.y >= this.gridHeight) newHead.y = 0;
        
        // 将新头部添加到蛇身前端
        this.body.unshift(newHead);
        
        // 如果没有吃到食物，移除尾部
        if (!this.justAte) {
            this.body.pop();
        } else {
            this.justAte = false;
        }
        
        return newHead;
    }
    
    /**
     * 检查是否碰到自己
     * @returns {boolean} 是否碰到自己
     */
    checkCollisionWithSelf() {
        const head = this.body[0];
        
        // 从第二个身体段开始检查
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 检查是否碰到障碍物
     * @param {Array} obstacles - 障碍物数组
     * @returns {boolean} 是否碰到障碍物
     */
    checkCollisionWithObstacles(obstacles) {
        const head = this.body[0];
        
        for (const obstacle of obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 检查是否吃到食物
     * @param {Object} foodPosition - 食物位置
     * @returns {boolean} 是否吃到食物
     */
    checkFood(foodPosition) {
        const head = this.body[0];
        
        if (head.x === foodPosition.x && head.y === foodPosition.y) {
            this.justAte = true;
            return true;
        }
        
        return false;
    }
    
    /**
     * 获取蛇头位置
     * @returns {Object} 蛇头位置
     */
    getHead() {
        return this.body[0];
    }
    
    /**
     * 获取蛇身体数组
     * @returns {Array} 蛇身体数组
     */
    getBody() {
        return this.body;
    }
    
    /**
     * 获取蛇长度
     * @returns {number} 蛇长度
     */
    getLength() {
        return this.body.length;
    }
    
    /**
     * 获取当前方向
     * @returns {string} 当前方向
     */
    getDirection() {
        return this.direction;
    }
    
    /**
     * 获取上次移动方向
     * @returns {string} 上次方向
     */
    getLastDirection() {
        return this.lastDirection;
    }
    
    /**
     * 重置蛇的状态
     */
    reset() {
        this.body = [
            { x: 3, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 1 }
        ];
        this.direction = 'right';
        this.lastDirection = 'right';
        this.justAte = false;
    }
    
    /**
     * 获取蛇身体某段的渲染类型
     * @param {number} index - 身体段索引
     * @returns {Object} 渲染类型信息
     */
    getSegmentRenderInfo(index) {
        // 如果是头部
        if (index === 0) {
            return {
                type: 'head',
                direction: this.direction
            };
        }
        
        // 如果是尾部
        if (index === this.body.length - 1) {
            return {
                type: 'tail',
                direction: this.getSegmentDirection(index, index - 1)
            };
        }
        
        // 获取当前段与前后段的相对位置
        const prev = this.body[index - 1]; // 前一段
        const current = this.body[index];  // 当前段
        const next = this.body[index + 1]; // 后一段
        
        // 计算前一段与当前段的相对方向
        const dirFromPrev = this.getSegmentDirection(index - 1, index);
        
        // 计算当前段与后一段的相对方向
        const dirToNext = this.getSegmentDirection(index, index + 1);
        
        // 如果方向相同，则是直线部分
        if (dirFromPrev === dirToNext) {
            return {
                type: 'body',
                direction: dirFromPrev
            };
        }
        
        // 否则是拐角
        return {
            type: 'corner',
            direction: `${dirFromPrev}-${dirToNext}`
        };
    }
    
    /**
     * 获取两个身体段间的方向
     * @param {number} fromIndex - 起始段索引
     * @param {number} toIndex - 目标段索引
     * @returns {string} 方向
     */
    getSegmentDirection(fromIndex, toIndex) {
        const from = this.body[fromIndex];
        const to = this.body[toIndex];
        
        // 处理穿墙情况
        let dx = to.x - from.x;
        let dy = to.y - from.y;
        
        // 水平穿墙检测
        if (Math.abs(dx) > 1) {
            dx = dx > 0 ? -1 : 1;
        }
        
        // 垂直穿墙检测
        if (Math.abs(dy) > 1) {
            dy = dy > 0 ? -1 : 1;
        }
        
        if (dx === 1 || (dx === -1 && Math.abs(dy) < Math.abs(dx))) {
            return 'right';
        } else if (dx === -1 || (dx === 1 && Math.abs(dy) < Math.abs(dx))) {
            return 'left';
        } else if (dy === 1 || (dy === -1 && Math.abs(dx) < Math.abs(dy))) {
            return 'down';
        } else {
            return 'up';
        }
    }
}
