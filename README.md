# Albert Resume

个人学术主页，基于 **React 19 + Vite 7 + TypeScript** 构建的单页应用。

在线地址：[https://lotusai.extrotec.com/albert/resume](https://lotusai.extrotec.com/albert/resume)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19, TypeScript |
| 构建 | Vite 7 |
| 样式 | Tailwind CSS 4 (`@tailwindcss/vite` + `@tailwindcss/typography`) |
| Markdown 渲染 | `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-slug` |
| 图标 | `react-icons` |
| 部署 | Docker + Nginx 反代 |

## 快速开始

```bash
npm install
npm run dev          # 开发服务器 (HMR)
```

## 内容编辑

所有页面内容集中在 [`content/about.md`](content/about.md)，YAML frontmatter + Markdown 正文。站点配置在 [`src/config/site.ts`](src/config/site.ts)。

## Docker 部署

```bash
# 本地预览
docker compose up -d --build

# 查看日志
docker compose logs --tail 100

# 停止服务
docker compose down
```

容器监听 `3719` 端口，使用 `vite preview` 作为服务入口。生产环境由外部 Nginx 反代到该端口。
当前 `docker-compose.yml` 使用 `BASE_URL=./`，因为现网代理会把 `/albert/resume` 前缀剥离后再转发给容器，前端资源需按相对路径构建。

验证：`curl -I http://localhost:3719/` 应返回 200。

## 项目结构

```
content/about.md           ← 页面内容（Markdown）
src/
  config/site.ts           ← 站点配置
  components/
    Layout.tsx             ← 整体布局
    Masthead.tsx           ← 顶部导航
    Sidebar.tsx            ← 个人信息侧边栏
    MarkdownPage.tsx       ← Markdown 渲染
  lib/markdown.ts          ← frontmatter 解析器
  App.tsx                  ← 根组件
  main.tsx                 ← 入口
  index.css                ← Tailwind + 锚点偏移
public/images/             ← 静态图片
```
