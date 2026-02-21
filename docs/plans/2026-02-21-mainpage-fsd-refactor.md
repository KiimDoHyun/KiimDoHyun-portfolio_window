# MainPage FSD Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate `src/page/MainPage.tsx` and all its dependencies into FSD architecture under `src/fsd/window/`.

**Architecture:** Bottom-up migration — move shared hooks first, then program feature, then individual widgets, finally compose DesktopPage. Keep styled-components, store, Common, api as-is. Delete originals after full migration.

**Tech Stack:** React, TypeScript, Recoil, styled-components, react-router-dom

---

## Pre-requisites

- Working directory: `c:/WorkSpace/KiimDoHyun-portfolio_window`
- Branch: `refactor/mainPage`
- Design doc: `docs/plans/2026-02-21-mainpage-fsd-refactor-design.md`

## Key Conventions

- **FSD import rule:** Higher-numbered layers import from lower-numbered (2_pages → 3_widgets → 4_features → 6_common)
- **Within same slice:** Use relative imports (`./`, `../`)
- **Cross-layer:** Use `@fsd/window/` alias
- **External shared:** Use existing aliases (`@store/*`, `@Common/*`, `@images/*`, `@Setting/*`)
- **Each slice:** Must have `index.ts` barrel export

---

### Task 1: Move Common Hooks to 6_common/hooks

**Files:**
- Move: `src/hooks/useAxios.tsx` → `src/fsd/window/6_common/hooks/useAxios.tsx`
- Move: `src/hooks/useOutsideClick.tsx` → `src/fsd/window/6_common/hooks/useOutsideClick.tsx`
- Move: `src/hooks/useGetCurrentTime.tsx` → `src/fsd/window/6_common/hooks/useGetCurrentTime.tsx`
- Modify: `src/fsd/window/6_common/hooks/index.ts`

**Step 1: Copy useAxios (no import changes needed — no project-internal imports)**

Copy `src/hooks/useAxios.tsx` → `src/fsd/window/6_common/hooks/useAxios.tsx`

Content stays identical — it only imports from `react`.

**Step 2: Copy useOutsideClick (no import changes needed)**

Copy `src/hooks/useOutsideClick.tsx` → `src/fsd/window/6_common/hooks/useOutsideClick.tsx`

Content stays identical — it only imports from `react`.

**Step 3: Copy useGetCurrentTime (update 1 import)**

Copy `src/hooks/useGetCurrentTime.tsx` → `src/fsd/window/6_common/hooks/useGetCurrentTime.tsx`

Change import:
```diff
- import { sliceDateString } from "../Common/date";
+ import { sliceDateString } from "@Common/date";
```

**Step 4: Update 6_common/hooks/index.ts**

Add to existing exports:
```ts
export { default as useAxios } from "./useAxios";
export { default as useOutsideClick } from "./useOutsideClick";
export { default as useGetCurrentTime } from "./useGetCurrentTime";
```

**Step 5: Build verification**

Run: `npm run build`
Expected: Compiles without errors (old files still exist, nothing references new ones yet)

**Step 6: Commit**

```bash
git add src/fsd/window/6_common/hooks/
git commit -m "refactor: move common hooks to 6_common/hooks"
```

---

### Task 2: Move Shared Icon Components to 6_common/components/icons

**Files:**
- Move: `src/Component/Program/Icon/Windows.jsx` → `src/fsd/window/6_common/components/icons/Windows.jsx`
- Move: `src/Component/Program/Icon/SimpleArrowUp.jsx` → `src/fsd/window/6_common/components/icons/SimpleArrowUp.jsx`
- Move: `src/Component/Program/Icon/SimpleArrowDown.jsx` → `src/fsd/window/6_common/components/icons/SimpleArrowDown.jsx`
- Create: `src/fsd/window/6_common/components/icons/index.ts`
- Modify: `src/fsd/window/6_common/components/index.ts`

**Step 1: Copy 3 icon files**

All three files have no internal imports (only `react` and `styled-components`), so copy as-is.

**Step 2: Create icons/index.ts**

```ts
export { default as Windows } from "./Windows";
export { default as SimpleArrowUp } from "./SimpleArrowUp";
export { default as SimpleArrowDown } from "./SimpleArrowDown";
```

**Step 3: Update 6_common/components/index.ts**

Add to existing exports:
```ts
export { Windows, SimpleArrowUp, SimpleArrowDown } from "./icons";
```

**Step 4: Build verification**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/fsd/window/6_common/components/icons/ src/fsd/window/6_common/components/index.ts
git commit -m "refactor: move shared icon components to 6_common/components/icons"
```

---

### Task 3: Move Program Feature to 4_features/program

**Files:**
- Create: `src/fsd/window/4_features/program/` directory structure
- Move: `src/Container/Program/ProgramContainer.tsx` → `src/fsd/window/4_features/program/ProgramContainer.tsx`
- Move: `src/Component/Program/ProgramComponent.tsx` → `src/fsd/window/4_features/program/components/ProgramComponent.tsx`
- Move: `src/Container/Program/DOCProgramContainer.tsx` → `src/fsd/window/4_features/program/components/DOCProgramContainer.tsx`
- Move: `src/Component/Program/DOCProgramComponent.tsx` → `src/fsd/window/4_features/program/components/DOCProgramComponent.tsx`
- Move: `src/Container/Program/FolderProgramContainer.tsx` → `src/fsd/window/4_features/program/components/FolderProgramContainer.tsx`
- Move: `src/Component/Program/FolderProgramComponent.tsx` → `src/fsd/window/4_features/program/components/FolderProgramComponent.tsx`
- Move: `src/Container/Program/ImageProgramContainer.tsx` → `src/fsd/window/4_features/program/components/ImageProgramContainer.tsx`
- Move: `src/Component/Program/ImageProgramComponent.tsx` → `src/fsd/window/4_features/program/components/ImageProgramComponent.tsx`
- Move: `src/Container/Program/INFOProgramContainer.tsx` → `src/fsd/window/4_features/program/components/INFOProgramContainer.tsx`
- Move: `src/Component/Program/INFOProgramComponent.tsx` → `src/fsd/window/4_features/program/components/INFOProgramComponent.tsx`
- Move: `src/hooks/useActiveProgram.tsx` → `src/fsd/window/4_features/program/hooks/useActiveProgram.tsx`
- Create: `src/fsd/window/4_features/program/index.ts`

**Step 1: Create directory structure**

```bash
mkdir -p src/fsd/window/4_features/program/components
mkdir -p src/fsd/window/4_features/program/hooks
```

**Step 2: Copy ProgramContainer.tsx and update imports**

Source: `src/Container/Program/ProgramContainer.tsx`
Target: `src/fsd/window/4_features/program/ProgramContainer.tsx`

Import changes:
```diff
- import ProgramComponent from "../../Component/Program/ProgramComponent";
+ import ProgramComponent from "./components/ProgramComponent";
- import { rc_program_activeProgram, rc_program_programList, rc_program_zIndexCnt } from "../../store/program";
+ import { rc_program_activeProgram, rc_program_programList, rc_program_zIndexCnt } from "@store/program";
```

**Step 3: Copy ProgramComponent.tsx and update imports**

Source: `src/Component/Program/ProgramComponent.tsx`
Target: `src/fsd/window/4_features/program/components/ProgramComponent.tsx`

Import changes:
```diff
- import folderEmpty from "../../asset/images/icons/folder_empty.png";
- import defaultImage from "../../asset/images/icons/image_default.png";
- import monitor from "../../asset/images/icons/monitor.png";
- import close from "../../asset/images/icons/close.png";
- import horizontalLine from "../../asset/images/icons/horizontal-line.png";
- import maximize from "../../asset/images/icons/maximize.png";
- import minimize from "../../asset/images/icons/minimize.png";
- import defaultDocumentImage from "../../asset/images/icons/document_default.png";
+ import folderEmpty from "@images/icons/folder_empty.png";
+ import defaultImage from "@images/icons/image_default.png";
+ import monitor from "@images/icons/monitor.png";
+ import close from "@images/icons/close.png";
+ import horizontalLine from "@images/icons/horizontal-line.png";
+ import maximize from "@images/icons/maximize.png";
+ import minimize from "@images/icons/minimize.png";
+ import defaultDocumentImage from "@images/icons/document_default.png";
- import ImageProgramContainer from "../../Container/Program/ImageProgramContainer";
- import FolderProgramContainer from "../../Container/Program/FolderProgramContainer";
- import DOCProgramContainer from "../../Container/Program/DOCProgramContainer";
- import INFOProgramContainer from "../../Container/Program/INFOProgramContainer";
+ import ImageProgramContainer from "./ImageProgramContainer";
+ import FolderProgramContainer from "./FolderProgramContainer";
+ import DOCProgramContainer from "./DOCProgramContainer";
+ import INFOProgramContainer from "./INFOProgramContainer";
```

**Step 4: Copy DOCProgramContainer.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/DOCProgramContainer.tsx`

```diff
- import { projectDatas } from "../../Common/data";
- import DOCProgramComponent from "../../Component/Program/DOCProgramComponent";
+ import { projectDatas } from "@Common/data";
+ import DOCProgramComponent from "./DOCProgramComponent";
```

**Step 5: Copy DOCProgramComponent.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/DOCProgramComponent.tsx`

Update all `../../asset/images/` → `@images/` paths.

**Step 6: Copy FolderProgramContainer.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/FolderProgramContainer.tsx`

```diff
- import useActiveProgram from "../../hooks/useActiveProgram";
- import { rc_global_Directory_List, rc_global_Directory_Tree } from "../../store/global";
- import FolderProgramComponent from "../../Component/Program/FolderProgramComponent";
+ import useActiveProgram from "../hooks/useActiveProgram";
+ import { rc_global_Directory_List, rc_global_Directory_Tree } from "@store/global";
+ import FolderProgramComponent from "./FolderProgramComponent";
```

**Step 7: Copy FolderProgramComponent.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/FolderProgramComponent.tsx`

Update all asset image paths to use `@images/` alias.

**Step 8: Copy ImageProgramContainer.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/ImageProgramContainer.tsx`

```diff
- import ImageProgramComponent from "../../Component/Program/ImageProgramComponent";
- import { rc_global_Directory_Tree } from "../../store/global";
+ import ImageProgramComponent from "./ImageProgramComponent";
+ import { rc_global_Directory_Tree } from "@store/global";
```

**Step 9: Copy ImageProgramComponent.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/ImageProgramComponent.tsx`

Update all asset image paths to use `@images/` alias.

**Step 10: Copy INFOProgramContainer.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/INFOProgramContainer.tsx`

```diff
- import INFOProgramComponent from "../../Component/Program/INFOProgramComponent";
+ import INFOProgramComponent from "./INFOProgramComponent";
```

**Step 11: Copy INFOProgramComponent.tsx and update imports**

Target: `src/fsd/window/4_features/program/components/INFOProgramComponent.tsx`

Update all asset image paths to use `@images/` alias.

**Step 12: Copy useActiveProgram.tsx and update imports**

Target: `src/fsd/window/4_features/program/hooks/useActiveProgram.tsx`

```diff
- import { rc_program_activeProgram, rc_program_programList, rc_program_zIndexCnt } from "../store/program";
+ import { rc_program_activeProgram, rc_program_programList, rc_program_zIndexCnt } from "@store/program";
```

**CRITICAL:** Update the dynamic import path:
```diff
- import("../Container/Program/ProgramContainer").then((obj) => {
+ import("@fsd/window/4_features/program/ProgramContainer").then((obj) => {
```

**Step 13: Create index.ts**

```ts
export { default as ProgramContainer } from "./ProgramContainer";
export { default as useActiveProgram } from "./hooks/useActiveProgram";
```

**Step 14: Build verification**

Run: `npm run build`

**Step 15: Commit**

```bash
git add src/fsd/window/4_features/
git commit -m "refactor: move program feature to 4_features/program"
```

---

### Task 4: Create DisplayCover Widget

**Files:**
- Copy: `src/Component/DisplayCover.tsx` → `src/fsd/window/3_widgets/Window10/DisplayCover/DisplayCover.tsx`
- Create: `src/fsd/window/3_widgets/Window10/DisplayCover/index.ts`

**Step 1: Copy DisplayCover.tsx and update imports**

```diff
- import { rc_global_DisplayLight } from "../store/global";
+ import { rc_global_DisplayLight } from "@store/global";
```

**Step 2: Create index.ts**

```ts
export { default as DisplayCover } from "./DisplayCover";
```

**Step 3: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/DisplayCover/
git commit -m "refactor: create DisplayCover widget"
```

---

### Task 5: Create HiddenIcon Widget

**Files:**
- Copy: `src/Component/TaskBar/HiddenIcon.tsx` → `src/fsd/window/3_widgets/Window10/HiddenIcon/HiddenIcon.tsx`
- Copy: `src/Component/TaskBar/SkillIcon.tsx` → `src/fsd/window/3_widgets/Window10/HiddenIcon/components/SkillIcon.tsx`
- Create: `src/fsd/window/3_widgets/Window10/HiddenIcon/index.ts`

**Step 1: Copy HiddenIcon.tsx and update imports**

```diff
- import { rc_taskbar_hiddenIcon_active } from "../../store/taskbar";
- import react from "../../asset/images/icons/react.png";
- import javascript from "../../asset/images/icons/javascript.png";
- import recoil from "../../asset/images/icons/recoil.png";
- import html from "../../asset/images/icons/html.png";
- import css from "../../asset/images/icons/css.png";
- import styledcomponent from "../../asset/images/icons/styledcomponent.png";
- import SkillIcon from "./SkillIcon";
+ import { rc_taskbar_hiddenIcon_active } from "@store/taskbar";
+ import react from "@images/icons/react.png";
+ import javascript from "@images/icons/javascript.png";
+ import recoil from "@images/icons/recoil.png";
+ import html from "@images/icons/html.png";
+ import css from "@images/icons/css.png";
+ import styledcomponent from "@images/icons/styledcomponent.png";
+ import SkillIcon from "./components/SkillIcon";
```

**Step 2: Copy SkillIcon.tsx (no project-internal imports)**

Copy as-is.

**Step 3: Create index.ts**

```ts
export { default as HiddenIcon } from "./HiddenIcon";
```

**Step 4: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/HiddenIcon/
git commit -m "refactor: create HiddenIcon widget"
```

---

### Task 6: Create TimeBar Widget

**Files:**
- Copy: `src/Container/TaskBar/TimeBarContainer.tsx` → `src/fsd/window/3_widgets/Window10/TimeBar/TimeBarContainer.tsx`
- Copy: `src/Component/TaskBar/TimeBar.tsx` → `src/fsd/window/3_widgets/Window10/TimeBar/components/TimeBar.tsx`
- Create: `src/fsd/window/3_widgets/Window10/TimeBar/index.ts`

**Step 1: Copy TimeBarContainer.tsx and update imports**

```diff
- import TimeBar from "../../Component/TaskBar/TimeBar";
- import useGetCurrentTime from "../../hooks/useGetCurrentTime";
- import { rc_taskbar_timeBar_active } from "../../store/taskbar";
+ import TimeBar from "./components/TimeBar";
+ import { useGetCurrentTime } from "@fsd/window/6_common/hooks";
+ import { rc_taskbar_timeBar_active } from "@store/taskbar";
```

**Step 2: Copy TimeBar.tsx and update imports**

```diff
- import SimpleArrowDown from "../Program/Icon/SimpleArrowDown";
- import SimpleArrowUp from "../Program/Icon/SimpleArrowUp";
+ import { SimpleArrowDown, SimpleArrowUp } from "@fsd/window/6_common/components";
```

**Step 3: Create index.ts**

```ts
export { default as TimeBarContainer } from "./TimeBarContainer";
```

**Step 4: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/TimeBar/
git commit -m "refactor: create TimeBar widget"
```

---

### Task 7: Create InfoBar Widget

**Files:**
- Copy: `src/Container/TaskBar/InfoBarContainer.tsx` → `src/fsd/window/3_widgets/Window10/InfoBar/InfoBarContainer.tsx`
- Copy: `src/Component/TaskBar/InfoBar.tsx` → `src/fsd/window/3_widgets/Window10/InfoBar/components/InfoBar.tsx`
- Copy: `src/Component/InfoBar/CommitItem.tsx` → `src/fsd/window/3_widgets/Window10/InfoBar/components/CommitItem.tsx`
- Copy: `src/Component/InfoBar/ErrorBox.tsx` → `src/fsd/window/3_widgets/Window10/InfoBar/components/ErrorBox.tsx`
- Create: `src/fsd/window/3_widgets/Window10/InfoBar/index.ts`

**Step 1: Copy InfoBarContainer.tsx and update imports**

```diff
- import { getCommitApi } from "../../api/git";
- import InfoBar from "../../Component/TaskBar/InfoBar";
- import useAxios from "../../hooks/useAxios";
- import { rc_global_DisplayLight } from "../../store/global";
- import { rc_taskbar_infoBar_active } from "../../store/taskbar";
+ import { getCommitApi } from "@api/git";
+ import InfoBar from "./components/InfoBar";
+ import { useAxios } from "@fsd/window/6_common/hooks";
+ import { rc_global_DisplayLight } from "@store/global";
+ import { rc_taskbar_infoBar_active } from "@store/taskbar";
```

NOTE: Check if `@api` alias exists in tsconfig. If not, use relative path `../../../../api/git` or add the alias.

**Step 2: Copy InfoBar.tsx and update imports**

```diff
- import CommitItem from "../InfoBar/CommitItem";
- import ErrorBox from "../InfoBar/ErrorBox";
- import sum from "../../asset/images/icons/sun.png";
+ import CommitItem from "./CommitItem";
+ import ErrorBox from "./ErrorBox";
+ import sum from "@images/icons/sun.png";
```

**Step 3: Copy CommitItem.tsx and update imports**

```diff
- import { dateToStr } from "../../Common/common";
+ import { dateToStr } from "@Common/common";
```

**Step 4: Copy ErrorBox.tsx (no project-internal imports)**

Copy as-is.

**Step 5: Create index.ts**

```ts
export { default as InfoBarContainer } from "./InfoBarContainer";
```

**Step 6: Check tsconfig for @api alias**

If `@api/*` doesn't exist, add to `tsconfig.json` paths:
```json
"@api/*": ["src/api/*"]
```

**Step 7: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/InfoBar/
git commit -m "refactor: create InfoBar widget"
```

---

### Task 8: Create StatusBar Widget

**Files:**
- Copy: `src/Container/TaskBar/StatusBarContainer.tsx` → `src/fsd/window/3_widgets/Window10/StatusBar/StatusBarContainer.tsx`
- Copy: `src/Component/TaskBar/StatusBar.tsx` → `src/fsd/window/3_widgets/Window10/StatusBar/components/StatusBar.tsx`
- Copy: `src/Component/TaskBar/StatusBar/LeftAreaBox.tsx` → `src/fsd/window/3_widgets/Window10/StatusBar/components/LeftAreaBox.tsx`
- Copy: `src/Component/TaskBar/StatusBar/CenterAreaBox.tsx` → `src/fsd/window/3_widgets/Window10/StatusBar/components/CenterAreaBox.tsx`
- Copy: `src/Component/TaskBar/StatusBar/RightAreaBox.tsx` → `src/fsd/window/3_widgets/Window10/StatusBar/components/RightAreaBox.tsx`
- Create: `src/fsd/window/3_widgets/Window10/StatusBar/index.ts`

**Step 1: Copy StatusBarContainer.tsx and update imports**

```diff
- import StatusBar from "../../Component/TaskBar/StatusBar";
- import { rc_taskbar_statusBar_active } from "../../store/taskbar";
- import imgReact from "../../asset/images/icons/react.png";
- import imgJS from "../../asset/images/icons/javascript.png";
- import imgAraon from "../../asset/images/icons/araon_logo_noText.png";
- import imgKit from "../../asset/images/icons/logo_kit.jpg";
- import imgOne from "../../asset/images/icons/number_one.png";
- import imgUser from "../../asset/images/icons/user.png";
- import imgWhaTap from "../../asset/images/icons/WhaTap_vertical_logo.png";
- import useActiveProgram from "../../hooks/useActiveProgram";
- import { rc_global_Directory_Tree } from "../../store/global";
+ import StatusBar from "./components/StatusBar";
+ import { rc_taskbar_statusBar_active } from "@store/taskbar";
+ import imgReact from "@images/icons/react.png";
+ import imgJS from "@images/icons/javascript.png";
+ import imgAraon from "@images/icons/araon_logo_noText.png";
+ import imgKit from "@images/icons/logo_kit.jpg";
+ import imgOne from "@images/icons/number_one.png";
+ import imgUser from "@images/icons/user.png";
+ import imgWhaTap from "@images/icons/WhaTap_vertical_logo.png";
+ import { useActiveProgram } from "@fsd/window/4_features/program";
+ import { rc_global_Directory_Tree } from "@store/global";
```

**Step 2: Copy StatusBar.tsx and update imports**

```diff
- import imgMenu from "../../asset/images/icons/hamburger_menu.png";
- import LeftAreaBox from "./StatusBar/LeftAreaBox";
- import CenterAreaBox from "./StatusBar/CenterAreaBox";
- import RightAreaBox from "./StatusBar/RightAreaBox";
+ import imgMenu from "@images/icons/hamburger_menu.png";
+ import LeftAreaBox from "./LeftAreaBox";
+ import CenterAreaBox from "./CenterAreaBox";
+ import RightAreaBox from "./RightAreaBox";
```

**Step 3: Copy LeftAreaBox.tsx and update imports**

```diff
- import { rc_global_Directory_List } from "../../../store/global";
+ import { rc_global_Directory_List } from "@store/global";
```

**Step 4: Copy CenterAreaBox.tsx and update imports**

```diff
- import defaultImg from "../../../asset/images/icons/project_default_1.png";
- import { rc_global_Directory_List } from "../../../store/global";
+ import defaultImg from "@images/icons/project_default_1.png";
+ import { rc_global_Directory_List } from "@store/global";
```

**Step 5: Copy RightAreaBox.tsx and update imports**

```diff
- import { rc_global_Directory_List } from "../../../store/global";
+ import { rc_global_Directory_List } from "@store/global";
```

**Step 6: Create index.ts**

```ts
export { default as StatusBarContainer } from "./StatusBarContainer";
```

**Step 7: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/StatusBar/
git commit -m "refactor: create StatusBar widget"
```

---

### Task 9: Create TaskBar Widget

**Files:**
- Copy: `src/Container/TaskBar/TaskBarContainer.tsx` → `src/fsd/window/3_widgets/Window10/TaskBar/TaskBarContainer.tsx`
- Copy: `src/Component/Main/TaskBar.tsx` → `src/fsd/window/3_widgets/Window10/TaskBar/components/TaskBar.tsx`
- Create: `src/fsd/window/3_widgets/Window10/TaskBar/index.ts`

**Step 1: Copy TaskBarContainer.tsx and update imports**

```diff
- import TaskBar from "../../Component/Main/TaskBar";
- import { rc_program_activeProgram, rc_program_programList } from "../../store/program";
- import { rc_taskbar_hiddenIcon_active, rc_taskbar_infoBar_active, rc_taskbar_preview_active, rc_taskbar_statusBar_active, rc_taskbar_timeBar_active } from "../../store/taskbar";
- import useGetCurrentTime from "../../hooks/useGetCurrentTime";
+ import TaskBar from "./components/TaskBar";
+ import { rc_program_activeProgram, rc_program_programList } from "@store/program";
+ import { rc_taskbar_hiddenIcon_active, rc_taskbar_infoBar_active, rc_taskbar_preview_active, rc_taskbar_statusBar_active, rc_taskbar_timeBar_active } from "@store/taskbar";
+ import { useGetCurrentTime } from "@fsd/window/6_common/hooks";
```

**Step 2: Copy TaskBar.tsx (Component) and update imports**

```diff
- import message from "../../asset/images/icons/message.png";
- import folderEmpty from "../../asset/images/icons/folder_empty.png";
- import defaultImage from "../../asset/images/icons/image_default.png";
- import monitor from "../../asset/images/icons/monitor.png";
- import defaultDocumentImage from "../../asset/images/icons/document_default.png";
- import arrowUp from "../../asset/images/icons/collapse-arrow-up-white.png";
- import arrowDown from "../../asset/images/icons/collapse-arrow-down-white.png";
- import close_white from "../../asset/images/icons/close_white.png";
- import Windows from "../Program/Icon/Windows";
+ import message from "@images/icons/message.png";
+ import folderEmpty from "@images/icons/folder_empty.png";
+ import defaultImage from "@images/icons/image_default.png";
+ import monitor from "@images/icons/monitor.png";
+ import defaultDocumentImage from "@images/icons/document_default.png";
+ import arrowUp from "@images/icons/collapse-arrow-up-white.png";
+ import arrowDown from "@images/icons/collapse-arrow-down-white.png";
+ import close_white from "@images/icons/close_white.png";
+ import { Windows } from "@fsd/window/6_common/components";
```

**Step 3: Create index.ts**

```ts
export { default as TaskBarContainer } from "./TaskBarContainer";
```

**Step 4: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/TaskBar/
git commit -m "refactor: create TaskBar widget"
```

---

### Task 10: Create Desktop Widget

**Files:**
- Copy: `src/Container/WindowContainer.tsx` → `src/fsd/window/3_widgets/Window10/Desktop/WindowContainer.tsx`
- Copy: `src/Component/Main/Window.tsx` → `src/fsd/window/3_widgets/Window10/Desktop/components/Window.tsx`
- Copy: `src/Component/IconBox.tsx` → `src/fsd/window/3_widgets/Window10/Desktop/components/IconBox.tsx`
- Create: `src/fsd/window/3_widgets/Window10/Desktop/index.ts`

**Step 1: Copy WindowContainer.tsx and update imports**

```diff
- import Window from "../Component/Main/Window";
- import { rc_program_programList } from "../store/program";
- import useActiveProgram from "../hooks/useActiveProgram";
- import { rc_global_Directory_Tree } from "../store/global";
+ import Window from "./components/Window";
+ import { rc_program_programList } from "@store/program";
+ import { useActiveProgram } from "@fsd/window/4_features/program";
+ import { rc_global_Directory_Tree } from "@store/global";
```

**Step 2: Copy Window.tsx and update imports**

```diff
- import IconBox from "../IconBox";
+ import IconBox from "./IconBox";
```

**Step 3: Copy IconBox.tsx and update imports**

```diff
- import defaultImg from "../logo.svg";
+ import defaultImg from "@images/../logo.svg";
```

NOTE: Check the actual path for `logo.svg`. It's at `src/logo.svg`. May need: `import defaultImg from "../../../../logo.svg";` or add a path alias. Verify the `src/logo.svg` exists and adjust accordingly.

**Step 4: Create index.ts**

```ts
export { default as WindowContainer } from "./WindowContainer";
```

**Step 5: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/Desktop/
git commit -m "refactor: create Desktop widget"
```

---

### Task 11: Update 3_widgets Index Export

**Files:**
- Check if `src/fsd/window/3_widgets/Window10/index.ts` exists, create/update it

**Step 1: Create or update Window10/index.ts**

Verify current state. If only Login is exported, add all new widgets:

```ts
export { default as Login } from "./Login";
export { DisplayCover } from "./DisplayCover";
export { HiddenIcon } from "./HiddenIcon";
export { TimeBarContainer } from "./TimeBar";
export { InfoBarContainer } from "./InfoBar";
export { StatusBarContainer } from "./StatusBar";
export { TaskBarContainer } from "./TaskBar";
export { WindowContainer } from "./Desktop";
```

**Step 2: Build verification**

Run: `npm run build`
Expected: No errors — new widgets are created but not yet wired to DesktopPage.

**Step 3: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/index.ts
git commit -m "refactor: export all widgets from Window10 index"
```

---

### Task 12: Implement DesktopPage

**Files:**
- Modify: `src/fsd/window/2_pages/DesktopPage.tsx`

**Step 1: Replace DesktopPage stub with full implementation**

```tsx
import React from "react";
import styled from "styled-components";
import wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { useSetRecoilState } from "recoil";
import {
  rc_taskbar_hiddenIcon_active,
  rc_taskbar_infoBar_active,
  rc_taskbar_statusBar_active,
  rc_taskbar_timeBar_active,
} from "@store/taskbar";
import { DisplayCover } from "@fsd/window/3_widgets/Window10/DisplayCover";
import { HiddenIcon } from "@fsd/window/3_widgets/Window10/HiddenIcon";
import { TaskBarContainer } from "@fsd/window/3_widgets/Window10/TaskBar";
import { InfoBarContainer } from "@fsd/window/3_widgets/Window10/InfoBar";
import { WindowContainer } from "@fsd/window/3_widgets/Window10/Desktop";
import { StatusBarContainer } from "@fsd/window/3_widgets/Window10/StatusBar";
import { TimeBarContainer } from "@fsd/window/3_widgets/Window10/TimeBar";

export default function DesktopPage() {
  const setActive_status = useSetRecoilState(rc_taskbar_statusBar_active);
  const setActive_time = useSetRecoilState(rc_taskbar_timeBar_active);
  const setActiveInfoBar = useSetRecoilState(rc_taskbar_infoBar_active);
  const setHiddenIcon = useSetRecoilState(rc_taskbar_hiddenIcon_active);

  return (
    <MainPageBlock>
      <DisplayCover />
      <div
        className="windowCover"
        onMouseDown={() => {
          setActive_status(false);
          setActive_time(false);
          setActiveInfoBar(false);
          setHiddenIcon(false);
        }}
      >
        <WindowContainer />
      </div>
      <div className="taskBarCover">
        <TaskBarContainer />
      </div>

      {/* 시작 */}
      <StatusBarContainer />

      {/* 시간 */}
      <TimeBarContainer />

      {/* 정보 */}
      <InfoBarContainer />

      {/* 숨겨진 아이콘 */}
      <HiddenIcon />
    </MainPageBlock>
  );
}

const MainPageBlock = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: grid;
  grid-template-rows: 1fr 50px;
  background-image: url(${wallpaper});
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;

  .windowCover {
    position: relative;
    padding: 10px;
  }

  .taskBarCover {
    position: relative;
    background-color: #20343b;
    z-index: 10000;
  }
`;
```

**Step 2: Full build and manual test**

Run: `npm run build`
Expected: Compiles successfully.

Run: `npm start`
Expected: Navigate to `/window/desktop` — should show full desktop with icons, taskbar, all popups working.

**Step 3: Commit**

```bash
git add src/fsd/window/2_pages/DesktopPage.tsx
git commit -m "refactor: implement DesktopPage with FSD widgets"
```

---

### Task 13: Delete Original Files

**IMPORTANT:** Only proceed after verifying the app works correctly in Task 12.

**Step 1: Delete original Container directory**

```bash
rm -rf src/Container/
```

**Step 2: Delete original Component directory**

```bash
rm -rf src/Component/
```

**Step 3: Delete original hooks directory**

```bash
rm -rf src/hooks/
```

**Step 4: Delete original page directory**

```bash
rm -rf src/page/
```

**Step 5: Build verification**

Run: `npm run build`

If build fails, some file still references old paths. Check error messages and fix any remaining imports that point to deleted directories.

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: delete original Container/Component/hooks/page directories"
```

---

### Task 14: Clean Up Dead Code and Aliases

**Step 1: Delete dead code files (if not already deleted)**

These files are unused:
- `src/Component/Main.tsx` (dead — old MainPage prototype)
- `src/Component/Preview.tsx` (dead — commented out in MainPage)
- `src/Component/Folder/TechStackFolder.tsx` (dead — not imported anywhere)

Already deleted in Task 13 since they're in `src/Component/`.

**Step 2: Clean up tsconfig path aliases**

Remove unused aliases from `tsconfig.json` paths:
```diff
- "@Page/*": ["src/page/*"],
- "@Container/*": ["src/Container/*"],
- "@Component/*": ["src/Component/*"],
- "@hook/*": ["src/hooks/*"],
```

Keep aliases that are still used:
- `@images/*`, `@Common/*`, `@store/*`, `@Setting/*`, `@fsd/*`, `@styled-system/*`

Add if missing:
- `@api/*`: `["src/api/*"]`

**Step 3: Final build verification**

Run: `npm run build`
Expected: Clean build with no errors.

Run: `npm start`
Expected: Full app works — login → desktop → all features functional.

**Step 4: Commit**

```bash
git add tsconfig.json
git commit -m "refactor: clean up unused path aliases from tsconfig"
```

---

## Summary

| Task | Description | Files Touched |
|------|-------------|---------------|
| 1 | Move common hooks → 6_common | 4 |
| 2 | Move shared icons → 6_common | 5 |
| 3 | Move program feature → 4_features | 13 |
| 4 | DisplayCover widget | 2 |
| 5 | HiddenIcon widget | 3 |
| 6 | TimeBar widget | 3 |
| 7 | InfoBar widget | 5 |
| 8 | StatusBar widget | 6 |
| 9 | TaskBar widget | 3 |
| 10 | Desktop widget | 4 |
| 11 | Widget index exports | 1 |
| 12 | DesktopPage implementation | 1 |
| 13 | Delete originals | 4 dirs |
| 14 | Clean up aliases | 1 |
| **Total** | **14 tasks** | **~55 files** |
