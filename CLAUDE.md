# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

个人学术主页，已从 Jekyll 迁移到 **React 19 + Vite 7 + TypeScript**。单页应用，核心内容以 Markdown 编写，构建时解析渲染。

生产部署于 `https://lotusai.extrotec.com/albert/resume`，机房外部 Nginx 反代到容器 `3719` 端口。

## 常用命令

```bash
npm run dev          # 开发服务器 (HMR)
npm run build        # 生产构建 → dist/
npm run preview      # 预览生产构建 :3719 (同 npm start)
npm start            # 同 preview，Docker CMD 入口

docker compose up -d --build   # 容器化部署/预览
docker compose logs --tail 100 # 查看容器日志
docker compose down            # 停止服务
```

验证：`curl -I http://localhost:3719/` 应返回 200。

## 架构

- **内容源**：[`content/about.md`](content/about.md) — YAML frontmatter + Markdown 正文，用户只需编辑此文件
- **配置**：[`src/config/site.ts`](src/config/site.ts) — 作者信息、导航链接、社交链接
- **Markdown 解析**：[`src/lib/markdown.ts`](src/lib/markdown.ts) — 自定义 frontmatter 解析器（无 gray-matter 依赖，浏览器兼容）
- **渲染链**：`?raw` import（构建时注入原始字符串）→ 自定义 frontmatter 解析 → `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-slug` 渲染

### 组件树

```
App → Layout → Masthead (顶部导航)
            → Sidebar (头像、个人信息、社交图标)
            → MarkdownPage → ReactMarkdown (渲染 .md 内容)
```

### 关键依赖

| 类别 | 库 |
|------|-----|
| Markdown 渲染 | `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-slug` |
| 样式 | Tailwind CSS 4 (`@tailwindcss/vite` + `@tailwindcss/typography`) |
| 图标 | `react-icons` (Font Awesome 替代) |

## 已知坑点

1. **不要引入 gray-matter**：它在浏览器端执行 `eval()` 会白屏。frontmatter 解析用 `src/lib/markdown.ts` 中的自定义实现。

2. **标题中不要用 emoji**：`rehype-slug` 依赖 `github-slugger`，emoji 会被转成 `-` 前缀（`📖 Educations` → ID `-educations`），导致导航锚点不匹配。

3. **导航 URL 必须匹配 heading slug**：`site.ts` 中 `navigation[].url` 的值（如 `/#educations`）必须与 `about.md` 中对应标题经 `github-slugger` 生成的 ID 完全一致。

4. **Docker CMD 用 `vite preview`**：不是 nginx，不是 jekyll serve。容器监听 3719，上游 Nginx 反代。

5. **scroll-margin-top**：[`src/index.css`](src/index.css) 中设置 `4rem` 偏移，防止 sticky 导航遮挡锚点跳转位置。

## 文件结构

```
content/about.md         ← 内容（Markdown，用户编辑入口）
src/
  config/site.ts         ← 站点配置
  components/
    Layout.tsx           ← 整体布局
    Masthead.tsx         ← 顶部导航（响应式，移动端汉堡菜单）
    Sidebar.tsx          ← 个人信息侧边栏
    MarkdownPage.tsx     ← Markdown 渲染
  lib/markdown.ts        ← frontmatter 解析器
  App.tsx                ← 根组件，构建时加载 .md
  main.tsx               ← 入口
  index.css              ← Tailwind + 锚点偏移
public/images/           ← 静态图片
```

## 注意

- `google_scholar_crawler/` 是旧项目遗留，与新前端无关。
- `images/` 目录保留在项目根目录（原 Jekyll 资源），`public/images/` 是 Vite 实际使用的副本。
