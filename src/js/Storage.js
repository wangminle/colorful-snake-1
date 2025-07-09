/**
 * 本地存储管理类
 * 负责管理游戏的最高分数据
 */
class Storage {
    constructor() {
        this.HIGH_SCORE_KEY = 'colorfulSnake_highScore';
    }

    /**
     * 获取最高分
     * @returns {number} 最高分
     */
    getHighScore() {
        const score = localStorage.getItem(this.HIGH_SCORE_KEY);
        return score ? parseInt(score, 10) : 0;
    }

    /**
     * 保存最高分
     * @param {number} score - 分数
     */
    setHighScore(score) {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
            return true; // 表示创造了新纪录
        }
        return false;
    }

    /**
     * 重置最高分（用于测试或重置功能）
     */
    resetHighScore() {
        localStorage.removeItem(this.HIGH_SCORE_KEY);
    }
} 