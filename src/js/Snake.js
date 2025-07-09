/**
 * 蛇类
 * 负责蛇的移动、增长、碰撞检测等核心逻辑
 */
class Snake {
    constructor(gridSize, gridCount) {
        this.gridSize = gridSize; // 每个格子的大小（20像素）
        this.gridCount = gridCount; // 网格数量 40x40
        
        // 蛇的身体颜色序列：赤橙黄绿青蓝紫
        this.bodyColors = [
            '#ff0000', // 赤
            '#ff8000', // 橙  
            '#ffff00', // 黄
            '#00ff00', // 绿
            '#00ffff', // 青
            '#0080ff', // 蓝
            '#8000ff'  // 紫
        ];
        
        this.reset();
    }

    /**
     * 重置蛇到初始状态
     */
    reset() {
        // 蛇的身体：头部+3个身体节，从网格中间开始
        this.body = [
            { x: 20, y: 20 }, // 头部
            { x: 19, y: 20 }, // 身体1
            { x: 18, y: 20 }, // 身体2
            { x: 17, y: 20 }  // 身体3
        ];
        
        this.direction = { x: 1, y: 0 }; // 初始向右移动
        this.newDirection = { x: 1, y: 0 }; // 下一个方向
    }

    /**
     * 设置蛇的移动方向
     * @param {Object} direction - 方向对象 {x, y}
     */
    setDirection(direction) {
        // 防止蛇反向移动（撞到自己的脖子）
        if (direction.x === -this.direction.x && direction.y === -this.direction.y) {
            return;
        }
        this.newDirection = direction;
    }

    /**
     * 移动蛇
     * @returns {boolean} 是否成功移动（false表示撞墙或撞自己）
     */
    move() {
        this.direction = this.newDirection;
        
        // 计算新的头部位置
        const head = { ...this.body[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.gridCount || 
            head.y < 0 || head.y >= this.gridCount) {
            return false;
        }
        
        // 检查是否撞到自己身体
        if (this.checkSelfCollision(head)) {
            return false;
        }
        
        // 在头部添加新节点
        this.body.unshift(head);
        
        return true;
    }

    /**
     * 增长蛇的身体（吃到食物时调用）
     */
    grow() {
        // 什么都不做，因为move()方法没有移除尾部，蛇自然就增长了
        // 这个方法主要是为了语义清晰
    }

    /**
     * 移除蛇尾（正常移动时调用）
     */
    removeTail() {
        this.body.pop();
    }

    /**
     * 检查是否撞到自己身体
     * @param {Object} head - 新的头部位置
     * @returns {boolean} 是否撞到自己
     */
    checkSelfCollision(head) {
        // 检查头部是否与身体任何一节重合（忽略最后一节尾巴）
        for (let i = 0; i < this.body.length - 1; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查是否吃到食物
     * @param {Object} food - 食物位置 {x, y}
     * @returns {boolean} 是否吃到食物
     */
    checkFoodCollision(food) {
        const head = this.body[0];
        return head.x === food.x && head.y === food.y;
    }

    /**
     * 获取蛇的头部位置
     * @returns {Object} 头部位置 {x, y}
     */
    getHead() {
        return this.body[0];
    }

    /**
     * 获取蛇的身体
     * @returns {Array} 身体数组
     */
    getBody() {
        return this.body;
    }

    /**
     * 获取身体某一节的颜色
     * @param {number} index - 身体节索引（0是头部）
     * @returns {string} 颜色值
     */
    getSegmentColor(index) {
        if (index === 0) {
            // 头部是黑色（用于绘制菱形）
            return '#000000';
        }
        
        // 身体按照颜色序列循环
        const colorIndex = (index - 1) % this.bodyColors.length;
        return this.bodyColors[colorIndex];
    }

    /**
     * 获取蛇身占据的所有位置（用于食物生成时避免重叠）
     * @returns {Array} 位置数组
     */
    getOccupiedPositions() {
        return this.body.map(segment => ({ x: segment.x, y: segment.y }));
    }

    /**
     * 获取蛇的长度
     * @returns {number} 蛇的长度
     */
    getLength() {
        return this.body.length;
    }
} 