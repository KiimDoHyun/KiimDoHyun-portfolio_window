# StatusBar 재귀 트리 렌더링 설계

## 배경 (Why)

PR #45(바탕화면 구조 재정의) 에서 JSON 폴더를 리네임했으나, `selectStatusBarViewModel` 이 구(舊) 폴더명 3개(`"금오공과대학교 셈틀꾼"`, `"금오공과대학교 컴퓨터공학과 학생회"`, `"(주)아라온소프트"`) 를 **이름 하드코딩** 으로 참조하고 있어, 시작 메뉴 센터 영역("프로젝트" 목록) 이 통째로 비어버리는 회귀가 발생했다.

동일한 구조적 리스크가 기술스택 영역 셀렉터에도 존재한다. `"MAIN_TECH"`, `"SUB_TECH"` 라는 내부 식별자 이름을 코드가 직접 참조하므로, 같은 종류의 리네임 사고가 언제든 재발할 수 있다.

근본 원인은 "셀렉터가 특정 폴더 이름을 알고 있다" 는 것이다. 이번 설계는 **트리 구조 기반** 으로 셀렉터를 전환해, 이름 의존성을 최소화하고 미래 카테고리 추가/리네임에 자동으로 따라가도록 바꾼다.

## 설계 규칙

- **이름 하드코딩은 최소화한다.** 셀렉터 내부에 남겨도 되는 이름은 `"내컴퓨터"`, `"기술스택"` 2개(루트 exclude 리스트) 로 한정한다. 이 둘은 **바탕화면에 가시적으로 노출되는 식별자** 라 리네임 확률이 극히 낮고, 한 군데에만 존재하므로 회귀 발생 시 즉시 추적 가능하다.
- **셀렉터는 flat list + `depth` 필드로 반환한다.** 재귀 tree 구조를 반환하면 렌더 측이 재귀 컴포넌트가 되어 `React.memo` 효과가 떨어진다. flat 은 map 순회만으로 렌더 가능하고 테스트도 배열 비교로 단순해진다.
- **렌더 패러다임은 유지한다.** 센터 영역의 "세로 1줄 박스 리스트", 기술스택의 "헤더 + flex-wrap 그리드" 시각 구조를 그대로 계승한다. 깊이 표현은 들여쓰기(`paddingLeft = depth * 12px`) + 폰트 차등으로 해결한다.
- **폴더 노드는 항상 펼친 상태로 렌더한다.** 접기/펼치기 토글, 폴더 창 열기 등은 이번 스코프 밖.
- **JSON 의 `MAIN_TECH`, `SUB_TECH` 를 사용자향 문구로 교체한다.** 셀렉터에서 내부 식별자 하드코딩을 완전히 제거하려면 폴더명 자체가 UI 헤더 텍스트가 되는 게 자연스럽다. 다른 폴더들(`셈틀꾼`, `와탭랩스` 등) 이 이미 한글 라벨이라 일관성도 유지된다.

## 성공 기준 (Definition of Done)

- [ ] `selectStatusBarViewModel.ts` 에서 하드코딩된 폴더 이름이 `"내컴퓨터"`, `"기술스택"` 2개로 축소됨
- [ ] `StatusBarViewModel` 이 `projects: Array<StatusBarTreeItem>` + `techStack: Array<StatusBarTreeItem>` + `myComputerId` 형태로 재구성됨 (`techStackMain`/`techStackSub` 필드 제거)
- [ ] `StatusBarTreeItem` 이 `depth: number` 필드를 포함하고, 루트 카테고리가 `depth = 0`
- [ ] 시작 메뉴 센터 영역에 현직/경력/대학교 카테고리 + 그 하위 회사/학교/학회 + 각 DOC 이 DFS 순서로 들여쓰기와 함께 보임
- [ ] 시작 메뉴 기술스택 영역에 두 그리드(주로 사용하는 / 사용해본 있는) + 아이콘들이 기존과 시각적으로 동일하게 렌더됨
- [ ] 카테고리 폴더 이름을 임의로 바꾼 테스트 픽스처로도 셀렉터가 정상 동작 (회귀 방어 케이스)
- [ ] `pnpm test -- --watchAll=false` 전체 통과
- [ ] `pnpm exec tsc --noEmit` 에러 없음
- [ ] `pnpm build` 성공
- [ ] 수동 검증 체크리스트(본 문서 하단) 전 항목 통과

---

## 최종 데이터 모델

### 셀렉터 인터페이스

```ts
// src/shared/lib/file-system/selectors/selectStatusBarViewModel.ts

export interface StatusBarTreeItem {
    id: ProgramId;
    name: string;
    icon: string;
    type: ProgramType;   // FOLDER | DOC | IMAGE | INFO | BROWSER
    depth: number;       // 루트 카테고리 = 0
}

export interface StatusBarViewModel {
    projects: Array<StatusBarTreeItem>;    // 루트 exclude: "내컴퓨터", "기술스택"
    techStack: Array<StatusBarTreeItem>;   // "기술스택" 폴더 하위 DFS
    myComputerId: ProgramId | null;
}
```

### JSON 변경

```diff
-  "name": "MAIN_TECH",
+  "name": "주로 사용하는 기술 스택",

-  "name": "SUB_TECH",
+  "name": "사용해본적은 있는 기술",
```

### 셀렉터 알고리즘

```
projects:
  1. root 의 직계 자식 중, type === "FOLDER" 이고 name ∉ {"내컴퓨터", "기술스택"} 인 노드를 시작점으로
  2. 각 시작점에서 DFS 순회, depth = 시작점 0 부터 1씩 증가
  3. 방문 순서대로 flat list 에 push

techStack:
  1. root 의 직계 자식 중 name === "기술스택" 인 노드를 시작점으로
  2. 시작점 자체는 제외하고 그 자식부터 DFS (depth = 0 은 "주로 사용하는 기술 스택" 같은 서브폴더)
```

### 센터 영역 렌더링

[StatusBar.tsx:82-116](../../src/features/statusbar/components/StatusBar.tsx#L82-L116) 의 `projectDatas` 순회 로직을 다음으로 교체:

```tsx
{projects.map((item) => (
    <CenterAreaBox
        key={item.id}
        parentId={item.id}
        img={item.icon}
        name={item.name}
        depth={item.depth}
        showImg={item.type !== "FOLDER"}
        onClick={onClickBox}
    />
))}
```

`CenterAreaBox` 에 `depth: number` prop 추가:
- `paddingLeft: ${depth * 12}px` 로 들여쓰기
- `fontWeight`/`fontSize` 를 depth 에 따라 차등 (depth 0: bold/14px, depth 1: semibold/13px, depth ≥ 2: 기본 14px)

### 기술스택 영역 렌더링

[StatusBar.tsx:118-155](../../src/features/statusbar/components/StatusBar.tsx#L118-L155) 의 "고정된 두 섹션" 구조를 flat list 그룹핑으로 전환:

```tsx
// techStack 을 FOLDER 경계로 그룹핑
const sections = useMemo(() => groupTechStack(techStack), [techStack]);

{sections.map((section) => (
    <Fragment key={section.title}>
        <div className="rightArea_title"><p>{section.title}</p></div>
        <div className="rightArea_boxArea">
            {section.items.map((item) => (
                <RightAreaBox
                    key={item.id}
                    parentId={item.id}
                    img={item.icon}
                    name={item.name}
                    onClick={onClickBox}
                />
            ))}
        </div>
    </Fragment>
))}
```

`groupTechStack` 헬퍼: flat list 를 `reduce` 로 순회, `type === "FOLDER"` 가 나오면 새 섹션 시작, 그 뒤의 IMAGE 들을 해당 섹션 `items` 에 누적.

---

## 코드 영향도

| 파일 | 변경 |
|---|---|
| `src/shared/lib/file-system/selectors/selectStatusBarViewModel.ts` | 전면 재작성 (재귀 DFS + exclude 기반) |
| `src/shared/lib/file-system/selectors/__tests__/selectStatusBarViewModel.test.ts` | 신규 — 회귀 방어 케이스 포함 |
| `src/data/portfolio.json` | 폴더명 2개 변경 (`MAIN_TECH`, `SUB_TECH`) |
| `src/features/statusbar/components/CenterAreaBox.tsx` | `depth` prop 추가, 들여쓰기/폰트 차등 스타일 |
| `src/features/statusbar/components/StatusBar.tsx` | 센터/우측 영역 렌더 로직 재작성, `viewModel` 타입 업데이트 |
| `src/features/statusbar/StatusBar.tsx` | 외부 파사드 — prop 매핑 조정 (techStackMain/Sub → techStack) |
| `src/pages/DesktopPage/shells/StatusBarShell.tsx` | `viewModel` 필드 변경에 따른 소폭 조정 |

스키마/타입(`ProgramNode`, `FileSystemState`) 은 건드리지 않는다.

---

## 수정 파일 목록 (커밋 단위 예시)

체크리스트 한 줄이 커밋 메시지 1개에 대응하도록 설계한다. 실제 구현 계획은 별도 `*-plan.md` 문서에서 `writing-plans` 스킬이 Phase 로 분해한다.

- [ ] `refactor(statusbar): 셀렉터를 재귀 DFS + flat+depth 구조로 재작성`
- [ ] `test(statusbar): 셀렉터 단위 테스트 추가 (exclude/DFS/리네임 회귀 방어)`
- [ ] `refactor(data): 기술스택 서브폴더명 MAIN_TECH/SUB_TECH → 사용자향 한글로 교체`
- [ ] `refactor(statusbar): CenterAreaBox 에 depth prop 추가 — 들여쓰기와 폰트 차등`
- [ ] `refactor(statusbar): StatusBar 센터/우측 영역을 flat+depth 기반 렌더로 전환`
- [ ] `chore(statusbar): Shell/파사드 의 viewModel 필드 매핑 조정`

---

## 수동 검증

- [ ] `pnpm start` 로 개발 서버 띄우고 로그인 → 시작 버튼 클릭
- [ ] **센터 영역**: 최상위 카테고리(현직 / 경력 / 대학교) 3개가 depth 0 헤더로 보인다
- [ ] **센터 영역**: 각 카테고리 아래 회사/학교 폴더(와탭랩스 / 아라온소프트 / 셈틀꾼 / 컴퓨터공학과 학생회) 가 depth 1 로 들여쓰기되어 보인다
- [ ] **센터 영역**: 각 폴더 아래 DOC 12건이 depth 2 로 아이콘과 함께 들여쓰기되어 보인다
- [ ] **센터 영역**: DOC 클릭 시 해당 프로그램 창이 열린다
- [ ] **센터 영역**: depth 간 시각 구분(폰트 굵기/크기 차등 + 들여쓰기)이 충분한지 직접 본다. **부족하다면 설계 문서 "시각 조정" 절로 돌아가 추가 장치(구분선/상단 여백/배경)를 결정**한 뒤 재적용한다
- [ ] **기술스택 영역**: 두 개의 그룹 헤더("주로 사용하는 기술 스택", "사용해본적은 있는 기술") + 각 아래 아이콘 그리드가 리팩터 전과 동일하게 보인다
- [ ] **기술스택 영역**: 아이콘 클릭 시 기존과 동일한 동작 (프로그램 열기)
- [ ] **좌측 소개 영역 / 로그아웃**: 기존 동작 그대로 유지된다 (비기능 회귀 없음)
- [ ] `pnpm test -- --watchAll=false` 전체 통과
- [ ] `pnpm exec tsc --noEmit` 에러 없음
- [ ] `pnpm build` 성공

---

## 이번 스코프에서 **하지 않는** 일

- 폴더 접기/펼치기 토글 UX (D-2)
- 센터 영역 폴더 클릭 시 폴더 창 열기 (D-3)
- JSON 에 `role` 같은 메타 필드 도입 (스키마 확장)
- 기타 StatusBar 시각/레이아웃 대개편 (페이지 구조 유지)

필요 시 후속 설계 문서로 분리한다.
