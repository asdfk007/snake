/**
 * 音频模块 - 使用Web Audio API生成游戏音效
 */
class AudioManager {
    constructor() {
        // 音频上下文
        this.audioCtx = null;
        
        // 音效开关状态
        this.soundEnabled = this.getSavedSoundSetting();
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化音频上下文和事件监听
     */
    init() {
        try {
            // 创建AudioContext (懒加载，减少资源占用)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            
            // 设置声音开关
            const soundToggle = document.getElementById('sound-toggle');
            if (soundToggle) {
                soundToggle.checked = this.soundEnabled;
                soundToggle.addEventListener('change', (e) => {
                    this.setSoundEnabled(e.target.checked);
                });
            }
        } catch (e) {
            console.warn('Web Audio API 不受支持:', e);
        }
    }
    
    /**
     * 获取保存的声音设置
     */
    getSavedSoundSetting() {
        const setting = localStorage.getItem('snakeGameSound');
        return setting === null ? true : setting === 'true';
    }
    
    /**
     * 设置声音开关状态
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('snakeGameSound', enabled);
        
        // 如果关闭声音，恢复暂停的上下文
        if (!enabled && this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }
    
    /**
     * 确保音频上下文处于运行状态
     */
    ensureAudioContext() {
        if (!this.audioCtx) {
            this.init();
        } else if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }
    
    /**
     * 创建基础振荡器
     * @param {number} frequency - 频率(Hz)
     * @param {string} type - 振荡器类型
     * @param {number} startTime - 开始时间(sec)
     * @param {number} duration - 持续时间(sec)
     * @param {AudioNode} destination - 目标节点
     * @returns {OscillatorNode} 振荡器节点
     */
    createOscillator(frequency, type, startTime, duration, destination) {
        const ctx = this.ensureAudioContext();
        const oscillator = ctx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.connect(destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        return oscillator;
    }
    
    /**
     * 创建增益节点
     * @param {number} gainValue - 增益值
     * @param {number} startTime - 开始时间(sec)
     * @param {number} attackTime - 起音时间(sec)
     * @param {number} releaseTime - 释放时间(sec)
     * @param {number} sustainValue - 持续值
     * @returns {GainNode} 增益节点
     */
    createGainEnvelope(gainValue, startTime, attackTime, releaseTime, sustainValue = 0.01) {
        const ctx = this.ensureAudioContext();
        const gainNode = ctx.createGain();
        
        // 从0到gainValue的渐变
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, startTime + attackTime);
        
        // 从gainValue到sustainValue的渐变
        gainNode.gain.linearRampToValueAtTime(sustainValue, startTime + attackTime + releaseTime);
        
        gainNode.connect(ctx.destination);
        return gainNode;
    }
    
    /**
     * 播放方向改变音效
     */
    playDirectionChangeSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const duration = 0.08;
            
            // 创建增益节点
            const gainNode = this.createGainEnvelope(0.1, now, 0.01, 0.07);
            
            // 创建振荡器
            this.createOscillator(300, 'triangle', now, duration, gainNode);
        } catch (e) {
            console.warn('播放方向改变音效失败:', e);
        }
    }
    
    /**
     * 播放吃食物音效
     */
    playFoodSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const duration = 0.2;
            
            // 创建增益节点
            const gainNode = this.createGainEnvelope(0.2, now, 0.01, 0.19);
            
            // 创建振荡器
            const osc = this.createOscillator(440, 'sine', now, duration, gainNode);
            osc.frequency.linearRampToValueAtTime(880, now + duration);
        } catch (e) {
            console.warn('播放吃食物音效失败:', e);
        }
    }
    
    /**
     * 播放特殊食物音效
     */
    playSpecialFoodSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const duration = 0.3;
            
            // 创建增益节点
            const gainNode = this.createGainEnvelope(0.3, now, 0.05, 0.25);
            
            // 创建振荡器
            const osc1 = this.createOscillator(440, 'sine', now, duration, gainNode);
            const osc2 = this.createOscillator(554, 'sine', now, duration, gainNode);
            osc1.frequency.linearRampToValueAtTime(880, now + duration);
            osc2.frequency.linearRampToValueAtTime(1108, now + duration);
        } catch (e) {
            console.warn('播放特殊食物音效失败:', e);
        }
    }
    
    /**
     * 播放游戏结束音效
     */
    playGameOverSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const duration = 1.0;
            
            // 创建增益节点
            const gainNode = this.createGainEnvelope(0.3, now, 0.01, 0.99, 0);
            
            // 创建振荡器
            const osc = this.createOscillator(440, 'sawtooth', now, duration, gainNode);
            osc.frequency.linearRampToValueAtTime(110, now + duration);
            
            // 添加音调变化
            this.createOscillator(220, 'triangle', now + 0.1, duration - 0.1, gainNode);
        } catch (e) {
            console.warn('播放游戏结束音效失败:', e);
        }
    }
    
    /**
     * 播放按钮点击音效
     */
    playButtonSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const duration = 0.1;
            
            // 创建增益节点
            const gainNode = this.createGainEnvelope(0.15, now, 0.01, 0.09);
            
            // 创建振荡器
            this.createOscillator(880, 'sine', now, duration, gainNode);
        } catch (e) {
            console.warn('播放按钮音效失败:', e);
        }
    }
    
    /**
     * 播放菜单选择音效
     */
    playMenuSelectSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const duration = 0.15;
            
            // 创建增益节点
            const gainNode = this.createGainEnvelope(0.2, now, 0.01, 0.14);
            
            // 创建振荡器
            const osc = this.createOscillator(440, 'sine', now, duration, gainNode);
            osc.frequency.linearRampToValueAtTime(660, now + duration);
        } catch (e) {
            console.warn('播放菜单选择音效失败:', e);
        }
    }
    
    /**
     * 播放新高分音效
     */
    playHighScoreSound() {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.ensureAudioContext();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            let time = now;
            
            for (let i = 0; i < notes.length; i++) {
                const duration = 0.15;
                
                // 创建增益节点
                const gainNode = this.createGainEnvelope(0.2, time, 0.01, 0.14);
                
                // 创建振荡器
                this.createOscillator(notes[i], 'sine', time, duration, gainNode);
                
                time += 0.12;
            }
        } catch (e) {
            console.warn('播放高分音效失败:', e);
        }
    }
    
    /**
     * 检查初始化状态
     */
    checkInitStatus() {
        if (!this.initialized) {
            this.init();
        }
    }
}

// 创建音频管理器实例并挂载到全局对象
window.audioManager = new AudioManager();

// 确保DOM加载完成后再次检查初始化状态
document.addEventListener('DOMContentLoaded', () => {
    console.log('音频模块检查初始化状态');
    if (!window.audioManager || !window.audioManager.audioCtx) {
        console.log('重新初始化音频管理器');
        window.audioManager = new AudioManager();
    }
    
    // 确保声音开关状态正确
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle && window.audioManager) {
        soundToggle.checked = window.audioManager.soundEnabled;
    }
});
