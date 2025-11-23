/**
 * 游戏核心逻辑类
 * 负责游戏状态管理、主循环、碰撞检测等
 */
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.gridSize = 20;
        this.gridCount = 30;

        // 游戏状态枚举
        this.STATES = {
            START: 'start',
            COUNTDOWN: 'countdown',
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'gameOver'
        };

        // 初始化组件
        this.storage = new Storage();
        this.snake = new Snake(this.gridSize, this.gridCount);
        this.renderer = new Renderer(canvas, this.gridSize, this.gridCount);
        this.food = new Food(this.gridSize, this.gridCount);

        // 游戏状态
        this.currentState = this.STATES.START;
        this.score = 0;
        this.pointsPerFood = 20;

        // 移动和时间控制
        this.moveSpeed = 5; // 每秒移动5格
        this.moveInterval = 1000 / this.moveSpeed; // 200ms移动一次
        this.lastMoveTime = 0;

        // 倒计时
        this.countdownTime = 3; // 3秒倒计时
        this.countdownStartTime = 0;
        this.gameOverCountdown = 5; // 游戏结束5秒倒计时
        this.gameOverStartTime = 0;

        // 开始主循环
        this.lastFrameTime = 0;
        console.log('Game类初始化完成');
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });
    }

    /**
     * 处理键盘输入
     * @param {KeyboardEvent} event - 键盘事件
     */
    handleKeyPress(event) {
        if (this.currentState === this.STATES.PLAYING) {
            switch (event.code) {
                case 'ArrowUp':
                    this.snake.setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    this.snake.setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    this.snake.setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    this.snake.setDirection({ x: 1, y: 0 });
                    break;
                case 'Space':
                    this.togglePause();
                    break;
            }
        } else if (this.currentState === this.STATES.PAUSED) {
            if (event.code === 'Space') {
                this.togglePause();
            }
        } else if (this.currentState === this.STATES.COUNTDOWN) {
            if (event.code === 'Space') {
                // 跳过倒计时，直接开始游戏
                this.currentState = this.STATES.PLAYING;
                this.lastMoveTime = performance.now();
                this.updateCountdownDisplay(0);
                this.updateUI();
            }
        }
    }

    /**
     * 开始新游戏
     */
    startNewGame() {
        console.log('=== startNewGame开始 ===');
        this.score = 0;
        this.snake.reset();
        this.food.regenerate(this.snake.getOccupiedPositions());

        // 开始倒计时
        this.currentState = this.STATES.COUNTDOWN;
        this.countdownStartTime = performance.now();
        console.log('状态设置为COUNTDOWN:', this.currentState);

        // 确保暂停覆盖层隐藏
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.classList.add('hidden');
        }

        this.updateUI();
        console.log('新游戏开始，状态:', this.currentState);
    }

    /**
     * 暂停/继续游戏
     */
    togglePause() {
        if (this.currentState === this.STATES.PLAYING) {
            this.currentState = this.STATES.PAUSED;
        } else if (this.currentState === this.STATES.PAUSED) {
            this.currentState = this.STATES.PLAYING;
        }
        this.updateUI();
    }

    /**
     * 游戏结束
     */
    gameOver() {
        this.currentState = this.STATES.GAME_OVER;
        this.gameOverStartTime = performance.now();


        // 保存最高分
        const isNewRecord = this.storage.setHighScore(this.score);
        if (isNewRecord) {
            console.log('新纪录！');
        }

        this.updateUI();
    }

    /**
     * 更新游戏逻辑
     * @param {number} currentTime - 当前时间戳
     */
    update(currentTime) {
        switch (this.currentState) {
            case this.STATES.COUNTDOWN:
                this.updateCountdown(currentTime);
                break;
            case this.STATES.PLAYING:
                this.updateGameplay(currentTime);
                break;
            case this.STATES.GAME_OVER:
                this.updateGameOver(currentTime);
                break;
        }

        // 更新食物动画
        this.food.update(currentTime);
    }

    /**
     * 更新倒计时
     * @param {number} currentTime - 当前时间戳
     */
    updateCountdown(currentTime) {
        const elapsed = (currentTime - this.countdownStartTime) / 1000;
        const remaining = Math.max(0, this.countdownTime - elapsed);

        if (remaining <= 0) {
            // 倒计时结束，开始游戏
            this.currentState = this.STATES.PLAYING;
            this.lastMoveTime = currentTime;
            // 清空倒计时显示并更新UI
            this.updateCountdownDisplay(0);
            this.updateUI();
        } else {
            this.updateCountdownDisplay(Math.ceil(remaining));
        }
    }

    /**
     * 更新游戏玩法
     * @param {number} currentTime - 当前时间戳
     */
    updateGameplay(currentTime) {
        // 检查是否该移动蛇
        if (currentTime - this.lastMoveTime >= this.moveInterval) {
            const moveSuccess = this.snake.move();

            if (!moveSuccess) {
                // 撞墙或撞自己，游戏结束
                this.gameOver();
                return;
            }

            // 检查是否吃到食物
            if (this.snake.checkFoodCollision(this.food.getGridPosition())) {
                // 吃到食物
                this.score += this.pointsPerFood;
                this.snake.grow(); // 蛇增长
                this.food.regenerate(this.snake.getOccupiedPositions()); // 生成新食物
            } else {
                // 没吃到食物，移除蛇尾
                this.snake.removeTail();
            }

            this.lastMoveTime = currentTime;
            this.updateUI();
        }
    }

    /**
     * 更新游戏结束状态
     * @param {number} currentTime - 当前时间戳
     */
    updateGameOver(currentTime) {
        const elapsed = (currentTime - this.gameOverStartTime) / 1000;
        const remaining = Math.max(0, this.gameOverCountdown - elapsed);

        if (remaining <= 0) {
            // 倒计时结束，返回开始页面
            this.currentState = this.STATES.START;
            this.updateUI();
        }

        this.updateGameOverDisplay(Math.ceil(remaining));
    }

    /**
     * 渲染游戏
     */
    render() {
        // 清空画布
        this.renderer.clear();

        // 根据状态绘制不同内容
        if (this.currentState === this.STATES.COUNTDOWN ||
            this.currentState === this.STATES.PLAYING ||
            this.currentState === this.STATES.PAUSED) {

            // 绘制蛇和食物
            this.renderer.drawSnake(this.snake);
            this.renderer.drawFood(this.food);

            // 绘制暂停覆盖层
            if (this.currentState === this.STATES.PAUSED) {
                this.renderer.drawPauseOverlay();
            }
        }
    }

    /**
     * 更新UI元素（如分数、覆盖层等）
     */
    updateUI() {
        const scoreElement = document.getElementById('scoreValue');
        const pauseOverlay = document.getElementById('pauseOverlay');

        if (scoreElement) {
            scoreElement.textContent = this.score;
        }

        // 根据游戏状态更新提示文本和暂停覆盖层
        if (this.currentState === this.STATES.PLAYING) {
            if (pauseOverlay) pauseOverlay.classList.add('hidden');
        } else if (this.currentState === this.STATES.PAUSED) {
            if (pauseOverlay) pauseOverlay.classList.remove('hidden');
        } else {
            // 在其他状态下隐藏暂停覆盖层
            if (pauseOverlay) pauseOverlay.classList.add('hidden');
        }
    }

    /**
     * 更新倒计时显示
     * @param {number} count - 倒计时数字
     */
    updateCountdownDisplay(count) {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = count > 0 ? count : '';
            if (count > 0) {
                countdownElement.classList.remove('hidden');
            } else {
                countdownElement.classList.add('hidden');
            }
        }
    }

    /**
     * 更新游戏结束倒计时显示
     * @param {number} count - 倒计时数字
     */
    updateGameOverDisplay(count) {
        const gameOverCountdownElement = document.getElementById('gameOverCountdown');
        if (gameOverCountdownElement) {
            gameOverCountdownElement.textContent = `${count}秒后返回主菜单`;
        }
    }



    /**
     * 获取当前游戏状态
     * @returns {string} 当前状态
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * 获取当前分数
     * @returns {number} 当前分数
     */
    getScore() {
        return this.score;
    }
} 