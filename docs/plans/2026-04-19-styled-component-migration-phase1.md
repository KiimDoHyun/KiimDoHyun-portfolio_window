# 스타일 응집도 리팩터링 Phase 1 — TaskBar 시범 변환 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [TaskBar.style.ts](../../src/features/taskbar/TaskBar.style.ts) 의 37개 `"& .child"` 네스팅을 styled() 컴포넌트로 분해하고, 사용처 컴포넌트를 명명된 styled 컴포넌트 사용으로 전환한다. 패턴 검증이 목적.

**Architecture:** 설계 문서 [`2026-04-19-styled-component-migration-design.md`](./2026-04-19-styled-component-migration-design.md) 의 패턴을 따른다. styled 컴포넌트 3개 이하면 컴포넌트 파일 안에 인라인, 4개 이상이면 별도 `*.style.ts`. CSS 변수로 전달하던 hover/preview 좌표는 React props + `style` prop 으로 전환.

**Tech Stack:** Panda CSS (`@pandacss/dev` 0.40), React 19, Vitest, `@testing-library/react`.

**참조:**
- 설계 문서: [`2026-04-19-styled-component-migration-design.md`](./2026-04-19-styled-component-migration-design.md)
- 커밋 규약: [`docs/rules/commit-convention.md`](../rules/commit-convention.md)

---

## 작업 범위

| 파일 | 변경 |
|---|---|
| `src/features/taskbar/TaskBar.style.ts` | **삭제** (모든 정의가 사용처로 이동) |
| `src/features/taskbar/TaskBar.tsx` | 인라인 styled 컴포넌트로 root 정의, `cssVars` 제거 |
| `src/features/taskbar/ui/StartButton.tsx` | 인라인 styled 컴포넌트 (1개) |
| `src/features/taskbar/ui/SystemTray.tsx` | 인라인 styled 컴포넌트 (~6개) → 4개 이상이므로 분리 검토 |
| `src/features/taskbar/ui/SystemTray.style.ts` | **신규 생성** |
| `src/features/taskbar/ui/ProgramIcons.tsx` | hover 좌표 prop 으로 받음 |
| `src/features/taskbar/ui/ProgramIcons.style.ts` | **신규 생성** (~7개 styled 컴포넌트) |
| `src/features/taskbar/ui/PreviewPopup.tsx` | preview 좌표/투명도 prop 으로 받음 |
| `src/features/taskbar/ui/PreviewPopup.style.ts` | **신규 생성** (~6개 styled 컴포넌트) |
| `src/features/taskbar/__tests__/TaskBar.test.tsx` | className 셀렉터 의존을 testid 또는 role 기반으로 변경 |

`src/features/taskbar/ui/PreviewWindowFrame.tsx` 는 이미 깔끔하게 `css()` 단위로 분리되어 있어 손대지 않는다.

---

## Phase 1 완료 조건

- [ ] `src/features/taskbar/**/*.{ts,tsx}` 안에서 `& \.\w+` grep 결과 0건
- [ ] `src/features/taskbar/**/*.tsx` 안에서 `className="..."` 패턴 0건 (styled 컴포넌트의 명시적 className prop 전달은 예외)
- [ ] `TaskBar.style.ts` 파일이 존재하지 않음
- [ ] `pnpm test` 의 `TaskBar (characterization)` 9 케이스 전부 통과
- [ ] `pnpm build` 성공
- [ ] 시각적 회귀 없음 (수동 검증 항목 통과)

---

## Task 0: 작업 브랜치 생성

**Step 1: master 최신화**

Run: `git checkout master && git pull origin master`
Expected: working tree clean, up to date.

**Step 2: 작업 브랜치 분기**

Run: `git checkout -b refactor/styled-component-taskbar`
Expected: `Switched to a new branch 'refactor/styled-component-taskbar'`

---

## Task 1: TaskBar 루트 styled 컴포넌트 추출 (먼저 그릇만)

목적: `TaskBar.tsx` 자체의 외곽 컨테이너를 styled 로 만들고, `taskBarStyle` 의 base props (네스팅 제외 부분) 만 옮긴다. 자식 셀렉터는 다음 task 들에서 분해되면서 점차 사라진다.

**Files:**
- Modify: `src/features/taskbar/TaskBar.tsx`

**Step 1: TaskBar.tsx 안에 인라인 TaskBarRoot 정의**

`taskbar/TaskBar.tsx` 상단에:

```tsx
import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
// ... 기존 imports

const TaskBarRoot = styled("div", cva({
  base: {
    display: "grid",
    gridTemplateColumns: "token(sizes.taskbar) auto 200px",
    height: "100%",
    position: "relative",
  },
}));
```

**Step 2: JSX root 를 교체**

```tsx
// before
<div className={taskBarStyle} style={cssVars}>

// after (cssVars 는 다음 task 들에서 제거되므로 일단 유지)
<TaskBarRoot style={cssVars}>
```

`taskBarStyle` import 도 제거.

**Step 3: 타입 체크**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (이 시점에서는 TaskBar.style.ts 가 여전히 export 되고 있으므로 다른 import 없음).

**Step 4: 테스트 실행 (회귀 확인)**

Run: `pnpm test src/features/taskbar`
Expected: 9 PASS.

**Step 5: 커밋**

```bash
git add src/features/taskbar/TaskBar.tsx
git commit -m "refactor(taskbar): TaskBar root 를 styled 컴포넌트로 분리"
```

---

## Task 2: StartButton 인라인 styled 변환 (단순 1개)

**Files:**
- Modify: `src/features/taskbar/ui/StartButton.tsx`

**Step 1: 변환**

`StartButton.tsx` 전체를 다음으로 교체:

```tsx
import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
import Windows from "@shared/ui/icons/Windows";

interface StartButtonProps {
    onClick: () => void;
}

const StartButtonRoot = styled("div", cva({
    base: {
        width: "taskbar",
        height: "taskbar",
        padding: "16",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "fast",
        "& svg": {
            width: "100%",
            height: "100%",
        },
        "& path": {
            fill: "shell.text",
        },
        _hover: {
            backgroundColor: "overlay.hover",
            "& path": {
                fill: "accent.hover",
            },
        },
        _active: {
            "& path": {
                fill: "accent.solid",
            },
        },
    },
}));

const StartButton = ({ onClick }: StartButtonProps) => {
    return (
        <StartButtonRoot onClick={onClick}>
            <Windows />
        </StartButtonRoot>
    );
};

export default StartButton;
```

원본 [TaskBar.style.ts:50-73](../../src/features/taskbar/TaskBar.style.ts#L50-L73) 의 `.box1` 관련 5개 셀렉터(`.box1`, `.box1:hover path`, `.box1:active path`, `.box1 svg`, `.box1 path`) 가 모두 흡수되어야 함. 또한 `.taskHoverEffect` 는 `_hover` 의 `backgroundColor: overlay.hover` 와 `transition: fast` 두 가지를 의미하므로 base 에 포함.

**Step 2: TaskBar.style.ts 에서 box1 / taskHoverEffect 관련 셀렉터 삭제**

해당 항목들은 더 이상 사용되지 않으므로 [TaskBar.style.ts](../../src/features/taskbar/TaskBar.style.ts) 에서 직접 제거. 단, 같은 `.taskHoverEffect` 를 SystemTray 도 사용하므로 SystemTray 관련 항목들은 Task 3 까지는 남겨둔다 — 이번 step 에서는 `.box1` 관련 5개 셀렉터만 제거.

**Step 3: 테스트 실행**

Run: `pnpm test src/features/taskbar -t "시작 버튼"`
Expected: FAIL (`.box1` 셀렉터로 startBtn 을 찾지만 더 이상 존재하지 않음).

**Step 4: 테스트 수정**

`TaskBar.test.tsx` 의 "시작 버튼 클릭 시 onClickStartIcon" 케이스에서 `.box1` 대신 SVG 의 부모 div 를 찾는 방식으로 변경. 가장 간단한 방법은 Windows 아이콘이 들어있는 button 영역을 클릭하는 것:

```tsx
it("시작 버튼 클릭 시 onClickStartIcon 이 호출된다", () => {
    const onClickStartIcon = vi.fn();
    const { container } = render(
        <TaskBar {...buildProps({ onClickStartIcon })} />
    );
    // StartButton 은 grid 첫 번째 컬럼. 첫 번째 자식이 StartButtonRoot.
    const startBtn = container.querySelector("svg")!.parentElement!;
    fireEvent.click(startBtn);
    expect(onClickStartIcon).toHaveBeenCalledTimes(1);
});
```

**Step 5: 테스트 재실행**

Run: `pnpm test src/features/taskbar`
Expected: 9 PASS.

**Step 6: 타입 체크**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

**Step 7: 커밋**

```bash
git add src/features/taskbar/ui/StartButton.tsx src/features/taskbar/TaskBar.style.ts src/features/taskbar/__tests__/TaskBar.test.tsx
git commit -m "refactor(taskbar): StartButton 을 styled 컴포넌트로 분리"
```

---

## Task 3: SystemTray 변환

`SystemTray` 는 ArrowUp 아이콘, DateInfo, InfoIcon, CloseAllButton 4개의 클릭 가능 영역을 갖는다. 모두 `taskHoverEffect` (hover 시 overlay) 를 공유하므로 공통 base 를 갖는 styled 컴포넌트가 필요.

**Files:**
- Create: `src/features/taskbar/ui/SystemTray.style.ts`
- Modify: `src/features/taskbar/ui/SystemTray.tsx`
- Modify: `src/features/taskbar/TaskBar.style.ts` (해당 섹션 삭제)

**Step 1: SystemTray.style.ts 생성**

```tsx
import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const SystemTrayRoot = styled("div", cva({
    base: {
        display: "grid",
        gridTemplateColumns: "1fr 4fr 50px 5px",
        gap: "4",
    },
}));

const trayCellBase = {
    transition: "fast",
    _hover: {
        backgroundColor: "overlay.hover",
    },
} as const;

export const ArrowUpCell = styled("div", cva({
    base: {
        ...trayCellBase,
        padding: "4",
        display: "flex",
        alignItems: "center",
        "& img": { width: "100%" },
    },
}));

export const DateInfoCell = styled("div", cva({
    base: {
        ...trayCellBase,
        padding: "4",
        fontSize: "13px",
        color: "shell.text",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "& > div": { cursor: "default" },
    },
}));

export const InfoCell = styled("div", cva({
    base: {
        ...trayCellBase,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& img": {
            width: "50%",
            objectFit: "cover",
        },
    },
}));

export const CloseAllCell = styled("div", cva({
    base: {
        ...trayCellBase,
        borderLeft: "1px solid token(colors.shell.border)",
    },
}));
```

원본 [TaskBar.style.ts:173-223](../../src/features/taskbar/TaskBar.style.ts#L173-L223) 의 `.box3`, `.taskHoverEffect`, `.taskHoverEffect:hover`, `.arrowUpIcon`, `.arrowUpIcon img`, `.dateInfo`, `.dateInfo > div`, `.closeAllButton`, `.info`, `.info img` 가 모두 흡수되어야 함.

**Step 2: SystemTray.tsx 변환**

```tsx
import message from "@images/icons/message.png";
import arrowUp from "@images/icons/collapse-arrow-up-white.png";
import arrowDown from "@images/icons/collapse-arrow-down-white.png";
import {
    SystemTrayRoot,
    ArrowUpCell,
    DateInfoCell,
    InfoCell,
    CloseAllCell,
} from "./SystemTray.style";

interface SystemTrayProps {
    hiddenIcon: boolean;
    cur_year: number | string;
    cur_month: number | string;
    cur_date: number | string;
    cur_hour: number | string;
    cur_minute: number | string;
    cur_timeline: string;
    onClickHiddenIcon: () => void;
    onClickTime: () => void;
    onClickInfo: () => void;
    onClickCloseAll: () => void;
}

const SystemTray = ({
    hiddenIcon,
    cur_year,
    cur_month,
    cur_date,
    cur_hour,
    cur_minute,
    cur_timeline,
    onClickHiddenIcon,
    onClickTime,
    onClickInfo,
    onClickCloseAll,
}: SystemTrayProps) => {
    return (
        <SystemTrayRoot>
            <ArrowUpCell
                title={
                    hiddenIcon
                        ? "숨기기"
                        : "포트폴리오 제작에 사용된 기술\n숨겨진 아이콘 표시"
                }
                onClick={onClickHiddenIcon}
            >
                {hiddenIcon ? (
                    <img src={arrowDown} alt="arrowDown" />
                ) : (
                    <img src={arrowUp} alt="arrowUp" />
                )}
            </ArrowUpCell>

            <DateInfoCell onClick={onClickTime} data-testid="taskbar-date">
                <div>
                    {cur_timeline} {cur_hour}:{cur_minute}
                </div>
                <div>
                    {cur_year}-{cur_month}-{`0${cur_date}`.slice(-2)}
                </div>
            </DateInfoCell>

            <InfoCell onClick={onClickInfo} title="새 알림 없음" data-testid="taskbar-info">
                <img src={message} alt="message" />
            </InfoCell>

            <CloseAllCell onClick={onClickCloseAll} data-testid="taskbar-close-all" />
        </SystemTrayRoot>
    );
};

export default SystemTray;
```

테스트가 `.dateInfo`, `.info`, `.closeAllButton` 셀렉터에 의존하므로 `data-testid` 를 부여한다.

**Step 3: TaskBar.style.ts 정리**

원본의 box3 / taskHoverEffect / arrowUpIcon / dateInfo / closeAllButton / info 관련 항목 모두 삭제.

**Step 4: 테스트 수정**

`TaskBar.test.tsx` 의 두 케이스를 `data-testid` 기반으로 변경:

```tsx
it("시계 영역 클릭 시 onClickTime, 알림 영역 클릭 시 onClickInfo", () => {
    const onClickTime = vi.fn();
    const onClickInfo = vi.fn();
    render(<TaskBar {...buildProps({ onClickTime, onClickInfo })} />);
    fireEvent.click(screen.getByTestId("taskbar-date"));
    expect(onClickTime).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId("taskbar-info"));
    expect(onClickInfo).toHaveBeenCalledTimes(1);
});

it("모두 닫기 버튼 클릭 시 onClickCloseAll 호출", () => {
    const onClickCloseAll = vi.fn();
    render(<TaskBar {...buildProps({ onClickCloseAll })} />);
    fireEvent.click(screen.getByTestId("taskbar-close-all"));
    expect(onClickCloseAll).toHaveBeenCalledTimes(1);
});
```

**Step 5: 테스트 + 타입 체크**

Run: `pnpm test src/features/taskbar && pnpm exec tsc --noEmit`
Expected: 9 PASS, no type errors.

**Step 6: 커밋**

```bash
git add src/features/taskbar/ui/SystemTray.style.ts src/features/taskbar/ui/SystemTray.tsx src/features/taskbar/TaskBar.style.ts src/features/taskbar/__tests__/TaskBar.test.tsx
git commit -m "refactor(taskbar): SystemTray 를 styled 컴포넌트로 분리"
```

---

## Task 4: PreviewPopup 변환 + 동적 스타일 prop 화

원본 `prevView` 는 CSS 변수(`--prevview-top`, `--prevview-opacity`, `--prevview-left`, `--prevview-pointer-events`) 로 위치/투명도를 받는다. 이걸 props 로 변경.

**Files:**
- Create: `src/features/taskbar/ui/PreviewPopup.style.ts`
- Modify: `src/features/taskbar/ui/PreviewPopup.tsx`
- Modify: `src/features/taskbar/TaskBar.style.ts` (해당 섹션 삭제, CSS 변수 정의도 제거)

**Step 1: PreviewPopup.style.ts 생성**

```tsx
import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const PreviewPopupRoot = styled("div", cva({
    base: {
        position: "absolute",
        width: "200px",
        height: "225px",
        backgroundColor: "shell.bgAlt",
        zIndex: 1,
        pt: "8",
        px: "16",
        pb: "16",
        boxSizing: "border-box",
        transition: "fast",
    },
}));

export const PreviewHeader = styled("div", cva({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
}));

export const PreviewHeaderText = styled("div", cva({
    base: {
        color: "shell.text",
        fontSize: "14px",
    },
}));

export const PreviewHeaderButton = styled("div", cva({
    base: {
        width: "20px",
        height: "20px",
        "& img": {
            width: "100%",
            height: "100%",
        },
    },
}));

export const PreviewCover = styled("div", cva({
    base: {
        position: "relative",
        width: "100%",
        height: "100%",
        // 이전엔 "& > div" 에 !important 로 left/top/transform 강제 주입
        // PreviewWindowFrame 자체가 absolute + left:0/top:0 을 갖고 있으므로
        // 여기서 transform/translate 만 wrapping 으로 적용
        "& > div": {
            position: "absolute",
            left: "-165px",
            top: "-150px",
            transform: "scale(0.35)",
            animation: "prevView_coverTransform 0.2s",
        },
    },
}));
```

원본 [TaskBar.style.ts:98-145](../../src/features/taskbar/TaskBar.style.ts#L98-L145) 의 `.prevView`, `.prevView .cover`, `.prevView .cover > div`, `.prevViewHeader`, `.prevViewHeader .text`, `.prevViewHeader .button`, `.prevViewHeader .button img` 가 흡수되어야 함. **`!important` 3개는 모두 제거** — `PreviewWindowFrame` 자체의 `position: absolute; left: 0; top: 0` 와 wrapping `& > div` 의 `position: absolute; left: -165px; top: -150px` 가 specificity 동등 + 후자 우선이므로 important 없이도 동작한다 (수동 검증 필수).

**Step 2: PreviewPopup.tsx 변환**

```tsx
import type { CSSProperties, ReactNode } from "react";
import close_white from "@images/icons/close_white.png";
import {
    resolveProgramTitle,
    resolveProgramIcon,
} from "@pages/DesktopPage/resolveProgramMeta";
import type { TaskbarEntry } from "../TaskBar.types";
import PreviewWindowFrame from "./PreviewWindowFrame";
import {
    PreviewPopupRoot,
    PreviewHeader,
    PreviewHeaderText,
    PreviewHeaderButton,
    PreviewCover,
} from "./PreviewPopup.style";

interface PreviewPopupProps {
    target: TaskbarEntry | undefined;
    renderContent: (entry: TaskbarEntry) => ReactNode;
    rootStyle: CSSProperties;
}

const PreviewPopup = ({ target, renderContent, rootStyle }: PreviewPopupProps) => {
    return (
        <PreviewPopupRoot style={rootStyle}>
            <PreviewHeader>
                <PreviewHeaderText>{target ? target.node.name : ""}</PreviewHeaderText>
                <PreviewHeaderButton>
                    <img src={close_white} alt="close_white" />
                </PreviewHeaderButton>
            </PreviewHeader>
            <PreviewCover>
                {target ? (
                    <PreviewWindowFrame
                        key={target.node.id}
                        title={resolveProgramTitle(target.node)}
                        iconSrc={resolveProgramIcon(target.node)}
                    >
                        {renderContent({
                            node: target.node,
                            running: { ...target.running, status: "active" },
                        })}
                    </PreviewWindowFrame>
                ) : null}
            </PreviewCover>
        </PreviewPopupRoot>
    );
};

export default PreviewPopup;
```

`rootStyle` 은 부모에서 계산해서 내려준다 (top / left / opacity / pointerEvents).

**Step 3: TaskBar.style.ts 정리**

prevView / prevViewHeader / cover 관련 항목 모두 삭제.

**Step 4: 타입 체크**

Run: `pnpm exec tsc --noEmit`
Expected: FAIL — `TaskBar.tsx` 에서 `<PreviewPopup>` 호출 시 `rootStyle` 누락.

**Step 5: TaskBar.tsx 수정 (PreviewPopup 호출부)**

`TaskBar.tsx` 의 PreviewPopup JSX 변경:

```tsx
const previewStyle: CSSProperties = {
    top: prevviewTop,
    left: prevviewLeft,
    opacity: prevviewOpacity,
    pointerEvents: prevviewPointerEvents as CSSProperties["pointerEvents"],
};

// ...

<PreviewPopup
    target={previewTarget}
    renderContent={renderPreviewContent}
    rootStyle={previewStyle}
/>
```

기존 `cssVars` 의 `--prevview-*` 4개 키 제거. 다음 task 에서 `--shotcut-hover-*` 도 제거되면 `cssVars` 자체가 사라진다.

**Step 6: 테스트 + 타입 체크**

Run: `pnpm test src/features/taskbar && pnpm exec tsc --noEmit`
Expected: 9 PASS, no type errors.

**Step 7: 커밋**

```bash
git add src/features/taskbar/ui/PreviewPopup.style.ts src/features/taskbar/ui/PreviewPopup.tsx src/features/taskbar/TaskBar.style.ts src/features/taskbar/TaskBar.tsx
git commit -m "refactor(taskbar): PreviewPopup 을 styled 컴포넌트로 분리하고 좌표를 prop 으로 전환"
```

---

## Task 5: ProgramIcons 변환 + active variant + 동적 스타일 prop 화

`.activeIcon`, `.activeShortCutIcon`, `.shortCutIcon:hover .shortCut_BottomLine`, `.activeIcon .shortCut_BottomLine` 등 상태 의존 셀렉터가 가장 많은 영역. variant 로 정리한다.

**Files:**
- Create: `src/features/taskbar/ui/ProgramIcons.style.ts`
- Modify: `src/features/taskbar/ui/ProgramIcons.tsx`
- Modify: `src/features/taskbar/TaskBar.style.ts`

**Step 1: ProgramIcons.style.ts 생성**

```tsx
import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const ProgramIconsRoot = styled("div", cva({
    base: {
        display: "flex",
        zIndex: 2,
    },
}));

export const ShortCutIcon = styled("div", cva({
    base: {
        transition: "fast",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
        width: "taskbar",
        position: "relative",
    },
    variants: {
        active: {
            true: { backgroundColor: "overlay.active" },
        },
    },
}));

export const ShortCutImg = styled("div", cva({
    base: {
        width: "100%",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& img": {
            width: "25px",
            height: "25px",
        },
    },
}));

export const ShortCutBottomLine = styled("div", cva({
    base: {
        transition: "fast",
        width: "80%",
        height: "3px",
        backgroundColor: "accent.underline",
    },
    variants: {
        state: {
            idle: { width: "80%" },
            hover: { width: "95%" },
            active: { width: "95%" },
            activeShortCut: { width: "70%" },
        },
    },
    defaultVariants: { state: "idle" },
}));

export const ShotCutHover = styled("div", cva({
    base: {
        position: "absolute",
        width: "200px",
        height: "0px",
        backgroundColor: "transparent",
        // hover 시 height 가 아래 ButtonCover/BodyCover 가 보일 만큼 늘어나야 함
        // 부모 ShortCutIcon hover 시점에 변경 → :hover 셀렉터로 표현
    },
}));

export const ButtonCover = styled("div", cva({
    base: {
        position: "absolute",
        right: 0,
        width: "40px",
        height: "40px",
        backgroundColor: "transparent",
    },
}));

export const BodyCover = styled("div", cva({
    base: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "200px",
    },
}));
```

**hover 시 BottomLine 폭 변경**: 원본은 `.shortCutIcon:hover .shortCut_BottomLine { width: 95% }`. 이건 부모 hover 가 자식의 스타일을 바꾸는 형태. variant 로 처리하려면 부모가 hover 상태를 알아야 하는데, 이미 `useTaskbarHover` 가 hover 인덱스를 관리하므로 prop 으로 내려줄 수 있다. **활성/idle/hover 가 모두 같은 컴포넌트의 상태이므로 단일 `state` variant 로 표현**한다 (위 코드의 `state` variant).

**hover 시 ShotCutHover height 변경**: 부모 hover 와 자식 height 가 묶여있다. `:hover` 셀렉터를 ShortCutIcon base 안에서 자식 selector 로 표현하거나, prop 으로 받는다. 셀렉터로 표현하려면 ShotCutHover 가 부모의 자식 태그 기준으로 selector 를 만들어야 하는데, styled 컴포넌트 간엔 클래스명을 모르므로 곤란. **hover prop 으로 height 를 전달**한다:

```tsx
export const ShotCutHover = styled("div", cva({
    base: {
        position: "absolute",
        width: "200px",
        backgroundColor: "transparent",
    },
    variants: {
        hovering: {
            true: { height: "225px" },
            false: { height: "0px" },
        },
    },
}));
```

원본 [TaskBar.style.ts:9-32, 75-96, 147-171](../../src/features/taskbar/TaskBar.style.ts) 의 `.shortCutIcon`, `.shotCut_Hover`, `.shortCutIcon:hover .shotCut_Hover`, `.buttonCover`, `.bodyCover`, `.box2`, `.activeIcon`, `.activeIcon .shortCut_BottomLine`, `.activeShortCutIcon`, `.shortCutIcon:hover .shortCut_BottomLine`, `.activeShortCutIcon .shortCut_BottomLine`, `.shortCut_Img`, `.shortCut_Img img`, `.shortCut_BottomLine` 가 흡수되어야 함.

`.shortCut_Test` (yellow) 는 사용처가 없는 죽은 셀렉터. 같이 제거.

**Step 2: ProgramIcons.tsx 변환**

```tsx
import { forwardRef, type CSSProperties } from "react";
import type { ProgramId } from "@shared/types/program";
import type { TaskbarEntry } from "../TaskBar.types";
import { resolveProgramIcon } from "@shared/lib";
import {
    ProgramIconsRoot,
    ShortCutIcon,
    ShortCutImg,
    ShortCutBottomLine,
    ShotCutHover,
    ButtonCover,
    BodyCover,
} from "./ProgramIcons.style";

interface ProgramIconsProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
    hoverIdx: number | null; // 새로 추가: 부모가 알려주는 hover 인덱스
    hoverStyle: CSSProperties; // 새로 추가: shotcut hover 위치 (top/left)
    onMouseEnter: (entry: TaskbarEntry, idx: number) => void;
    onMouseLeave: (idx: number) => void;
    onClickIcon: (entry: TaskbarEntry, idx: number) => void;
    onClickClose: () => void;
}

const renderIconImage = (entry: TaskbarEntry) => {
    const icon = resolveProgramIcon(entry.node);
    return <img src={icon} alt={entry.node.name} />;
};

const ProgramIcons = forwardRef<HTMLDivElement, ProgramIconsProps>(
    (
        {
            entries,
            activeId,
            hoverIdx,
            hoverStyle,
            onMouseEnter,
            onMouseLeave,
            onClickIcon,
            onClickClose,
        },
        ref
    ) => {
        return (
            <ProgramIconsRoot ref={ref}>
                {entries.map((entry, idx) => {
                    const isActive = activeId === entry.node.id;
                    const isHover = hoverIdx === idx;
                    // BottomLine state 결정
                    const bottomLineState =
                        isActive && isHover
                            ? "activeShortCut"
                            : isActive
                              ? "active"
                              : isHover
                                ? "hover"
                                : "idle";
                    return (
                        <ShortCutIcon
                            key={entry.node.id}
                            active={isActive}
                            title={entry.node.name}
                            data-testid={`taskbar-icon-${entry.node.id}`}
                            onMouseEnter={() => onMouseEnter(entry, idx)}
                            onMouseLeave={() => onMouseLeave(idx)}
                        >
                            <ShortCutImg onClick={() => onClickIcon(entry, idx)}>
                                {renderIconImage(entry)}
                            </ShortCutImg>
                            <ShortCutBottomLine state={bottomLineState} />
                            <ShotCutHover hovering={isHover} style={isHover ? hoverStyle : undefined}>
                                <ButtonCover
                                    data-testid={`taskbar-close-${entry.node.id}`}
                                    onClick={onClickClose}
                                />
                                <BodyCover onClick={() => onClickIcon(entry, idx)} />
                            </ShotCutHover>
                        </ShortCutIcon>
                    );
                })}
            </ProgramIconsRoot>
        );
    }
);

ProgramIcons.displayName = "ProgramIcons";

export default ProgramIcons;
```

테스트가 `.shortCutIcon` / `.activeIcon` / `.buttonCover` 셀렉터에 의존하므로 testid 부여.

**Step 3: TaskBar.tsx 의 cssVars 제거 및 hoverIdx/hoverStyle 계산**

```tsx
// 기존 cssVars 블록 삭제

const previewStyle: CSSProperties = {
    top: prevviewTop,
    left: prevviewLeft,
    opacity: prevviewOpacity,
    pointerEvents: prevviewPointerEvents as CSSProperties["pointerEvents"],
};

const shortcutHoverStyle: CSSProperties = {
    top: shotcutHoverTop,
    left: shotcutHoverLeft,
    pointerEvents: shotcutHoverPointerEvents as CSSProperties["pointerEvents"],
};

// JSX
<TaskBarRoot>
    <StartButton onClick={onClickStartIcon} />
    <ProgramIcons
        ref={iconContainerRef}
        entries={entries}
        activeId={activeId}
        hoverIdx={hoverTarget.idx}
        hoverStyle={shortcutHoverStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClickIcon={handleClickIcon}
        onClickClose={handleCloseShortcut}
    />
    <SystemTray ... />
    <PreviewPopup
        target={previewTarget}
        renderContent={renderPreviewContent}
        rootStyle={previewStyle}
    />
</TaskBarRoot>
```

**`hoverTarget.idx` 의 타입을 확인** — `useTaskbarHover.ts` 를 읽어서 idx 가 number 인지 number | null 인지 확인하고 prop 타입을 맞춘다.

**Step 4: TaskBar.style.ts 잔여 항목 모두 삭제 및 파일 삭제**

이 시점에서 TaskBar.style.ts 안의 모든 항목이 옮겨졌다. 파일을 삭제:

```bash
git rm src/features/taskbar/TaskBar.style.ts
```

`TaskBar.tsx` 의 `import { taskBarStyle } from "./TaskBar.style"` 도 (Task 1 에서 이미 제거되었어야 함, 미제거 시 제거).

**Step 5: 테스트 수정**

`TaskBar.test.tsx` 에서 className 셀렉터를 testid 로 변경:

```tsx
// "아이콘에 mouseEnter 시" — closest(".shortCutIcon") 대신 testid 로 직접 찾기
const icon = screen.getByTestId("taskbar-icon-n1");

// "activeId 에 해당하는 아이콘" 케이스 — className 검사 대신 styled variant 의 결과를 다른 방식으로 검증
// (panda 가 generate 한 클래스명을 직접 검사하기보다, role/testid + 시각적 의미가 같은지를 검사)
// 가장 단순한 방법: active 일 때 ShortCutIcon 의 background 가 다르다는 것을 검증하는 대신,
// data-active 속성을 ShortCutIcon 에 추가해 noeop으로 검증한다.
```

`ShortCutIcon` 에 data-active 추가 (variant 와 별개로 테스트 가능한 마커):

```tsx
<ShortCutIcon
    key={entry.node.id}
    active={isActive}
    data-active={isActive ? "true" : undefined}
    ...
>
```

테스트:
```tsx
it("activeId 에 해당하는 아이콘은 active 표시를 가진다", () => {
    render(<TaskBar {...buildProps({ activeId: "n2" })} />);
    expect(screen.getByTestId("taskbar-icon-n2")).toHaveAttribute("data-active", "true");
});
```

"hover 중 미리보기 X 버튼" 케이스도 testid 사용:
```tsx
it("hover 중 미리보기 X 버튼 클릭 시 onCloseProgram(hoverId) 호출", () => {
    const onCloseProgram = vi.fn();
    render(<TaskBar {...buildProps({ onCloseProgram })} />);
    const icon = screen.getByTestId("taskbar-icon-n2");
    fireEvent.mouseEnter(icon);
    fireEvent.click(screen.getByTestId("taskbar-close-n2"));
    expect(onCloseProgram).toHaveBeenCalledWith("n2");
});
```

**Step 6: 검증**

Run: `pnpm test src/features/taskbar`
Expected: 9 PASS.

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

Run: `pnpm exec rg "& \." src/features/taskbar`
Expected: 단일 자식 태그 셀렉터(`& img`, `& > div`, `& path`, `& svg`) 만 보이고 `& \.\w+` 형태는 0건.

**Step 7: 커밋**

```bash
git add src/features/taskbar/ui/ProgramIcons.style.ts src/features/taskbar/ui/ProgramIcons.tsx src/features/taskbar/TaskBar.tsx src/features/taskbar/__tests__/TaskBar.test.tsx
git rm src/features/taskbar/TaskBar.style.ts
git commit -m "refactor(taskbar): ProgramIcons 를 styled 컴포넌트로 분리하고 hover 좌표를 prop 으로 전환"
```

---

## Task 6: 빌드 / 시각 검증

**Step 1: 풀 빌드**

Run: `pnpm build`
Expected: success, dist 생성.

**Step 2: 개발 서버 실행 (수동 검증)**

Run: `pnpm dev`

**수동 검증 항목** (각 항목마다 실제로 화면 확인):

- [ ] 시작 버튼 hover 시 background 가 `overlay.hover`, SVG path 가 `accent.hover` 색으로 바뀐다
- [ ] 시작 버튼 active (mousedown) 시 SVG path 가 `accent.solid` 색으로 바뀐다
- [ ] 작업 표시줄 아이콘 hover 시 BottomLine width 가 95% 로 늘어난다
- [ ] active 아이콘은 background 가 `overlay.active` 이고 BottomLine 이 95% 폭이다
- [ ] active + hover 인 아이콘은 BottomLine 폭이 70% 이다
- [ ] 작업 표시줄 아이콘 hover 시 위쪽에 미리보기 팝업 (200x225) 이 나타난다
- [ ] 미리보기 팝업 안의 PreviewWindowFrame 이 정상적인 위치 (top:-150px, left:-165px, scale 0.35) 에 배치된다 — `!important` 제거 후 회귀 없음 확인
- [ ] 미리보기 팝업 X 버튼 영역 (buttonCover) 클릭 시 해당 프로그램이 닫힌다
- [ ] 미리보기 팝업 본문 영역 (bodyCover) 클릭 시 해당 프로그램이 활성화된다
- [ ] SystemTray: 화살표 / 시간 / 알림 / 닫기 4 영역 모두 hover 시 background 가 `overlay.hover`
- [ ] SystemTray 시간 영역 클릭 시 시간바가 토글된다
- [ ] SystemTray 알림 영역 클릭 시 정보바가 토글된다
- [ ] SystemTray 닫기 영역 클릭 시 모든 프로그램이 닫힌다

**Step 3: 시각 회귀 발견 시**

회귀가 발견되면 해당 task 로 돌아가 수정한 뒤, 새 커밋으로 쌓는다 (`git commit --amend` 사용 금지 — [commit-convention.md §4](../rules/commit-convention.md) 의 스택 방식 참조).

수정 커밋 메시지 예시:
```
fix(taskbar): PreviewCover 위치 회귀 수정 — !important 제거 후 specificity 부족 보강
```

---

## Task 7: PR 생성

**Step 1: 푸시**

```bash
git push -u origin refactor/styled-component-taskbar
```

**Step 2: PR 생성 — `worker-create-pr` 스킬 사용**

본 plan 의 변경 사항을 표준 PR 템플릿(배경 / 변경 사항 / 동작 방식 / 테스트 / 영향 범위) 에 맞춰 작성한다.

PR 본문에 반드시 포함:
- 본 plan 문서 링크: `docs/plans/2026-04-19-styled-component-migration-phase1.md`
- 설계 문서 링크: `docs/plans/2026-04-19-styled-component-migration-design.md`
- "Phase 1 (시범)" 임을 명시. Phase 2 는 본 PR 리뷰에서 합의된 패턴을 기반으로 별도 plan 으로 작성됨.

---

## Phase 1 회고 (작업 완료 후 작성)

각 task 가 끝난 뒤 본 섹션에 검증 가능한 사실 기반 관찰을 남긴다.

```markdown
<!-- 예시 -->
- TaskBar.style.ts 224줄 → 0줄 (파일 삭제)
- 새로 생긴 .style.ts 파일: SystemTray.style.ts (52줄), ProgramIcons.style.ts (~80줄), PreviewPopup.style.ts (~50줄)
- "& \.\w+" grep 결과: 36 → 0
- !important 사용: 3 → 0 (PreviewCover specificity 검증 필요했음)
- TaskBar.test.tsx: className 셀렉터 7곳 → 0곳, testid 8곳 추가
- 발견된 죽은 코드: .shortCut_Test (yellow background, 사용처 없음) 제거
```

PR 리뷰에서 패턴 수정 사항이 나오면 본 섹션에 그 결정과 근거를 추가하고, Phase 2 plan 작성 시 반영한다.
