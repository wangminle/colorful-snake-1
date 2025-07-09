/**
 * 食物类
 * 负责食物的生成、颜色交替动画等逻辑
 */
class Food {
    constructor(gridSize, gridCount) {
        this.gridSize = gridSize; // 每个格子的大小（20像素）
        this.gridCount = gridCount; // 网格数量 40x40
        
        // 食物属性
        this.position = { x: 0, y: 0 };
        this.radius = 7.5; // 食物半径（直径15像素）
        
        // 颜色交替动画
        this.colors = ['#ff69b4', '#ffffff']; // 粉色和白色
        this.currentColorIndex = 0;
        this.colorChangeInterval = 500; // 0.5秒切换一次颜色
        this.lastColorChangeTime = 0;
        
        // 初始化时生成食物位置
        this.generate([]);
    }

    /**
     * 生成新的食物位置
     * @param {Array} occupiedPositions - 被蛇身占据的位置数组
     */
    generate(occupiedPositions = []) {
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 1000; // 防止无限循环
        
        while (!validPosition && attempts < maxAttempts) {
            // 随机生成位置
            this.position = {
                x: Math.floor(Math.random() * this.gridCount),
                y: Math.floor(Math.random() * this.gridCount)
            };
            
            // 检查是否与蛇身重叠
            validPosition = !this.isPositionOccupied(this.position, occupiedPositions);
            attempts++;
        }
        
        // 如果尝试太多次仍未找到有效位置，使用最后一个位置
        if (attempts >= maxAttempts) {
            console.warn('食物生成位置查找超时，使用当前位置');
        }
        
        console.log('食物生成在位置:', this.position);
    }

    /**
     * 检查位置是否被占据
     * @param {Object} position - 位置对象 {x, y}
     * @param {Array} occupiedPositions - 被占据的位置数组
     * @returns {boolean} 是否被占据
     */
    isPositionOccupied(position, occupiedPositions) {
        return occupiedPositions.some(occupied => 
            occupied.x === position.x && occupied.y === position.y
        );
    }

    /**
     * 更新食物状态（主要是颜色动画）
     * @param {number} currentTime - 当前时间戳
     */
    update(currentTime) {
        // 检查是否需要切换颜色
        if (currentTime - this.lastColorChangeTime >= this.colorChangeInterval) {
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
            this.lastColorChangeTime = currentTime;
        }
    }

    /**
     * 获取当前颜色
     * @returns {string} 当前颜色值
     */
    getCurrentColor() {
        return this.colors[this.currentColorIndex];
    }

    /**
     * 获取食物在画布上的像素位置
     * @returns {Object} 像素位置 {x, y}
     */
    getPixelPosition() {
        return {
            x: this.position.x * this.gridSize + this.gridSize / 2,
            y: this.position.y * this.gridSize + this.gridSize / 2
        };
    }

    /**
     * 获取食物的网格位置
     * @returns {Object} 网格位置 {x, y}
     */
    getGridPosition() {
        return { ...this.position };
    }

    /**
     * 获取食物半径
     * @returns {number} 半径
     */
    getRadius() {
        return this.radius;
    }

    /**
     * 重新生成食物（用于游戏重置）
     * @param {Array} occupiedPositions - 被蛇身占据的位置数组
     */
    regenerate(occupiedPositions = []) {
        this.generate(occupiedPositions);
        this.currentColorIndex = 0;
        this.lastColorChangeTime = 0;
    }
} 