# CRA → Vite 마이그레이션 + Panda CSS 안정화

> **브랜치:** `fix/panda-cli-mode` (워크트리 분리)
> **선행 조건:** master (clean)
> **동기:** 개발 서버에서 Panda CSS `@layer` 스타일이 간헐적으로 깨짐

---

## 배경 (Why)

### 문제

CRA 5.0.1 (webpack 5) + craco + Panda CSS PostCSS 플러그인 조합에서, 개발 서버 HMR 시 `@layer utilities` 등 Panda 생성 CSS가 간헐적으로 누락된다.

원인: Panda PostCSS 플러그인이 모듈 레벨 싱글톤 `Builder`를 사용하며, webpack HMR이 CSS를 재처리할 때 builder 상태와 경합이 발생한다. DevTools에서 확인하면 `base`·`reset` layer만 적용되고 `tokens`·`recipes`·`utilities` layer가 통째로 빠진다.

### 해결 방향

빌드 도구를 CRA(webpack) → Vite로 교체한다. Vite의 PostCSS 통합은 ESM 기반 모듈 단위 갱신이라 같은 경합이 발생하지 않는다. Panda CSS는 PostCSS 모드를 유지한다 (CLI 모드 불필요).

부수 효과:

- 개발 서버 cold start 5–10× 개선
- craco webpack override 해킹 제거 → `vite.config.ts` 하나로 통합
- CRA 유지보수 중단 리스크 해소

## 설계 규칙

- Panda CSS 설정 (`panda.config.ts`)은 변경하지 않는다
- React 컴포넌트 코드는 변경하지 않는다 (진입점·env 참조만 수정)
- path alias는 `vite-tsconfig-paths` 플러그인으로 tsconfig.json과 동기화한다 (이중 관리 방지)
- 기존 테스트가 전부 통과해야 Phase 완료로 인정한다

## 성공 기준 (Definition of Done)

- [ ] `pnpm dev`로 개발 서버가 정상 기동된다
- [ ] 모든 페이지(login, desktop)에서 Panda CSS 스타일이 정상 적용된다
- [ ] HMR 시 `@layer` 스타일이 깨지지 않는다 (10회 이상 컴포넌트 수정 후 확인)
- [ ] `pnpm build`가 성공하고 `dist/` 출력물이 생성된다
- [ ] `tsc --noEmit` 0 errors
- [ ] 기존 테스트 전부 pass (Vitest)
- [ ] `pnpm deploy`로 gh-pages 배포가 정상 동작한다
- [ ] 포트 8080 사용 시 자동으로 다음 포트(8081, 8082...)로 할당된다

---

## Phase 1: Vite 기반 구조 전환

**입력:** master 기반 워크트리 (clean)

### 작업 내용

- [ ] `vite`, `@vitejs/plugin-react`, `vite-tsconfig-paths` 설치 및 CRA 패키지 제거 (`react-scripts`, `@craco/craco`, `@craco/types`, `tsconfig-paths-webpack-plugin`)
- [ ] 루트에 `vite.config.ts` 생성 (plugin-react, vite-tsconfig-paths, base path, server port 8080 + auto-increment)
- [ ] `public/index.html` → 루트 `index.html`로 이동 및 Vite 형식으로 변환 (`%PUBLIC_URL%` 제거, `<script type="module" src="/src/index.tsx">` 추가)
- [ ] `postcss.config.js`를 `postcss.config.cjs`로 rename (Vite ESM 환경에서 CJS PostCSS 설정 호환)
- [ ] `craco.config.js` 삭제
- [ ] `package.json` scripts 수정 (`dev`, `build`, `preview`, `deploy`)
- [ ] `.gitignore`에 `dist/` 추가

### 완료 조건

- `pnpm dev`로 개발 서버가 기동되고 로그인 페이지가 렌더된다
- Panda CSS 스타일이 정상 적용된다 (`@layer` 5개 모두 DevTools에서 확인)

---

## Phase 2: 코드 마이그레이션

**입력:** Phase 1 완료 (Vite 개발 서버 기동 확인)

### 작업 내용

- [ ] `App.tsx`의 `process.env.PUBLIC_URL` → `import.meta.env.BASE_URL` 전환 (trailing slash 제거 처리 포함)
- [ ] `src/react-app-env.d.ts` 삭제 및 Vite 타입 선언 파일 추가 (`src/vite-env.d.ts`)
- [ ] TypeScript 5.x 업그레이드 및 tsconfig 조정 (`module: "ESNext"`, `moduleResolution: "bundler"`)

### 완료 조건

- `tsc --noEmit` 0 errors
- 로그인 → 데스크톱 라우팅이 정상 동작한다
- `pnpm build` 성공

---

## Phase 3: 테스트 환경 전환 (Jest → Vitest)

**입력:** Phase 2 완료 (`tsc --noEmit` pass, 빌드 성공)

### 작업 내용

- [ ] `vitest`, `@vitest/coverage-v8`, `jsdom` 설치 및 Jest 패키지 제거 (`@types/jest`)
- [ ] `vite.config.ts`에 vitest 설정 추가 (environment: jsdom, setupFiles, globals)
- [ ] `setupTests.ts` → Vitest 호환으로 수정 (`@testing-library/jest-dom/vitest` import)
- [ ] `package.json`의 jest `moduleNameMapper` 제거 (vite-tsconfig-paths가 대체)
- [ ] Panda CSS mock (`src/__mocks__/styledSystemCss.js`) Vitest 호환 확인
- [ ] 전체 테스트 실행 및 pass 확인

### 완료 조건

- `pnpm test` (vitest)로 기존 테스트가 전부 pass
- jest 관련 의존성이 package.json에 남아 있지 않다

---

## Phase 4: ESLint 정리 + 배포 검증

**입력:** Phase 3 완료 (테스트 전부 pass)

### 작업 내용

- [ ] `package.json`의 `eslintConfig`에서 `react-app`, `react-app/jest` 프리셋 제거 및 대체 설정
- [ ] `reportWebVitals.ts`, `web-vitals` 패키지 등 CRA 보일러플레이트 잔여물 정리
- [ ] `pnpm build` → `dist/` 출력물 검증 (base path, 에셋 경로)
- [ ] gh-pages 배포 스크립트에 `404.html` 복사 추가 (SPA fallback)
- [ ] `pnpm deploy` 실행 및 배포 확인

### 완료 조건

- ESLint가 에러 없이 실행된다
- gh-pages 배포 후 사이트가 정상 동작한다
- CRA 관련 패키지·설정이 프로젝트에 남아 있지 않다

---

## 수동 검증 (전체 Phase 완료 후)

- [ ] `pnpm dev` → 로그인 페이지 정상 렌더
- [ ] 로그인 → 데스크톱 전환 정상
- [ ] 바탕화면 아이콘 더블클릭 → 프로그램 창 열림
- [ ] 작업표시줄 아이콘 hover/클릭 정상
- [ ] 상태바·시간바·정보바 정상 표시
- [ ] 이미지 뷰어 `<` `>` 네비게이션 정상
- [ ] 10회 이상 컴포넌트 수정 후 HMR — `@layer` 스타일 깨지지 않음
- [ ] 워크트리 2개 동시 실행 시 포트 자동 분리 (8080, 8081)
- [ ] `pnpm build` → `dist/` 정상 생성
- [ ] gh-pages 배포 후 라우팅 정상 (`/window/login`, `/window/desktop`)
