# 🐍 彩色贪食蛇游戏

一个基于HTML5 Canvas和JavaScript开发的贪食蛇游戏。

![游戏状态](https://img.shields.io/badge/Status-Stable-brightgreen)
![技术栈](https://img.shields.io/badge/Tech-HTML5%20Canvas%20%7C%20Vanilla%20JavaScript%20%7C%20CSS3-blue)
![版本](https://img.shields.io/badge/Version-v1.1.0-orange)

## 🎮 游戏功能

### 视觉

- 彩色蛇身: 赤橙黄绿青蓝紫循环配色。
- 菱形蛇头: 黑色菱形，包含眼睛效果。
- 动态食物: 粉色和白色交替闪烁的圆形食物，直径15像素。
- 背景: 浅灰色背景，淡色网格线。
- UI: 得分和暂停提示具有半透明背景及圆角。

### 游戏体验

- 移动速度: 每秒移动5格。
- 游戏区域: 30x30网格 (600x600px)。
- 暂停功能: 空格键切换游戏暂停/恢复，屏幕中央显示"PAUSED"及恢复提示。
- 控制: 键盘方向键控制蛇的移动方向。
- 流程: 包含开始、倒计时、游戏进行和结束页面。

### 技术实现

- 状态管理: 通过枚举实现游戏状态切换（START/COUNTDOWN/PLAYING/PAUSED/GAME_OVER）。
- 碰撞检测: 支持边界和自身碰撞检测，并修复了尾巴碰撞bug。
- 页面控制: UI元素根据游戏状态进行显示和隐藏。
- 数据存储: 使用LocalStorage保存最高分。

## 🚀 运行项目

### 环境

- 现代浏览器 (支持HTML5 Canvas和ES6+)
- HTTP服务器 (不可直接打开HTML文件)

### 启动步骤

#### 方法一：使用Node.js

```bash
# 1. 全局安装live-server (如果未安装)
npm install -g live-server

# 2. 进入项目目录并启动
cd colorful-snake-1
npm run dev
# 或者直接运行
live-server src --port=8080 --open
```

#### 方法二：使用Python

```bash
# Python 3
cd colorful-snake-1/src
python -m http.server 8080

# Python 2
cd colorful-snake-1/src
python -m SimpleHTTPServer 8080

# 访问 http://localhost:8080
```

#### 方法三：其他HTTP服务器

```bash
# 例如使用Node.js的http-server
npx http-server src -p 8080 -o
```

### 🎮 游戏操作

- **方向键**: 控制蛇的移动方向。
- **空格键**: 暂停/恢复游戏。
- **Enter键**: 在开始页面启动游戏。

## 📁 项目结构

```
colorful-snake-1/
├── docs/                           # 文档目录
│   ├── README.md                  # 项目概述
│   ├── 需求说明.md                # 详细需求文档
│   └── 项目诊断报告.md            # 问题诊断报告
├── src/                           # 源代码目录
│   ├── index.html                 # 主游戏页面
│   ├── css/
│   │   └── style.css              # 游戏样式文件
│   └── js/
│       ├── main.js                # 应用入口和页面管理
│       ├── Game.js                # 游戏核心逻辑
│       ├── Snake.js               # 蛇类（移动、碰撞、渲染）
│       ├── Food.js                # 食物类（生成、动画）
│       ├── Renderer.js            # Canvas渲染器
│       └── Storage.js             # 本地存储管理
├── package.json                   # 项目配置
├── package-lock.json             # 依赖锁定
└── LICENSE                       # 开源许可证
```

## 💻 技术栈

- **HTML5 Canvas**: 用于游戏图形渲染。
- **Vanilla JavaScript (ES6+)**: 实现游戏逻辑，无框架依赖。
- **CSS3**: 定义界面样式和动画。
- **localStorage**: 用于客户端数据持久化（最高分）。

### 设计思路

- **模块化**: 代码分为多个独立的JavaScript类。
- **职责分离**: 各模块负责特定功能，例如`Game`管理游戏状态，`Renderer`负责绘制。
- **状态机**: 游戏状态通过枚举管理，控制游戏流程。

## ✨ 版本记录

### v1.1.0

- 优化暂停功能体验：移除顶部提示，改为屏幕中央显示半透明遮罩及"PAUSED"字样。
- 修复倒计时显示bug：确保游戏开始时的3秒倒计时正常显示。
- 界面细节优化：统一隐藏/显示逻辑。

- **结束**: 撞墙或撞到自己身体游戏结束。
- **目标**: 挑战最高分。

## 🛠️ 开发指南

### 调试

可在浏览器控制台使用以下全局对象进行调试：

```javascript
window.debugGame.getScore()      // 获取当前分数
window.debugGame.getState()      // 获取游戏状态
window.debugGame.resetHighScore() // 重置最高分
window.debugGame.togglePause()   // 切换暂停状态
```

### 可配置项

在 `Game.js` 中可调整以下参数：

```javascript
this.gridCount = 30;        // 网格数量
this.moveSpeed = 5;         // 移动速度（格/秒）
this.pointsPerFood = 20;    // 每个食物的分数
this.countdownTime = 3;     // 倒计时秒数
```

## 🐛 常见问题

- **游戏页面空白**: 确保通过HTTP服务器访问，而非直接打开HTML文件。
- **键盘无响应**: 点击游戏画布区域以确保其获得焦点。
- **最高分未保存**: 检查浏览器localStorage设置，或是否在隐私模式下。

## 🚧 已知限制

- 暂不支持移动端触摸控制。
- 暂无音效和背景音乐。

## 🔮 未来规划

- 移动端适配。
- 添加音效系统和背景音乐。
- 增加难度选择。
- 实现在线排行榜和多人模式。

## 📜 许可证

本项目使用 MIT 许可证。

## 🙏 致谢

感谢社区成员的测试和反馈。
