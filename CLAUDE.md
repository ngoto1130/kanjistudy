# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5 application for studying kanji, built with React 19, TypeScript, and Tailwind CSS 4. The project uses Turbopack for faster builds and includes SpecKit integration for structured feature development.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
Starts the Next.js development server with Turbopack on http://localhost:3000

### Building for Production
```bash
npm run build
```
Creates an optimized production build with Turbopack

### Starting Production Server
```bash
npm start
```
Runs the production build locally

### Linting
```bash
npm run lint
```
Runs ESLint with Next.js TypeScript configuration

## Architecture

### Framework & Routing
- **Next.js 15.5** with App Router (not Pages Router)
- File-based routing in `src/app/`
- Server Components by default (use `'use client'` directive for Client Components)

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Use this alias for all imports within the codebase

### Styling
- **Tailwind CSS 4** with PostCSS
- Global styles in `src/app/globals.css`
- Geist Sans and Geist Mono fonts via `next/font/google`

### TypeScript Configuration
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler
- JSX: preserve (handled by Next.js)

### Project Structure
```
src/
  app/                 # App Router pages and layouts
    layout.tsx         # Root layout with fonts and metadata
    page.tsx           # Home page
    globals.css        # Global styles
public/                # Static assets (images, fonts, etc.)
```

## SpecKit Integration

This project uses SpecKit for structured feature planning and implementation. SpecKit workflow is available through slash commands:

- `/specify` - Create/update feature specifications
- `/plan` - Generate implementation plans from specs
- `/clarify` - Identify underspecified areas in specs
- `/tasks` - Generate actionable task lists
- `/analyze` - Cross-artifact consistency analysis
- `/implement` - Execute implementation plans
- `/constitution` - Manage project constitution

The `.specify/` directory contains templates and scripts for the SpecKit workflow. The constitution template is located at `.specify/memory/constitution.md`.

## Next.js Specifics

### Component Patterns
- Use Server Components by default for better performance
- Add `'use client'` directive only when using:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs
  - Event handlers
  - Context providers

### Image Optimization
- Use `next/image` component for all images
- Images in `public/` are served from root path (e.g., `/next.svg`)

### Metadata
- Configure page metadata using the `metadata` export in layout.tsx or page.tsx
- Type: `Metadata` from "next"

## Build Configuration

### Turbopack
- Enabled by default for both dev and build commands
- Significantly faster than webpack for this project size

### ESLint
- Uses `next/core-web-vitals` and `next/typescript` configs
- Ignores: `node_modules/`, `.next/`, `out/`, `build/`, `next-env.d.ts`


### UI Development
- **Maximize use of shadcn/ui components**
- **Always use shadcn MCP** (`mcp__shadcn__*` tools) to:
  - Search for available components
  - View component examples and demos
  - Get installation commands
  - Find usage patterns
- Prefer existing shadcn components over custom implementations
- Follow shadcn component patterns and conventions


### Pre-Deployment Best Practices

**ALWAYS run production build locally before pushing to avoid Cloud Run deployment failures:**

```bash
npm run build
```

**Why this is critical:**
- Development server (`npm run dev`) uses relaxed type checking
- Production build enforces strict TypeScript validation matching Cloud Run
- Catches type errors, import issues, and build-time problems early
- Saves CI/CD resources and deployment time

**Common issues caught by local builds:**
1. **Supabase relation queries return arrays**: Relations like `clients (name)` return `{ clients: {...}[] }`, not single objects
2. **Type assertions (`as`) can be dangerous**: Always validate actual response structure
3. **Missing null checks**: Remote API responses may differ from local development data

**Recommended workflow:**
```bash
# 1. Make code changes
# 2. Test locally
npm run dev

# 3. ALWAYS build before committing
npm run build

# 4. Only commit if build succeeds
git add .
git commit -m "..."
git push
```



## Development Philosophy

### Test-Driven Development (TDD)

- 原則としてテスト駆動開発（TDD）で進める
- 期待される入出力に基づき、まずテストを作成する
- 実装コードは書かず、テストのみを用意する
- テストを実行し、失敗を確認する
- テストが正しいことを確認できた段階でコミットする
- その後、テストをパスさせる実装を進める
- 実装中はテストを変更せず、コードを修正し続ける
- すべてのテストが通過するまで繰り返す


## Playwright MCP使用ルール
### 絶対的な禁止事項
1. **いかなる形式のコード実行も禁止**
	1. Python、JavaScript、Bash等でのブラウザ操作
	2. MCPツールを調査するためのコード実行
	3. subprocessやコマンド実行によるアプローチ
2. **利用可能なのはMCPツールの直接呼び出しのみ**
	1. playwright:browser_navigate
	2. playwright:browser_screenshot
	3. 他のPlaywright MCPツール
3. **エラー時は即座に報告**
	1. 回避策を探さない
	2. 代替手段を実行しない
	3. エラーメッセージをそのまま伝える

## Use ./Docs folder for all memos for human
When you are to make memos for human to read, you must put them under ./Docs folder
