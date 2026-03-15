# 项目文件结构说明

## 项目概览

- 技术栈：Vite + React + React Router + Tailwind CSS
- 首页体验：进入站点先展示吃豆人动画首页（PacmanHome），再进入内容页（个人简介/作品等）
- 风格切换：像素风 / 现代风，通过给 `html` 加 class 进行全局样式切换

## 入口与启动

- 入口 HTML：`index.html`
- 入口脚本：`src/main.jsx`（挂载 React 与 Router）
- 应用路由：`src/App.jsx`

## 路由结构

- `src/App.jsx`
  - `/design-system`：设计系统预览页（`DesignSystem/index.jsx`）
  - `/figma-button`：Figma Button 预览页（`DesignSystem/FigmaButtonPreview.jsx`）
  - `/*`：主站内容（`MainContent`）
    - `/`：主页（先 PacmanHome，之后显示内容页：AvatarHero、BioHeader、GlobalFooter）
    - `/portfolio`：作品集页（PortfolioGallery）

## 样式与主题

- 全局样式：`src/index.css`
- Tailwind 配置：`tailwind.config.js`
- 风格切换逻辑：`src/App.jsx`
  - `mode` 状态：`pixel` / `modern`
  - 通过 `document.documentElement.classList` 切换 `mode-pixel` 与 `mode-modern`

## 关键组件（src/components）

- `PacmanHome.jsx`
  - 吃豆人首页容器：渲染 `PacmanGame`，并在其下方展示导航入口（关于我/作品集/游戏/工具）
- `PacmanGame.jsx`
  - Canvas 游戏渲染：固定画布尺寸 + 迷宫按行列数生成
  - 可调参数集中在文件顶部（行列、画布尺寸、单格像素、颜色、墙体比例等）
  - 迷宫随机化：每次刷新会随机镜像/填充部分区域，但边界始终为封闭墙体
- `AvatarHero.jsx`
  - 头部视觉区：根据 `mode` 决定是否展示像素特效背景
- `PixelBlast.jsx` + `src/components/pixelblast/*`
  - 像素粒子/着色器相关实现（用于像素风效果）
- `PageToc.jsx`
  - 页面目录（用于内容页左侧目录）
- `BioHeader.jsx` / `PortfolioGallery.jsx` / `GlobalFooter.jsx`
  - 内容模块：个人简介、作品展示、页脚

## DesignSystem（DesignSystem 目录）

- `DesignSystem/index.jsx`：设计系统预览页入口（tokens + 组件示例）
- `DesignSystem/components/*`：设计系统组件（FigmaButton、IconButton、Icons 等）
- `DesignSystem/theme.js`：设计 token 与 CSS 变量

## 构建产物

- `dist/`：构建输出目录（通常由构建流程生成）
