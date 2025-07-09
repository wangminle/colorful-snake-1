/**
 * 主入口文件
 * 负责游戏初始化、页面切换和事件绑定
 */
class GameApp {
    constructor() {
        this.canvas = null;
        this.game = null;
        this.storage = new Storage();
        
        // 页面元素
        this.startScreen = null;
        this.gameScreen = null;
        this.gameOverScreen = null;
        this.startButton = null;
        this.previousGameState = null;
        
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * 设置应用
     */
    setup() {
        // 获取页面元素
        this.canvas = document.getElementById('gameCanvas');
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startButton = document.getElementById('startButton');
        
        // 检查元素是否存在
        if (!this.canvas || !this.startScreen || !this.gameScreen || 
            !this.gameOverScreen || !this.startButton) {
            console.error('页面元素初始化失败');
            return;
        }
        
        // 初始化游戏
        console.log('开始初始化Game实例...');
        this.game = new Game(this.canvas);
        console.log('Game实例创建完成');
        
        // 设置事件监听器
        this.setupEventListeners();
        console.log('事件监听器设置完成');
        
        // 显示初始页面
        this.showStartScreen();
        console.log('初始页面显示完成');
        
        // 启动统一的游戏循环
        this.gameLoop();
        console.log('统一游戏循环已启动');
        
        console.log('彩色贪食蛇游戏初始化完成！');
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 开始按钮点击事件
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
        
        // 统一的键盘事件处理
        document.addEventListener('keydown', (event) => {
            // 防止页面滚动
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
                event.preventDefault();
            }
            
            // 在开始页面按Enter开始游戏
            if (event.code === 'Enter' && this.game.getCurrentState() === this.game.STATES.START) {
                this.startGame();
            }
            
            // 将所有游戏相关的键盘事件转发给Game对象
            if (this.game && this.game.handleKeyPress) {
                this.game.handleKeyPress(event);
            }
        });
    }

    /**
     * [添加] 统一的游戏循环
     */
    gameLoop(currentTime = 0) {
        // 更新游戏核心逻辑
        this.game.update(currentTime);
        // 渲染游戏画面
        this.game.render();

        // 检查并更新UI界面
        const currentState = this.game.getCurrentState();
        if (currentState !== this.previousGameState) {
            switch (currentState) {
                case this.game.STATES.START:
                    this.showStartScreen();
                    break;
                case this.game.STATES.COUNTDOWN:
                case this.game.STATES.PLAYING:
                case this.game.STATES.PAUSED:
                    this.showGameScreen();
                    break;
                case this.game.STATES.GAME_OVER:
                    this.showGameOverScreen();
                    break;
            }
            this.previousGameState = currentState;
        }

        // 请求下一帧
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * 开始游戏
     */
    startGame() {
        console.log('=== 开始游戏调试信息 ===');
        console.log('当前游戏状态:', this.game.getCurrentState());
        
        // 检查DOM元素状态
        const pauseOverlay = document.getElementById('pauseOverlay');
        console.log('暂停覆盖层元素:', pauseOverlay);
        console.log('暂停覆盖层类名:', pauseOverlay ? pauseOverlay.className : 'null');
        console.log('暂停覆盖层样式显示:', pauseOverlay ? window.getComputedStyle(pauseOverlay).display : 'null');
        
        this.game.startNewGame();
        console.log('startNewGame调用后的状态:', this.game.getCurrentState());
        
        this.showGameScreen();
        console.log('showGameScreen调用完成');
        
        // 再次检查状态
        setTimeout(() => {
            console.log('1秒后的游戏状态:', this.game.getCurrentState());
            console.log('1秒后暂停覆盖层类名:', pauseOverlay ? pauseOverlay.className : 'null');
        }, 1000);
    }

    /**
     * 显示开始页面
     */
    showStartScreen() {
        this.hideAllScreens();
        this.startScreen.classList.remove('hidden');
        
        // 确保playHint隐藏
        const playHint = document.getElementById('playHint');
        if (playHint) {
            playHint.classList.add('hidden');
        }
        
        // 更新最高分显示
        const highScore = this.storage.getHighScore();
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = highScore;
        }
        
        // 聚焦开始按钮
        this.startButton.focus();
    }

    /**
     * 显示游戏页面
     */
    showGameScreen() {
        this.hideAllScreens();
        this.gameScreen.classList.remove('hidden');
        
        // 确保暂停覆盖层隐藏
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.classList.add('hidden');
        }
        
        // 聚焦Canvas以确保键盘事件正常工作
        this.canvas.focus();
        this.canvas.setAttribute('tabindex', '0');
    }

    /**
     * 显示游戏结束页面
     */
    showGameOverScreen() {
        this.hideAllScreens();
        this.gameOverScreen.classList.remove('hidden');
        
        // 确保playHint隐藏
        const playHint = document.getElementById('playHint');
        if (playHint) {
            playHint.classList.add('hidden');
        }
        
        // 更新分数显示
        const finalScore = this.game.getScore();
        const highScore = this.storage.getHighScore();
        
        const finalScoreElement = document.getElementById('finalScore');
        const finalHighScoreElement = document.getElementById('finalHighScore');
        
        if (finalScoreElement) {
            finalScoreElement.textContent = finalScore;
        }
        
        if (finalHighScoreElement) {
            finalHighScoreElement.textContent = highScore;
        }
    }

    /**
     * 隐藏所有页面
     */
    hideAllScreens() {
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }

    /**
     * 获取游戏实例（用于调试）
     * @returns {Game} 游戏实例
     */
    getGame() {
        return this.game;
    }

    /**
     * 重置最高分（用于调试）
     */
    resetHighScore() {
        this.storage.resetHighScore();
        this.showStartScreen();
        console.log('最高分已重置');
    }
}

// 创建全局游戏应用实例
let gameApp;

// 页面加载完成后启动应用
document.addEventListener('DOMContentLoaded', () => {
    gameApp = new GameApp();
    
    // 将游戏应用实例添加到全局作用域（方便调试）
    window.gameApp = gameApp;
});

// 为开发者提供一些调试函数
window.debugGame = {
    resetHighScore: () => gameApp?.resetHighScore(),
    getScore: () => gameApp?.getGame()?.getScore(),
    getState: () => gameApp?.getGame()?.getCurrentState(),
    togglePause: () => gameApp?.getGame()?.togglePause()
}; 