# ShangguanAlbert.github.io 仓库协作说明

本文件适用于当前仓库根目录及其所有子目录。

## 项目概览

- 这是一个基于 **React 19 + Vite 7 + TypeScript** 的个人学术主页。
- 核心内容以 Markdown 编写（`content/about.md`），构建时解析为 HTML，运行时零开销。
- 生产访问路径：`https://lotusai.extrotec.com/albert/resume`
- 机房外部 Nginx 负责 HTTPS、反向代理和缓存，容器内仅运行 `vite preview` 提供静态文件。
- **当前现网代理会把 `/albert/resume` 前缀剥离后再转发给容器**。因此仓库当前必须按**相对路径**构建，而不是把 `Vite base` 固定为 `/albert/resume/`。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19, TypeScript 5.8 |
| 构建 | Vite 7 (`@vitejs/plugin-react`) |
| 样式 | Tailwind CSS 4 (`@tailwindcss/vite` + `@tailwindcss/typography`) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-slug` |
| 图标 | `react-icons` |
| 前端解析 | 自定义 YAML frontmatter 解析器（`src/lib/markdown.ts`） |
| 部署 | `node:22-alpine` 容器，`vite preview` 启动在 3719 端口 |
| 包管理 | npm |

**这不是 Jekyll / Ruby 项目**。不要去找 `_config.yml`、`Gemfile`、`bundle exec`。`AGENTS.md` 的旧版本描述的是已废弃的 Jekyll 架构。

## 目录约定

```
content/about.md          ← 用户编写内容的唯一入口（YAML frontmatter + Markdown）
src/
  config/site.ts          ← 站点配置：作者信息、导航链接、社交链接
  components/
    Layout.tsx            ← 整体布局容器
    Masthead.tsx          ← 顶部导航栏（响应式 + 移动端汉堡菜单）
    Sidebar.tsx           ← 个人信息侧边栏（头像、姓名、社交图标）
    MarkdownPage.tsx      ← Markdown 渲染组件（react-markdown + 插件）
  lib/markdown.ts         ← 自定义 frontmatter 解析器
  App.tsx                 ← 根组件，构建时 import .md 文件
  main.tsx                ← React 入口
  index.css               ← Tailwind 全局样式 + 锚点偏移
public/images/            ← 静态图片资源（Vite 服务根路径）
dist/                     ← 构建产物（Git 忽略）
```

保留但不再参与构建的遗留目录：
- `images/` — 原 Jekyll 资源目录，`public/images/` 是 Vite 实际使用的副本
- `google_scholar_crawler/` — 旧 Google Scholar 抓取脚本

## Markdown 渲染链

这是本仓库最核心的前端逻辑，修改任一环节前必须理解全链：

```
1. content/about.md
      ↓  Vite ?raw import（构建时，文件内容作为字符串注入 bundle）
2. 原始字符串（含 YAML frontmatter）
      ↓  parseMarkdown() — src/lib/markdown.ts
3. { frontmatter: Record<string,string>, content: string }
      ↓  ReactMarkdown 组件 — src/components/MarkdownPage.tsx
4. React 组件树（HTML head ings 带 rehype-slug 自动生成的 id）
```

## 前端架构约束

### Markdown 解析器

`src/lib/markdown.ts` 中的 `parseMarkdown()` 是自定义实现，只做两件事：
1. 正则匹配 `---\n...\n---` 提取 YAML frontmatter
2. 按行解析 `key: value`，剥离引号

**严禁引入 `gray-matter`**。该库在浏览器端通过 `eval()` 动态加载解析器，会导致 React 组件未挂载、页面白屏。这是已验证的真实 bug。

### 标题与锚点跳转

`rehype-slug` 为每个标题自动生成 `id` 属性，底层使用 `github-slugger`。规则：
- 转为小写字母
- 非字母数字字符（包括 emoji）→ 替换为单个 `-`
- 连续的 `-` 折叠为一个

**标题中禁止使用 emoji**。`📖 Educations` 经 github-slugger 会生成 `-educations`（emoji → `-` 前缀），而非预期的 `educations`。这是已验证的真实 bug。

`site.ts` 中 `navigation[].url` 的值必须与生成 ID 完全一致。修改标题或导航后，验证方法：

```bash
node -e "const {slug} = require('./node_modules/github-slugger'); console.log(slug('你的标题文本'))"
```

### 锚点 CSS

`src/index.css` 中对 `.anchor`、`h1[id]`、`h2[id]` 等设置 `scroll-margin-top: 4rem`，防止 sticky 导航遮挡跳转位置。不要用 `position: relative; top: -4rem` 等 hack，它们不会改变浏览器的滚动目标位置。

### 关于 gray-matter 和 rehype-raw

`rehype-raw` 会将 Markdown 中的原始 HTML 标签解析为真实 DOM 节点（如 `<span>`、`<br>`、`<!-- -->`）。不加此插件时，HTML 标签会当作文本原样显示。本仓库在迁移之初未加，已产生过一次多余 HTML 文本显示 bug，后续不要随意移除。

## 运行与部署

### 本地开发

```bash
npm run dev      # 启动 Vite 开发服务器，HMR 即时刷新
```

默认监听 `http://localhost:5173`。

### 本地预览生产构建

```bash
npm run build && npm run preview
BASE_URL=./ npm run build && BASE_URL=./ npm run preview
```

监听 `http://localhost:3719`，与 Docker 端口一致。

### Docker 部署

```bash
docker compose up -d --build   # 构建并启动
docker compose logs --tail 100 # 查看日志
docker compose down            # 停止
```

`Dockerfile` 流程：
1. `node:22-alpine` 基础镜像
2. `npm ci` 安装依赖
3. `npm run build`（tsc + vite build；生产部署时通过 `BASE_URL=./` 构建相对资源路径）
4. `npm run preview` 启动静态服务（3719 端口）

**不要在容器内加 Nginx**。机房运维已配置外部 Nginx 反代到容器 3719 端口。

### 子路径部署边界

- 浏览器访问路径仍然是 `https://lotusai.extrotec.com/albert/resume/...`
- 但容器实际收到的是去掉前缀后的路径，如 `/`、`/assets/...`、`/images/...`
- 因此：
  - `docker-compose.yml` 中生产构建参数应保持 `BASE_URL=./`
  - 不要把 `vite.config.ts` 的 `base` 改回 `/albert/resume/`
  - 不要把站内锚点写成 `/#about-me` 这类根路径；应使用 `#about-me`
  - 静态资源不要硬编码为 `/albert/resume/...`，应通过相对路径或 `import.meta.env.BASE_URL` 生成

### 验证

```bash
curl -I http://localhost:3719/
# 预期：HTTP/1.1 200 OK

BASE_URL=./ npm run build && BASE_URL=./ npm run preview
curl -I http://localhost:3719/albert/resume/
# 预期：HTTP/1.1 200 OK
```

## 修改约束

### 修改 content/about.md 时

- 保持 `---` 包裹的 YAML frontmatter 在文件顶部
- 标题不要使用 emoji（会导致锚点 ID 偏移，见上文）
- 需要锚点时使用 `<span class='anchor' id='xxx'></span>` 放在目标位置
- HTML 注释 `<!-- -->` 可以保留，`rehype-raw` 会正确处理

### 修改 src/config/site.ts 时

- 修改导航 URL 后，必须验证与 `about.md` 标题经 github-slugger 生成的 ID 一致
- 修改 `author` 字段后检查 `Sidebar.tsx` 中 `socialLinks` 数组是否使用了对应字段
- 当前导航应保持 `#about-me` 这种页内锚点格式，不要改回 `/#about-me`
- 当前头像等静态资源应优先使用 `import.meta.env.BASE_URL` 拼接，不要写死根路径 `/images/...`

### 修改 src/components/ 时

- `Layout.tsx`：flex 布局，左侧 Sidebar 固定宽度 `w-72`，右侧 flex-1
- `Masthead.tsx`：sticky top-0，移动端 `md:hidden` 切换汉堡菜单
- `Sidebar.tsx`：`socialLinks` 数组决定显示哪些社交图标，新增社交链接在此添加
- `MarkdownPage.tsx`：rehype 插件顺序必须是 `[rehypeRaw, rehypeSlug]`（先解析 HTML，再生成 ID）

### 修改 Dockerfile 时

- 保持当前架构：外部 Nginx 代理 + 容器内 `vite preview`
- 不要改端口（3719）
- 不要升级 Node 大版本未经验证
- 如果部署仍依赖当前代理的“剥离 `/albert/resume` 前缀”行为，就不要把构建参数从 `BASE_URL=./` 改回子路径 base

## 故障排查

### 页面白屏

1. 打开浏览器 DevTools Console 查看 JS 报错
2. 常见原因：引入了 Node.js 专用库（如 gray-matter）
3. 检查 `npm run build` 是否成功

### 导航按钮不跳转

1. 验证标题 ID：
   ```bash
   node -e "const {slug} = require('./node_modules/github-slugger'); console.log(slug('Educations'))"
   ```
2. 对比 `site.ts` 中 `navigation[].url` 的值是否匹配
3. 确认标题无 emoji

### 多余 HTML 文本显示

- 确认 `MarkdownPage.tsx` 中 `rehypePlugins` 包含 `rehypeRaw`
- 确认 `npm install` 已执行

### Docker 构建失败

1. 先在本地验证 `npm run build` 通过
2. 检查 `package.json` 和 `package-lock.json` 是否存在且一致
3. 确认 `node:22-alpine` 镜像可用

### 部署后出现 “The server is configured with a public base URL …”

1. 先检查是否把 `Vite base` 或 `BASE_URL` 配成了 `/albert/resume/`
2. 如果当前代理仍然会剥离 `/albert/resume` 前缀，则这会导致 `vite preview` 认为收到的请求路径与 public base 不一致
3. 保持 `docker-compose.yml` 使用 `BASE_URL=./`，重新 `docker compose up -d --build`
4. 再验证：
   ```bash
   curl -I http://localhost:3719/
   curl -I http://localhost:3719/albert/resume/
   ```
