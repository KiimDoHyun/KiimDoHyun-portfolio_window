# 프로그램 윈도우 이동/리사이즈 정리 — 설계 문서

작성일: 2026-05-05
브랜치: `refactor/programs-polish`

## 배경 (Why)

`src/features/window-shell/` 의 프로그램 창은 헤더 드래그 이동, 우측 하단 리사이즈, 최소화/최대화/닫기 동작을 제공한다. 동작 자체는 작동하나 다음 세 가지 문제가 있다.

1. **이동/리사이즈 시 layout thrashing**
   - [`useWindowDrag.ts:30-44`](../../src/features/window-shell/hooks/useWindowDrag.ts#L30-L44), [`useWindowResize.ts:34-52`](../../src/features/window-shell/hooks/useWindowResize.ts#L34-L52) 모두 매 `mousemove` 마다 `box.offsetLeft/Top/Width/Height` 를 **읽고** 같은 프레임에 `box.style.left/top/width/height` 를 **쓴다**. 같은 프레임 내 read↔write 교차는 brower 의 forced layout 을 유발한다.
   - `localStorage.setItem` 이 `mousemove` 마다 호출된다 (이동 2회, 리사이즈 2회).
   - `box.style.transition = "0s"` 도 매 frame 다시 설정한다.
   - `requestAnimationFrame` 배칭 없음.
   - 위치는 `left/top` 으로 표현되어 있어 layout/paint 단계를 매번 거친다 (composite-only 가속 불가).

2. **리사이즈 핸들이 우측 하단 4×4px 한 곳뿐**
   - [`WindowResizeHandles.tsx:11-21`](../../src/features/window-shell/ui/WindowResizeHandles.tsx#L11-L21) 에 5개 `div` 가 있으나 `bottom_right` 한 곳에만 핸들러가 연결돼 있고, 나머지는 빈 `div`.
   - 4개 변(top/right/bottom/left edge) 핸들이 아예 없다.
   - 핸들 영역 4×4px 은 잡기 어렵다 ([`ProgramComponent.style.ts:25-54`](../../src/features/window-shell/ProgramComponent.style.ts#L25-L54)).
   - 커서 매핑이 일부 잘못돼 있다 (`bottom_left → ne-resize`, `bottom_right → nw-resize` 모두 반대).

3. **창이 화면 밖으로 사라질 수 있다**
   - 드래그/리사이즈 어디에도 viewport 경계 클램핑이 없다.
   - 마우스가 viewport 안에서만 발화하는 부수효과로 "마우스가 잡은 점" 만 보호되며, 사용자가 헤더 하단을 잡고 위로 끌면 헤더 거의 전부가 viewport 위로 사라진다 → 다시 잡을 수 없는 버그.
   - 리사이즈는 `MIN_WIDTH/MIN_HEIGHT` 만 검사하고 max 가 없어 viewport 를 넘어 키울 수 있다.

## 설계 결정 사항

사용자 검토를 거쳐 다음 결정으로 합의했다 (선택지 비교는 본 문서의 검토 과정에서 평가됨).

### 결정 1. 이동은 transform, 리사이즈는 width/height 유지

- **이동(드래그)**: `transform: translate3d(x, y, 0)` 으로 전환. 박스의 base position 은 `left:0; top:0` 으로 고정하고, 위치는 transform 으로만 표현. composite-only 단계만 거치므로 GPU 가속.
- **리사이즈**: `width/height` 변경은 유지 (자식 콘텐츠가 새 크기로 흘러야 하므로 layout/paint 는 본질적으로 불가피). 단 절차상 군더더기는 모두 제거.

### 결정 2. 리사이즈 핸들 8개 (4 변 + 4 모서리), 안 절반 / 밖 절반

- 변 두께 `8px` (안 4 / 밖 4), 모서리 `14×14px` (안 7 / 밖 7).
- 모서리 핸들이 변 핸들 위에 (`z-index` 우선) — 모서리를 잡을 때 인접한 변에 가로채이지 않도록.
- 헤더 드래그영역과 겹치는 `top` 변은 핸들이 위에 (`z-index`).

### 결정 3. 클램핑은 부드럽게 (Windows 식)

- 사용 가능 영역 = `(0, 0) ~ (innerWidth, innerHeight - 50)` (`50` = `taskbar` 토큰).
- **이동**:
  - `top ≥ 0` (헤더가 viewport 위로 안 사라짐)
  - `top ≤ area.bottom - headerHeight` (헤더가 taskbar 윗선을 안 넘음 — 항상 보임)
  - 좌/우는 명시적 클램핑 없음. 드래그 가능 영역이 헤더의 좌/중앙(우측 버튼 제외) 으로 한정되므로 마우스 자연 보호로 충분.
- **리사이즈**:
  - min: `w ≥ 300, h ≥ 60` (기존 유지)
  - max: `x + w ≤ area.right`, `y + h ≤ area.bottom`
  - top/left 핸들로 좌/상 키울 때는 `x ≥ 0, y ≥ 0` 동시 적용 (음수 방향으로 나가지 않음)

### 결정 4. 좌표 표현을 숫자 4-tuple `(x, y, w, h)` 로 통일

- localStorage 키는 신규 키 `${id}x`, `${id}y`, `${id}w`, `${id}h` 를 사용 (모두 정수 px).
- 기존 키 `${id}Left`, `${id}Top`, `${id}width`, `${id}height` 는 **무시하고 새 키만 사용** (위치 기억의 손실은 무관). 언마운트 시 새 키만 정리.
- 최대화는 `{ x:0, y:0, w: innerWidth, h: innerHeight - 50 }` 즉시 적용 (calc 문자열 없음).

## 설계 규칙 (작업 중 지킬 원칙)

- **`box.offsetLeft/Top/Width/Height` 직접 read 금지**. 좌표/크기는 항상 ref 에 캐시한다.
- **DOM 쓰기는 `requestAnimationFrame` 한 프레임에 1회**로 배칭한다.
- **`localStorage.setItem` 은 `mouseup` 시 1회**만 호출한다.
- **`box.style.transition` 토글은 mousedown(`"none"`) / mouseup(복원) 한 번씩**만 한다.
- 클램핑은 항상 **박스 좌표 기준** (마우스 좌표 기준 아님) 으로 강제한다.
- 핸들 8방향 분기 로직은 **단일 함수 (`applyResizeDirection`)** 로 통합해 위치/크기 계산이 모두 한 곳에서 보이게 한다.
- `headerHeight = 32`, `taskbarHeight = 50` 는 panda token (`sizes.windowHeader`, `sizes.taskbar`) 과 동일한 상수로 선언하고, 토큰 변경 시 한 곳에서 추적 가능하게 둔다.

## 변경 대상

### 수정
- [`src/features/window-shell/hooks/useWindowDrag.ts`](../../src/features/window-shell/hooks/useWindowDrag.ts) — transform 전환 + rAF + 상/하 클램핑
- [`src/features/window-shell/hooks/useWindowResize.ts`](../../src/features/window-shell/hooks/useWindowResize.ts) — 8방향 분기 + 절차 최적화 + max 클램핑
- [`src/features/window-shell/hooks/useWindowLifecycle.ts`](../../src/features/window-shell/hooks/useWindowLifecycle.ts) — 좌표를 `(x, y, w, h)` 숫자로 통일, 최대화/복원/min 트랜지션 동기화
- [`src/features/window-shell/ui/WindowResizeHandles.tsx`](../../src/features/window-shell/ui/WindowResizeHandles.tsx) — 8개 핸들, 핸들별 `direction` 인자
- [`src/features/window-shell/ProgramComponent.style.ts`](../../src/features/window-shell/ProgramComponent.style.ts) — 핸들 크기/커서/위치, base `left:0; top:0`
- [`src/features/window-shell/__tests__/WindowShell.test.tsx`](../../src/features/window-shell/__tests__/WindowShell.test.tsx) — 8핸들 렌더 검증 추가

### 신규
- `src/features/window-shell/lib/geometry.ts` — `getAvailableArea()`, `clampDragPosition()`, `clampResizeGeometry()`, `applyResizeDirection()`
- `src/features/window-shell/lib/persist.ts` — `loadGeometry(id)` / `saveGeometry(id, geom)`
- `src/features/window-shell/lib/__tests__/geometry.test.ts` — 8방향 리사이즈 + 클램핑 단위 테스트

## 성공 기준 (Definition of Done)

### 기능
- [ ] 헤더의 드래그 가능 영역(아이콘/타이틀/드래그영역) 을 잡고 4 방향으로 끝까지 끌어도, 헤더 하단이 taskbar 윗선을 넘지 않고 헤더 윗변이 viewport 위로 나가지 않는다.
- [ ] 좌/우는 마우스가 viewport 끝까지 가는 만큼 따라가고, 헤더의 마우스 잡은 점은 항상 화면 안에 보인다 (자연 보호).
- [ ] 4 모서리 + 4 변 = 8 곳 모두에서 리사이즈 가능. 각 핸들의 커서가 OS 표준에 맞다.
- [ ] 모든 방향에서 리사이즈 시 윈도우 우/하단이 사용 가능 영역을 넘지 않는다. 좌/상 방향으로 키울 때 위치도 음수가 되지 않는다.
- [ ] 최대화/복원 후에도 위치/크기가 일관된다. 새로고침 후 마지막 위치/크기가 복원된다.

### 성능
- [ ] 드래그 중 DevTools Performance 의 "Recalculate Style" / "Layout" 카운트가 mousemove 당 0회 (transform-only). 즉 박스 자체의 layout 은 발생하지 않음.
- [ ] 리사이즈 중에는 layout 이 발생하나, `mousemove` 당 forced layout 1회 이하 (read 제거). DOM write 는 rAF 한 프레임당 1회.
- [ ] `localStorage.setItem` 은 드래그/리사이즈 1회당 mouseup 시 1회만 호출됨.

### 검증 항목 (수동)
- [ ] 헤더 하단을 잡고 위로 끌어도 헤더가 사라지지 않음.
- [ ] 헤더 상단을 잡고 아래로 끌어도 헤더가 taskbar 뒤로 안 들어감.
- [ ] 헤더 좌/우 끝을 잡고 끌면 마우스를 따라가고 헤더 일부가 자연스럽게 보임.
- [ ] 8개 핸들 모두 마우스 hover 시 올바른 커서로 바뀜.
- [ ] 8개 핸들 모두 리사이즈 동작이 자연스러움 (특히 top/left 계열에서 위치+크기가 동시에 바뀜).
- [ ] 리사이즈로 viewport 경계 침범 불가. 좌/상으로 키울 때 음수 위치 불가.
- [ ] 최대화/복원, 최소화/복원, 닫고 다시 열기 모두 정상.
- [ ] 새로고침 후 위치/크기 복원.

### 기술 부채 비-증가
- [ ] 기존 `useDrag.tsx` 등 다른 컴포넌트가 사용하는 별도 훅에 영향 없음 (수정 대상은 `window-shell` 내부 한정).
- [ ] eslint / typecheck / vitest 모두 통과.

## 향후 plan 으로 이어지는 인터페이스

세부 Phase / 체크리스트 / 커밋 매핑은 본 문서를 입력으로 한 plan 문서 (`2026-05-05-program-window-polish-plan.md`) 에서 작성한다. plan 작성 시 Phase 분해 기준은:

- Phase A — 좌표 표현 통일 + geometry 유틸 도입 (`geometry.ts`, `persist.ts` 신설, lifecycle 의 `(x,y,w,h)` 숫자 전환). 동작은 기존과 동일해야 함.
- Phase B — 이동(드래그) transform 전환 + 상/하 클램핑.
- Phase C — 8방향 리사이즈 핸들 + 분기 로직 + 영역 max 클램핑.
- Phase D — 핸들 스타일 (안 절반 / 밖 절반, 커서 수정).
- Phase E — 절차 최적화 검증 (Performance 측정) + 테스트 보강.

각 Phase 는 자기 완결적으로 실행/검증 가능해야 한다.
