/**
 * 输入控制模块 - 处理键盘、触摸和手柄输入
 */
class InputManager {
    constructor() {
        // 当前方向
        this.currentDirection = 'right';
        // 下一个方向(用于防止快速连续按键导致蛇掉头)
        this.nextDirection = 'right';
        // 防止连续按键标志
        this.isChangingDirection = false;
        // 触摸起点
        this.touchStartX = 0;
        this.touchStartY = 0;
        // 是否已连接手柄
        this.gamepadConnected = false;
        // 手柄轮询标识符
        this.gamepadLoopId = null;
        // 手柄按钮状态
        this.gamepadButtonPressed = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // 方向反向映射
        this.oppositeDirections = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化输入监听器
     */
    init() {
        console.log('输入模块初始化');
        
        // 键盘事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // 触摸事件
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        
        // DOM可能还没完全加载，使用DOMContentLoaded确保元素存在
        document.addEventListener('DOMContentLoaded', () => {
            // 虚拟方向按钮
            const upBtn = document.getElementById('up-btn');
            const downBtn = document.getElementById('down-btn');
            const leftBtn = document.getElementById('left-btn');
            const rightBtn = document.getElementById('right-btn');
            
            if (upBtn) upBtn.addEventListener('click', () => this.setDirection('up'));
            if (downBtn) downBtn.addEventListener('click', () => this.setDirection('down'));
            if (leftBtn) leftBtn.addEventListener('click', () => this.setDirection('left'));
            if (rightBtn) rightBtn.addEventListener('click', () => this.setDirection('right'));
            
            console.log('方向按钮事件监听器已添加');
        });
        
        // 手柄连接事件
        window.addEventListener('gamepadconnected', this.handleGamepadConnected.bind(this));
        window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected.bind(this));
        
        // 检查是否已有手柄连接
        this.checkForGamepads();
        
        // 添加触摸屏幕上的方向按钮事件监听器
        this.setupDirectionButtons();
        
        // 初始化游戏手柄支持
        this.setupGamepad();
        
        // 设置键盘控制
        this.setupKeyboard();
    }
    
    /**
     * 重置输入状态
     */
    reset() {
        this.currentDirection = 'right';
        this.nextDirection = 'right';
        this.isChangingDirection = false;
    }
    
    /**
     * 处理键盘输入
     * @param {KeyboardEvent} event - 键盘事件
     */
    handleKeyDown(event) {
        // 只在游戏屏幕处于活跃状态时响应方向键
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen.classList.contains('hidden')) return;
        
        // 阻止箭头键滚动页面
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }
        
        // 空格键用于暂停
        if (event.code === 'Space') {
            const pauseBtn = document.getElementById('pause-btn');
            if (pauseBtn) pauseBtn.click();
            return;
        }
        
        let newDirection;
        
        // 支持箭头键和WASD两种控制方式
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                newDirection = 'up';
                break;
            case 'ArrowDown':
            case 'KeyS':
                newDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'KeyA':
                newDirection = 'left';
                break;
            case 'ArrowRight':
            case 'KeyD':
                newDirection = 'right';
                break;
            default:
                return; // 忽略其他按键
        }
        
        this.setDirection(newDirection);
    }
    
    /**
     * 处理触摸开始事件
     * @param {TouchEvent} event - 触摸事件
     */
    handleTouchStart(event) {
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen.classList.contains('hidden')) return;
        
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }
    
    /**
     * 处理触摸移动事件
     * @param {TouchEvent} event - 触摸事件
     */
    handleTouchMove(event) {
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen.classList.contains('hidden')) return;
        
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touch = event.touches[0];
        const diffX = touch.clientX - this.touchStartX;
        const diffY = touch.clientY - this.touchStartY;
        
        // 只有当移动距离足够大时才改变方向
        const minSwipeDistance = 30;
        
        if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) return;
        
        let newDirection;
        
        // 确定是水平滑动还是垂直滑动
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 水平滑动
            newDirection = diffX > 0 ? 'right' : 'left';
        } else {
            // 垂直滑动
            newDirection = diffY > 0 ? 'down' : 'up';
        }
        
        this.setDirection(newDirection);
        
        // 重置起点，避免多次触发
        this.touchStartX = null;
        this.touchStartY = null;
    }
    
    /**
     * 检查是否已有手柄连接
     */
    checkForGamepads() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                this.gamepadConnected = true;
                this.startGamepadPolling();
                break;
            }
        }
    }
    
    /**
     * 处理手柄连接事件
     */
    handleGamepadConnected(event) {
        this.gamepadConnected = true;
        this.gamepadIndex = event.gamepad.index;
    }
    
    /**
     * 处理手柄断开事件
     */
    handleGamepadDisconnected() {
        this.gamepadConnected = false;
        this.gamepadIndex = null;
    }
    
    /**
     * 开始手柄轮询
     */
    startGamepadPolling() {
        if (!this.gamepadLoopId) {
            this.gamepadLoopId = setInterval(this.pollGamepads.bind(this), 100);
        }
    }
    
    /**
     * 停止手柄轮询
     */
    stopGamepadPolling() {
        if (this.gamepadLoopId) {
            clearInterval(this.gamepadLoopId);
            this.gamepadLoopId = null;
        }
    }
    
    /**
     * 轮询手柄状态
     */
    pollGamepads() {
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen.classList.contains('hidden')) return;
        
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        if (!gamepads.length) return;
        
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (!gamepad) continue;
            
            // 检测手柄方向按钮或摇杆
            let direction = null;
            
            // 十字键检测 (由于不同手柄布局不同，使用常见映射)
            // 通常: 12=上, 13=下, 14=左, 15=右
            if (gamepad.buttons[12] && gamepad.buttons[12].pressed && !this.gamepadButtonPressed.up) {
                direction = 'up';
                this.gamepadButtonPressed.up = true;
            } else if (!gamepad.buttons[12] || !gamepad.buttons[12].pressed) {
                this.gamepadButtonPressed.up = false;
            }
            
            if (gamepad.buttons[13] && gamepad.buttons[13].pressed && !this.gamepadButtonPressed.down) {
                direction = 'down';
                this.gamepadButtonPressed.down = true;
            } else if (!gamepad.buttons[13] || !gamepad.buttons[13].pressed) {
                this.gamepadButtonPressed.down = false;
            }
            
            if (gamepad.buttons[14] && gamepad.buttons[14].pressed && !this.gamepadButtonPressed.left) {
                direction = 'left';
                this.gamepadButtonPressed.left = true;
            } else if (!gamepad.buttons[14] || !gamepad.buttons[14].pressed) {
                this.gamepadButtonPressed.left = false;
            }
            
            if (gamepad.buttons[15] && gamepad.buttons[15].pressed && !this.gamepadButtonPressed.right) {
                direction = 'right';
                this.gamepadButtonPressed.right = true;
            } else if (!gamepad.buttons[15] || !gamepad.buttons[15].pressed) {
                this.gamepadButtonPressed.right = false;
            }
            
            // 摇杆检测 (axes[0]是水平，axes[1]是垂直)
            const axisThreshold = 0.5; // 摇杆倾斜阈值
            
            if (gamepad.axes[0] <= -axisThreshold) {
                direction = 'left';
            } else if (gamepad.axes[0] >= axisThreshold) {
                direction = 'right';
            }
            
            if (gamepad.axes[1] <= -axisThreshold) {
                direction = 'up';
            } else if (gamepad.axes[1] >= axisThreshold) {
                direction = 'down';
            }
            
            // 设置方向
            if (direction !== null) {
                this.setDirection(direction);
            }
            
            // 检测暂停按钮 (通常是Start按钮)
            if (gamepad.buttons[9] && gamepad.buttons[9].pressed) {
                const pauseBtn = document.getElementById('pause-btn');
                if (pauseBtn) pauseBtn.click();
            }
        }
    }
    
    /**
     * 设置方向
     * @param {string} newDirection - 新方向
     * @returns {boolean} 方向是否改变
     */
    setDirection(newDirection) {
        // 防止连续按键导致在同一个更新周期内多次改变方向
        if (this.isChangingDirection) return false;
        
        // 阻止掉头
        if (newDirection === this.oppositeDirections[this.currentDirection]) {
            return false;
        }
        
        this.isChangingDirection = true;
        this.nextDirection = newDirection;
        audioManager.playDirectionChangeSound();
        return true;
    }
    
    /**
     * 更新蛇的方向
     */
    updateDirection() {
        this.currentDirection = this.nextDirection;
        this.isChangingDirection = false;
    }
    
    /**
     * 获取当前方向
     * @returns {string} 当前方向
     */
    getDirection() {
        return this.currentDirection;
    }
    
    /**
     * 设置方向按钮
     */
    setupDirectionButtons() {
        // 获取方向按钮元素
        this.upBtn = document.getElementById('up-btn');
        this.downBtn = document.getElementById('down-btn');
        this.leftBtn = document.getElementById('left-btn');
        this.rightBtn = document.getElementById('right-btn');
        
        // 添加方向按钮事件监听器
        if (this.upBtn && this.downBtn && this.leftBtn && this.rightBtn) {
            this.upBtn.addEventListener('click', () => this.setDirection('up'));
            this.downBtn.addEventListener('click', () => this.setDirection('down'));
            this.leftBtn.addEventListener('click', () => this.setDirection('left'));
            this.rightBtn.addEventListener('click', () => this.setDirection('right'));
        }
    }
    
    /**
     * 初始化游戏手柄支持
     */
    setupGamepad() {
        // Implementation of setupGamepad method
    }
    
    /**
     * 设置键盘控制
     */
    setupKeyboard() {
        // Implementation of setupKeyboard method
    }
}

// 创建并导出输入管理器实例
const inputManager = new InputManager();
