# CRA → Vite 마이그레이션 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** CRA+craco+webpack을 Vite로 교체하여 Panda CSS @layer 스타일 깨짐을 해소하고 DX를 개선한다.

**Architecture:** react-scripts+craco를 제거하고 vite+@vitejs/plugin-react로 대체. PostCSS를 통한 Panda CSS 통합은 유지. path alias는 vite-tsconfig-paths로 tsconfig.json과 자동 동기화. 테스트는 Jest에서 Vitest로 전환.

**Tech Stack:** Vite 6, @vitejs/plugin-react, vite-tsconfig-paths, Vitest, Panda CSS 0.40 (PostCSS 모드)

**설계 문서:** `docs/plans/2026-04-13-cra-to-vite-migration-design.md`

**워크트리:** `.worktrees/fix/panda-cli-mode`

---

## Phase 1: Vite 기반 구조 전환

### Task 1: 패키지 교체

**Step 1: CRA 관련 패키지 제거**

```bash
pnpm remove react-scripts @craco/craco @craco/types tsconfig-paths-webpack-plugin
```

**Step 2: Vite 패키지 설치**

```bash
pnpm add -D vite @vitejs/plugin-react vite-tsconfig-paths
```

**Step 3: 커밋**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build(deps): CRA/craco 제거 및 Vite 패키지 설치"
```

---

### Task 2: vite.config.ts 생성

**파일:** 생성 — `vite.config.ts` (프로젝트 루트)

**Step 1: vite.config.ts 작성**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/KiimDoHyun-portfolio_window/",
  server: {
    port: 8080,
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
```

> `strictPort`는 기본값 `false`이므로 8080이 사용 중이면 자동으로 8081, 8082... 할당.
> `base`는 `package.json`의 `homepage`에서 가져온 값. gh-pages 서브디렉토리 배포용.

**Step 2: 커밋**

```bash
git add vite.config.ts
git commit -m "build(vite): vite.config.ts 생성 — react, tsconfigPaths, base path, port 설정"
```

---

### Task 3: index.html 이동 및 Vite 형식 변환

**파일:**
- 이동: `public/index.html` → `index.html` (프로젝트 루트)
- 수정: `index.html`

**Step 1: index.html을 루트로 이동**

```bash
git mv public/index.html index.html
```

**Step 2: Vite 형식으로 변환**

`index.html`을 아래 내용으로 교체:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Windows KDH Portfolio" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Windows_KDH_Portfolio</title>
</head>

<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
</body>

</html>
```

변경 사항:
- `%PUBLIC_URL%` 접두사 전부 제거 (Vite는 `public/` 정적 자산을 `/`로 제공)
- `<body>` 끝에 `<script type="module" src="/src/index.tsx">` 추가
- CRA 주석 제거

**Step 3: 커밋**

```bash
git add index.html
git commit -m "build(vite): index.html 루트 이동 및 Vite 형식 변환 — %PUBLIC_URL% 제거, module script 추가"
```

---

### Task 4: PostCSS 설정 호환 + CRA 설정 삭제

**파일:**
- rename: `postcss.config.js` → `postcss.config.cjs`
- 삭제: `craco.config.js`

**Step 1: PostCSS 설정 rename**

```bash
git mv postcss.config.js postcss.config.cjs
```

> Vite는 프로젝트를 ESM(`"type": "module"`)으로 취급한다. PostCSS 설정이 `module.exports`를 쓰고 있으므로 `.cjs` 확장자로 바꿔야 한다.

**Step 2: craco.config.js 삭제**

> 사용자에게 삭제 대상 고지: `craco.config.js`는 webpack alias + PostCSS 설정 override를 담당했으나, Vite에서는 `vite.config.ts`와 `vite-tsconfig-paths`로 대체되어 더 이상 필요하지 않다.

```bash
git rm craco.config.js
```

**Step 3: 커밋**

```bash
git add postcss.config.cjs
git commit -m "build(vite): postcss.config.js → .cjs rename, craco.config.js 삭제"
```

---

### Task 5: package.json scripts 및 .gitignore 수정

**파일:**
- 수정: `package.json`
- 수정: `.gitignore`

**Step 1: package.json scripts 수정**

기존:
```json
"start": "panda codegen && craco start",
"build": "panda codegen && craco build",
"test": "react-scripts test",
"eject": "craco eject",
"predeploy": "pnpm build",
"deploy": "gh-pages -d build"
```

변경:
```json
"dev": "panda codegen && vite",
"build": "panda codegen && vite build",
"preview": "vite preview",
"test": "react-scripts test",
"predeploy": "pnpm build",
"deploy": "cp dist/index.html dist/404.html && gh-pages -d dist"
```

변경 사항:
- `start` → `dev` (Vite 컨벤션)
- `craco start/build` → `vite` / `vite build`
- `eject` 제거 (Vite에 해당 없음)
- `preview` 추가 (빌드 결과 로컬 확인용)
- `deploy`에서 `build` → `dist`, 404.html 복사 추가 (SPA fallback)
- `test`는 Phase 3에서 vitest로 교체할 때까지 임시 유지

또한 `package.json`에 `"type": "module"` 추가 (최상위):
```json
"type": "module"
```

**Step 2: .gitignore에 dist/ 추가**

`.gitignore`에 아래 추가:
```
/dist
```

**Step 3: 개발 서버 기동 확인**

```bash
pnpm dev
```

Expected: Vite 개발 서버가 `http://localhost:8080`에서 기동되고 로그인 페이지가 렌더된다.

> 이 단계에서 `process.env.PUBLIC_URL` 참조로 인해 콘솔 경고가 나올 수 있다. Phase 2에서 수정한다.

**Step 4: 커밋**

```bash
git add package.json .gitignore
git commit -m "build(vite): package.json scripts 전환 및 .gitignore에 dist/ 추가"
```

---

## Phase 2: 코드 마이그레이션

### Task 6: process.env.PUBLIC_URL 전환

**파일:** 수정 — `src/App.tsx:12`

**Step 1: BrowserRouter basename 수정**

기존:
```tsx
<BrowserRouter basename={process.env.PUBLIC_URL}>
```

변경:
```tsx
<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
```

> Vite의 `import.meta.env.BASE_URL`은 trailing slash를 포함한다 (예: `/KiimDoHyun-portfolio_window/`).
> `BrowserRouter`의 `basename`은 trailing slash가 없어야 하므로 `.replace(/\/$/, "")` 처리.

**Step 2: 개발 서버에서 라우팅 확인**

```bash
pnpm dev
```

Expected: `http://localhost:8080/KiimDoHyun-portfolio_window/window/login`으로 리다이렉트되고 로그인 페이지가 정상 렌더.

**Step 3: 커밋**

```bash
git add src/App.tsx
git commit -m "refactor(app): process.env.PUBLIC_URL → import.meta.env.BASE_URL 전환"
```

---

### Task 7: 타입 선언 파일 교체

**파일:**
- 삭제: `src/react-app-env.d.ts` (존재하지 않을 수 있음 — 없으면 skip)
- 생성: `src/vite-env.d.ts`

**Step 1: CRA 타입 선언 삭제 (존재 시)**

```bash
git rm src/react-app-env.d.ts 2>/dev/null || echo "already absent"
```

**Step 2: Vite 타입 선언 생성**

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

**Step 3: 커밋**

```bash
git add src/vite-env.d.ts
git commit -m "build(types): CRA 타입 선언 → vite/client 타입 선언으로 교체"
```

---

### Task 8: TypeScript 5.x 업그레이드 및 tsconfig 조정

**파일:**
- 수정: `tsconfig.json`

**Step 1: TypeScript 5.x 설치**

```bash
pnpm add -D typescript@~5.7
```

> `moduleResolution: "bundler"`는 TS 5.0+ 필수.

**Step 2: tsconfig.json 수정**

기존:
```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": "./",
    "rootDir": "./src",
    "paths": { ... },
    "allowJs": true,
    "target": "ES2015",
    "outDir": "./dist",
    "moduleResolution": "Node",
    "module": "commonjs",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "lib": ["ES2015", "DOM", "DOM.Iterable"],
    "typeRoots": ["src/types", "node_modules/@types"],
    "types": ["node", "jest", "testing-library__jest-dom"],
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx"
  },
  "include": ["./src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

변경:
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "rootDir": "./src",
    "paths": {
      "@images/*": ["src/asset/images/*"],
      "@store/*": ["src/store/*"],
      "@styled-system/*": ["src/styled-system/*"],
      "@app/*": ["src/app/*"],
      "@pages/*": ["src/pages/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"]
    },
    "allowJs": true,
    "target": "ES2015",
    "outDir": "./dist",
    "moduleResolution": "bundler",
    "module": "ESNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "lib": ["ES2015", "DOM", "DOM.Iterable"],
    "typeRoots": ["src/types", "node_modules/@types"],
    "types": ["node", "testing-library__jest-dom"],
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx"
  },
  "include": ["./src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

변경 사항:
- `ignoreDeprecations: "6.0"` 제거 (TS5에서 불필요)
- `module`: `"commonjs"` → `"ESNext"`
- `moduleResolution`: `"Node"` → `"bundler"`
- `types`에서 `"jest"` 제거 (Phase 3에서 vitest로 교체)

**Step 3: 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

> `jest` 타입이 빠지면서 테스트 파일에서 `describe`/`it`/`expect` 등의 타입 에러가 날 수 있다. 이는 Phase 3에서 Vitest 글로벌 타입으로 해결하므로 이 단계에서는 테스트 파일 에러만 무시한다.

**Step 4: 빌드 확인**

```bash
pnpm build
```

Expected: `dist/` 디렉토리에 빌드 결과 생성.

**Step 5: 커밋**

```bash
git add tsconfig.json package.json pnpm-lock.yaml
git commit -m "build(ts): TypeScript 5.x 업그레이드 — module ESNext, moduleResolution bundler"
```

---

## Phase 3: 테스트 환경 전환 (Jest → Vitest)

### Task 9: Vitest 설치 및 Jest 제거

**Step 1: Vitest 패키지 설치**

```bash
pnpm add -D vitest jsdom @testing-library/jest-dom
```

> `@testing-library/jest-dom`은 이미 있지만 최신 버전이 vitest를 지원하므로 재설치.

**Step 2: Jest 관련 패키지 제거**

```bash
pnpm remove @types/jest
```

**Step 3: 커밋**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build(deps): Vitest 설치 및 Jest 타입 패키지 제거"
```

---

### Task 10: Vitest 설정 및 테스트 인프라 수정

**파일:**
- 수정: `vite.config.ts`
- 수정: `src/setupTests.ts`
- 수정: `package.json` (jest config 제거, test script 변경)

**Step 1: vite.config.ts에 vitest 설정 추가**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/KiimDoHyun-portfolio_window/",
  server: {
    port: 8080,
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    css: false,
    alias: {
      "@styled-system/css": "./src/__mocks__/styledSystemCss.js",
    },
  },
});
```

> `test.alias`로 Panda CSS mock을 지정. 나머지 alias는 `vite-tsconfig-paths`가 자동 처리.
> `css: false`로 CSS import를 무시 (테스트에서 CSS 파싱 불필요).

**Step 2: setupTests.ts 수정**

기존:
```ts
import '@testing-library/jest-dom';
```

변경:
```ts
import "@testing-library/jest-dom/vitest";
```

> `@testing-library/jest-dom/vitest`는 vitest의 `expect`를 자동 extend한다.

**Step 3: package.json에서 jest 설정 제거 및 test script 변경**

`package.json`에서 `"jest": { ... }` 블록 전체 제거.

`scripts.test` 변경:
```json
"test": "vitest run"
```

**Step 4: tsconfig.json types에 vitest 글로벌 추가**

`tsconfig.json`의 `types` 배열에서 `"testing-library__jest-dom"` 제거:
```json
"types": ["node"]
```

> Vitest 글로벌 타입은 `/// <reference types="vitest/config" />`와 `setupFiles`를 통해 자동 제공된다.
> `@testing-library/jest-dom`의 타입은 `setupTests.ts`의 import에서 자동 확장된다.

**Step 5: 전체 테스트 실행**

```bash
pnpm test
```

Expected: 17개 테스트 파일 전부 pass.

> 실패 시: vitest는 ESM 기반이므로 `require()` 사용 코드가 문제될 수 있다.
> `src/features/window-shell/__tests__/WindowShell.test.tsx`에서 `require("react")`를 사용하고 있으므로, 이 부분을 `import`로 변환해야 할 수 있다.

**Step 6: 커밋**

```bash
git add vite.config.ts src/setupTests.ts package.json tsconfig.json
git commit -m "test(vitest): Jest → Vitest 전환 — config, setupTests, mock alias 이관"
```

---

## Phase 4: ESLint 정리 + 배포 검증

### Task 11: ESLint 설정 교체

**파일:** 수정 — `package.json`

**Step 1: eslintConfig에서 react-app 프리셋 제거**

`package.json`의 `eslintConfig` 변경:

기존:
```json
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "overrides": [ ... ]
}
```

변경:
```json
"eslintConfig": {
  "overrides": [ ... ]
}
```

> `react-app` 프리셋은 react-scripts에 번들된 것이라 제거 후 사라진다.
> 이 프로젝트는 `overrides`에서 `no-restricted-imports` 정도만 커스텀하고 있으므로, 프리셋 없이도 동작한다.
> 필요하면 `eslint-config-react-app`을 별도 설치할 수 있지만, YAGNI — 현재 overrides만으로 충분.

**Step 2: 커밋**

```bash
git add package.json
git commit -m "build(eslint): react-app 프리셋 제거 — react-scripts 의존 해소"
```

---

### Task 12: CRA 보일러플레이트 잔여물 정리

**파일:**
- 삭제: `src/reportWebVitals.ts`
- 수정: `src/index.tsx` (reportWebVitals import/호출 제거)
- 삭제: `web-vitals` 패키지

**Step 1: web-vitals 패키지 제거**

```bash
pnpm remove web-vitals
```

**Step 2: reportWebVitals.ts 삭제**

> 사용자에게 삭제 대상 고지: `src/reportWebVitals.ts`는 CRA 보일러플레이트로, web-vitals 패키지에 의존하며 현재 실제 사용되지 않는다.

```bash
git rm src/reportWebVitals.ts
```

**Step 3: index.tsx에서 reportWebVitals 참조 제거**

`src/index.tsx`에서 아래 두 줄 제거:

```ts
import reportWebVitals from "./reportWebVitals";
```

```ts
reportWebVitals();
```

**Step 4: 커밋**

```bash
git add src/index.tsx src/reportWebVitals.ts package.json pnpm-lock.yaml
git commit -m "refactor(cleanup): reportWebVitals + web-vitals 제거 — CRA 보일러플레이트 정리"
```

---

### Task 13: 빌드 및 배포 검증

**Step 1: 빌드 확인**

```bash
pnpm build
```

Expected: `dist/` 디렉토리에 `index.html`, `assets/` 등 생성.

**Step 2: 빌드 결과 로컬 확인**

```bash
pnpm preview
```

Expected: `http://localhost:4173/KiimDoHyun-portfolio_window/`에서 사이트 정상 동작.

**Step 3: 배포 (사용자 확인 후)**

```bash
pnpm deploy
```

Expected: gh-pages에 배포 성공. `https://kiimdohyun.github.io/KiimDoHyun-portfolio_window/` 접속 시 정상 동작.

**Step 4: 커밋 (필요 시)**

배포 관련 수정이 있었다면 커밋.

---

## 최종 검증 체크리스트

Phase 전체 완료 후 아래를 확인한다:

```bash
# 타입 체크
npx tsc --noEmit

# 테스트
pnpm test

# 빌드
pnpm build
```

CRA 잔여물 확인:
```bash
# 이 중 하나라도 남아있으면 안 됨
grep -r "react-scripts" package.json
grep -r "craco" package.json
ls craco.config.js 2>/dev/null
```
