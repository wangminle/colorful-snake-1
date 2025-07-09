/**
 * 渲染器类
 * 负责Canvas绘制，包括蛇、食物、背景等的渲染
 */
class Renderer {
    constructor(canvas, gridSize, gridCount) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = gridSize; // 每个格子20像素
        this.gridCount = gridCount; // 40x40网格
        
        // 设置Canvas样式
        this.setupCanvas();
    }

    /**
     * 设置Canvas基本样式
     */
    setupCanvas() {
        // 启用抗锯齿
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * 清空画布并绘制网格
     */
    clear() {
        // 填充浅灰色背景
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制40x40网格
        this.drawGrid();
    }

    /**
     * 绘制40x40白色网格边界
     */
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // 半透明黑色
        this.ctx.lineWidth = 1; // 更细的线条
        
        // 绘制垂直线
        for (let x = 0; x <= this.gridCount; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.gridSize, 0);
            this.ctx.lineTo(x * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = 0; y <= this.gridCount; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.gridSize);
            this.ctx.lineTo(this.canvas.width, y * this.gridSize);
            this.ctx.stroke();
        }
    }

    /**
     * 绘制蛇
     * @param {Snake} snake - 蛇对象
     */
    drawSnake(snake) {
        const body = snake.getBody();
        
        // 绘制身体（从尾部到头部，头部最后绘制在最上层）
        for (let i = body.length - 1; i >= 0; i--) {
            const segment = body[i];
            const color = snake.getSegmentColor(i);
            
            if (i === 0) {
                // 绘制头部（黑色菱形）
                this.drawSnakeHead(segment, color);
            } else {
                // 绘制身体（彩色方块）
                this.drawSnakeBody(segment, color);
            }
        }
    }

    /**
     * 绘制蛇头（黑色菱形）
     * @param {Object} position - 位置 {x, y}
     * @param {string} color - 颜色
     */
    drawSnakeHead(position, color) {
        const centerX = position.x * this.gridSize + this.gridSize / 2;
        const centerY = position.y * this.gridSize + this.gridSize / 2;
        const size = this.gridSize * 0.8; // 菱形大小
        
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = '#444444';
        this.ctx.lineWidth = 1;
        
        // 绘制菱形
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - size / 2); // 上顶点
        this.ctx.lineTo(centerX + size / 2, centerY); // 右顶点
        this.ctx.lineTo(centerX, centerY + size / 2); // 下顶点
        this.ctx.lineTo(centerX - size / 2, centerY); // 左顶点
        this.ctx.closePath();
        
        this.ctx.fill();
        this.ctx.stroke();
        
        // 添加眼睛效果
        this.drawSnakeEyes(centerX, centerY, size);
    }

    /**
     * 绘制蛇眼睛
     * @param {number} centerX - 中心X坐标
     * @param {number} centerY - 中心Y坐标
     * @param {number} size - 头部大小
     */
    drawSnakeEyes(centerX, centerY, size) {
        this.ctx.fillStyle = '#ffffff';
        const eyeSize = size * 0.15;
        const eyeOffset = size * 0.2;
        
        // 左眼
        this.ctx.beginPath();
        this.ctx.arc(centerX - eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 右眼
        this.ctx.beginPath();
        this.ctx.arc(centerX + eyeOffset, centerY - eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 眼珠
        this.ctx.fillStyle = '#000000';
        const pupilSize = eyeSize * 0.6;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX - eyeOffset, centerY - eyeOffset, pupilSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(centerX + eyeOffset, centerY - eyeOffset, pupilSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * 绘制蛇身体（彩色方块）
     * @param {Object} position - 位置 {x, y}
     * @param {string} color - 颜色
     */
    drawSnakeBody(position, color) {
        const x = position.x * this.gridSize;
        const y = position.y * this.gridSize;
        const size = this.gridSize * 0.9; // 身体大小稍小于格子
        const offset = (this.gridSize - size) / 2;
        
        // 绘制渐变效果
        const gradient = this.ctx.createRadialGradient(
            x + this.gridSize / 2, y + this.gridSize / 2, 0,
            x + this.gridSize / 2, y + this.gridSize / 2, size / 2
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 0.3));
        
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = '#222222';
        this.ctx.lineWidth = 1;
        
        // 绘制圆角矩形
        this.drawRoundedRect(x + offset, y + offset, size, size, 3);
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * 绘制食物（闪烁的圆形）
     * @param {Food} food - 食物对象
     */
    drawFood(food) {
        const pixelPos = food.getPixelPosition();
        const radius = food.getRadius();
        const color = food.getCurrentColor();
        
        // 绘制食物主体
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = '#ff1493'; // 深粉色边框
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(pixelPos.x, pixelPos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // 添加光晕效果
        const glowGradient = this.ctx.createRadialGradient(
            pixelPos.x, pixelPos.y, 0,
            pixelPos.x, pixelPos.y, radius * 2
        );
        glowGradient.addColorStop(0, `${color}80`); // 80为透明度
        glowGradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = glowGradient;
        this.ctx.beginPath();
        this.ctx.arc(pixelPos.x, pixelPos.y, radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * 绘制圆角矩形
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @param {number} radius - 圆角半径
     */
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    /**
     * 加深颜色
     * @param {string} color - 原色
     * @param {number} factor - 加深因子(0-1)
     * @returns {string} 加深后的颜色
     */
    darkenColor(color, factor) {
        // 简单的颜色加深算法
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.floor(r * (1 - factor));
        const newG = Math.floor(g * (1 - factor));
        const newB = Math.floor(b * (1 - factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    /**
     * 绘制暂停效果（半透明覆盖层）
     */
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
} 