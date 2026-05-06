# 폴더 창 status bar 도입 — 설계 문서

작성일: 2026-05-06
브랜치: `refactor/programs-polish`

## 배경 (Why)

[`ProgramComponent.style.ts:20-21`](../../src/features/window-shell/ProgramComponent.style.ts#L20-L21) 의 grid template (`windowHeader / headerSub / 1fr / windowBottom`) 은 4번째 row 로 status bar 슬롯 `windowBottom` 을 예약하고 있다. 그러나 실제로 이 슬롯에 무언가를 렌더하는 프로그램은 [`ImageProgram`](../../src/features/program-image/ImageProgram.tsx#L42-L45) 한 곳뿐이고, 폴더 창에는 정보 노출 수단이 없다.

문제:

1. **폴더 창에 항목 정보가 없다** — 사용자는 현재 폴더에 몇 개의 항목이 있는지, 몇 개를 선택했는지 알 수 없다. Windows 탐색기에서는 status bar 가 이 정보를 항상 노출한다.
2. **창마다 하단 모양이 다르다** — Image 창만 하단에 회색 띠가 있고, Folder/DOC 창은 슬롯이 비어 있어 윈도우 배경(`windowChrome.bg`) 이 그대로 노출된다. 같은 종류의 창인데 시각적으로 통일감이 없다.
3. **선택 상태가 단일 ID 로만 표현돼 다중 선택 확장이 어렵다** — [`useFolderNavigation.ts:16`](../../src/features/program-folder/hooks/useFolderNavigation.ts#L16) 의 `selectedId: ProgramId | null` 은 선택된 ID 한 개만 들고 있다. 카운트 노출은 사실 "선택한 항목의 *개수*" 에 대한 질문이므로, 인터페이스가 길이 개념을 담을 수 있어야 자연스럽다.

## 설계 결정 사항

사용자 검토를 거쳐 다음 결정으로 합의했다.

### 결정 1. 모든 프로그램 창의 `bottomArea` 슬롯을 항상 렌더한다

- 그리드는 이미 `windowBottom` 행을 예약하고 있으므로, 모든 프로그램이 슬롯에 `<div className="bottomArea">` 를 (비어 있더라도) 렌더해 시각 일관성을 보장한다.
- ImageProgram: 기존 그대로 (이미 `1 / N image-name` 표시 중).
- FolderProgram: 새로 추가 — 항목/선택 카운트를 표시하는 `<FolderStatusBar>` 컴포넌트.
- DOCProgram: 빈 `<div className="bottomArea" />` 만 렌더.
- 다른 슬롯 미사용 프로그램이 있으면 동일하게 빈 div 추가.

### 결정 2. status bar 컴포넌트를 분리한다 — `FolderStatusBar.tsx`

- 위치: `src/features/program-folder/ui/FolderStatusBar.tsx`
- props: `{ totalCount: number; selectedCount: number }`
- 출력 규칙:
  - 첫 번째 span: `{totalCount}개 항목` — 항상 렌더.
  - 두 번째 span: `{selectedCount}개 항목 선택함` — `selectedCount > 0` 일 때만 렌더 (0 이면 두 번째 span 자체를 만들지 않음).
- separator 는 텍스트 `"|"` 를 직접 넣지 않고 두 번째 span 의 `::before { content: "|" }` (CSS) 로 처리. 0 일 때 두 번째 span 이 없으므로 separator 도 자연스럽게 사라진다.
- 컴포넌트로 분리하는 이유: 테스트 단위가 명확해지고 (props 기반 단위 테스트만 함), 향후 다른 종류의 status bar (예: 정보 창의 hover 텍스트) 가 추가될 때 패턴이 보인다.

### 결정 3. 훅을 다중 선택 가능 인터페이스로 리팩터한다

- `useFolderNavigation`:
  - `selectedId: ProgramId | null` → `selectedIds: ProgramId[]`
  - `setSelectedId(id)` → `setSelectedIds([id])`
  - `setSelectedId(null)` → `setSelectedIds([])`
- `FolderGrid`:
  - prop `selectedId` → `selectedIds`
  - 내부 비교 `item.id === selectedId` → `selectedIds.includes(item.id)`
- 카운트 계산은 호출부에서 `selectedIds.length` 한 줄.
- 현재 동작은 단일 선택과 동일하다 (배열 길이는 항상 0 또는 1). 다중 선택 도입 시 인터페이스 변경 없이 자연 확장.
- 기존 동작/스타일 (`folder_selected` 클래스 부여) 회귀 없어야 한다.

### 결정 4. `bottomArea` 배경을 `windowChrome.bg` 보다 약간 회색으로 차별화한다

- [`ProgramComponent.style.ts:211-219`](../../src/features/window-shell/ProgramComponent.style.ts#L211-L219) `.bottomArea` 에 `backgroundColor: "surface.light"` 추가 (panda token, gray.100).
- separator 스타일도 같은 파일에 추가:
  - `& .bottomArea > span + span::before { content: "|"; px: 8 (좌우 패딩) }` 형태. 정확한 토큰/마진은 구현 단계에서 디테일.
- 새 토큰 도입은 하지 않는다 (overkill). `surface.light` 가 부족하면 plan 단계에서 재논의.

## 설계 규칙 (작업 중 지킬 원칙)

- separator 는 항상 CSS 로만. JSX 안에 `"|"` 텍스트나 별도 separator 엘리먼트를 두지 않는다.
- `selectedCount` 는 `selectedIds.length` 로 도출. JSX 안에서 `selectedId ? 1 : 0` 같은 임시 변환 금지 (훅 인터페이스가 이미 배열로 통일됨).
- `<FolderStatusBar>` 는 props 만 보고 렌더 — 외부 상태/훅 접근 금지.
- `bottomArea` 는 모든 프로그램에서 *반드시* 렌더 — 빈 슬롯이라도 회색 띠가 보이도록.

## 변경 대상

### 수정
- [`src/features/program-folder/FolderProgram.tsx`](../../src/features/program-folder/FolderProgram.tsx) — `selectedId` → `selectedIds` 분해, `<FolderStatusBar>` 렌더
- [`src/features/program-folder/hooks/useFolderNavigation.ts`](../../src/features/program-folder/hooks/useFolderNavigation.ts) — `selectedIds: ProgramId[]` 배열로
- [`src/features/program-folder/ui/FolderGrid.tsx`](../../src/features/program-folder/ui/FolderGrid.tsx) — prop `selectedIds` 사용, `includes` 비교
- [`src/features/program-folder/__tests__/FolderProgram.test.tsx`](../../src/features/program-folder/__tests__/FolderProgram.test.tsx) — 기존 동작 회귀 없음 확인 (변경 없거나 최소)
- [`src/features/program-doc/DOCProgram.tsx`](../../src/features/program-doc/DOCProgram.tsx) — 빈 `<div className="bottomArea" />` 추가
- [`src/features/window-shell/ProgramComponent.style.ts`](../../src/features/window-shell/ProgramComponent.style.ts) — `.bottomArea` 배경색 + separator CSS 추가

### 신규
- `src/features/program-folder/ui/FolderStatusBar.tsx` — props 기반 status bar 컴포넌트
- `src/features/program-folder/__tests__/FolderStatusBar.test.tsx` — 단위 테스트

### 변경 없음 (확인용)
- [`src/features/program-image/ImageProgram.tsx`](../../src/features/program-image/ImageProgram.tsx) — 이미 `bottomArea` 사용 중

## 테스트 범위 (확정)

단위 테스트만 한다. 통합 흐름 테스트는 안 함.

`FolderStatusBar.test.tsx`:

| 케이스 | 입력 props | 기대 |
|---|---|---|
| 선택 없음 | `totalCount=3, selectedCount=0` | "3개 항목" 한 span 만 렌더. 두 번째 span 없음. |
| 단일 선택 | `totalCount=3, selectedCount=1` | "3개 항목" + "1개 항목 선택함" 두 span. |
| 빈 폴더 | `totalCount=0, selectedCount=0` | "0개 항목" 한 span 만 렌더. |
| 다중 선택 (가상) | `totalCount=5, selectedCount=2` | "5개 항목" + "2개 항목 선택함" 두 span. |

separator 의 CSS 적용 여부는 단위 테스트에서 검증하지 않음 (스타일 검증은 시각 확인 영역).

## 성공 기준 (Definition of Done)

### 기능
- [ ] 폴더 창 하단에 회색 띠와 "N개 항목" 텍스트가 항상 표시된다.
- [ ] 항목 클릭 시 " | M개 항목 선택함" 부분이 추가된다 (텍스트 "|" 가 아닌 CSS).
- [ ] 좌측 화살표 (부모 폴더 이동) 또는 다른 폴더 진입 시 선택이 해제되어 두 번째 부분이 사라진다.
- [ ] DOC 창, Image 창의 하단도 동일한 회색 띠로 보인다.
- [ ] 단일 선택 시각 동작 (`folder_selected` 클래스) 은 회귀 없이 동일하다.

### 기술 부채 비-증가
- [ ] eslint / typecheck / vitest 모두 통과.
- [ ] 기존 `FolderProgram.test.tsx` 의 모든 케이스 그대로 통과.
- [ ] `selectedIds` 인터페이스 변경이 `program-folder` 외부에 새 의존을 만들지 않음.

## 향후 plan 으로 이어지는 인터페이스

세부 Phase / 체크리스트 / 커밋 매핑은 본 문서를 입력으로 한 plan 문서 (`2026-05-06-folder-status-bar-plan.md`) 에서 작성한다. plan 작성 시 Phase 분해 기준은:

- Phase A — `useFolderNavigation` + `FolderGrid` 의 `selectedId → selectedIds` 리팩터. 동작/테스트 회귀 없음.
- Phase B — `FolderStatusBar` 컴포넌트 신설 + 단위 테스트 (TDD).
- Phase C — `FolderProgram` 에서 `<FolderStatusBar>` 렌더 + `DOCProgram` 의 빈 `bottomArea` 추가.
- Phase D — `ProgramComponent.style.ts` 의 `.bottomArea` 배경/separator CSS.

각 Phase 는 자기 완결적으로 실행/검증 가능해야 한다.
