# Taskbar Preview 레이아웃 정리

작성일: 2026-04-07
상위 계획: `docs/plans/2026-04-07-refactor-global-state-boundary-design.md` (5단계 후속)
브랜치명 제안: `fix/taskbar-preview-layout`

## 배경

5단계 리팩토링(PR #18, merged)에서 `useActiveProgram` 의 dynamic-import-Component 패턴을 제거하면서, taskbar hover preview 의 내용이 렌더 깨짐 상태로 남았다.

**현재 상태**
- `src/features/taskbar/ui/PreviewPopup.tsx` 가 `renderPreviewContent` prop 으로 content 를 렌더
- 500x500 absolute wrapper div 로 임시로 감싸 `.prevView .cover > div` CSS 셀렉터의 scale/offset 대상은 제공됨
- 그러나 원본 `ProgramComponent` 의 grid 구조(`gridTemplateRows: 32px 25px 1fr 20px`)가 없어 내부 feature 들의 레이아웃이 깨짐
  - 이미지 프로그램의 상단 컨트롤바가 사라짐
  - 내부 요소들이 기대한 grid cell 에 배치되지 못함

**원본 동작**: preview 팝업이 `ProgramContainer` 인스턴스를 통째로 렌더하고 CSS `scale(0.35)` 로 축소 → 미니 윈도우처럼 보임.

## 목표

Taskbar hover preview 가 "각 프로그램 종류별로 식별 가능한 축소 썸네일" 을 보여준다. 픽셀 퍼펙트까지는 아니어도 최소한:
- 헤더 영역이 보인다
- 내부 컨트롤/내용이 찌그러지지 않는다
- 기존 `.prevView` 컨테이너(200x225) 안에 깔끔히 들어간다

## 비목표 (YAGNI)

- 실시간 반영되는 라이브 썸네일(html2canvas 등)
- 픽셀 퍼펙트 복원
- preview 팝업의 크기/위치 재디자인
- `WindowShell` 에 preview 모드 옵션 추가 (side effect 가 복잡해서 리스크 큼)

## 접근 방안

**선택안 A: 경량 `PreviewWindowFrame` 신설** (권장)

`src/features/taskbar/ui/PreviewWindowFrame.tsx` 를 신설해 `WindowShell` 과 동일한 grid 레이아웃만 복제한 순수 presentational 컴포넌트 생성. 로직/side effect 없음.

```tsx
// PreviewWindowFrame.tsx 구조 예시
<div className={previewFrameStyle}>
  <div className="previewHeader">
    <img src={iconSrc} alt={title} />
    <span>{title}</span>
  </div>
  <div className="previewContent">{children}</div>
</div>
```

스타일은 `ProgramComponent.style.ts` 와 유사한 grid (`32px 1fr`) + `backgroundColor: white` + `position: absolute` + `500x500` 고정. CSS `scale(0.35)` 는 `.prevView .cover > div` 에서 이미 적용됨.

그리고 `PreviewPopup` 이 `renderContent(target)` 을 호출해 얻은 ReactNode 를 `<PreviewWindowFrame title icon>` 의 children 으로 감싼다.

**선택안 B**: 공유 styled 컴포넌트 분리

`ProgramComponent.style.ts` 의 grid 레이아웃 부분을 추출해 `WindowShell` 과 `PreviewWindowFrame` 모두에서 재사용. 중복 제거 이점이 있지만 기존 안정 코드를 손대는 리스크.

**선택안 A 권장**. 현재 preview 만 건드리고 본창은 그대로 두는 게 안전.

## 작업 단계

1. **현재 상태 파악**
   - `PreviewPopup.tsx` / `TaskBar.style.ts` 의 `.prevView` 관련 CSS 읽기
   - `ProgramComponent.style.ts` 의 grid 구조 확인
   - 미리보기 대상이 될 각 프로그램(`FolderProgram`, `ImageProgram`, `DOCProgram`, `INFOProgramContainer`) 이 가정하는 부모 레이아웃 간단히 확인

2. **PreviewWindowFrame 구현**
   - `src/features/taskbar/ui/PreviewWindowFrame.tsx` + `PreviewWindowFrame.style.ts`(필요 시)
   - props: `title: string`, `iconSrc: string`, `children: ReactNode`
   - 500x500 absolute, white 배경, header(32px) + content(1fr) grid

3. **PreviewPopup 연결**
   - 기존 임시 500x500 wrapper div 제거
   - `<PreviewWindowFrame>` 으로 children 감싸기
   - title/icon 을 어떻게 얻을지: `TaskbarProgramItem` 에 이미 `name`, `type`, `icon?` 이 있음. 타입별 title/icon 매핑은 `pages/DesktopPage/ProgramWindow.tsx` 에 이미 있는 `resolveTitle` / `resolveIcon` 로직과 중복되므로, 해당 함수를 `pages/DesktopPage/resolveProgramMeta.ts` 같은 파일로 추출해 양쪽에서 재사용
   - `renderPreviewContent` prop 의 시그니처를 필요 시 `renderPreviewContent: (item) => { title, iconSrc, content }` 식으로 확장해도 됨 (대안)

4. **검증**
   - `pnpm test` 전체 통과
   - `pnpm build` 성공
   - 수동 확인:
     - Taskbar 아이콘 hover 시 preview 팝업 표시
     - 각 프로그램 타입(폴더/이미지/문서/INFO) 별로 깨지지 않고 식별 가능한 모양
     - preview 팝업 크기 안에 잘 들어가는지
     - hover 전환 시 정상 갱신

5. **커밋 / PR**
   - commit: `fix(taskbar): restore preview popup layout after WindowShell refactor`
   - PR 에 before/after 스크린샷

## 영향 범위

- `src/features/taskbar/ui/PreviewPopup.tsx`
- `src/features/taskbar/ui/PreviewWindowFrame.tsx` (신규)
- `src/pages/DesktopPage/ProgramWindow.tsx` (resolveTitle/resolveIcon 추출 시)
- `src/pages/DesktopPage/resolveProgramMeta.ts` (신규, 선택)

본창 렌더/드래그/리사이즈/상태 관리에는 손대지 않는다.

## 위험 요소

- 각 프로그램 feature 내부 스타일이 grid cell 크기에 의존하면 preview 용 grid 와 본창 grid 가 어긋날 때 깨짐 → 실제 렌더 확인 필요
- `scale(0.35)` 는 visual 만 축소하므로 `click-through` 이벤트 영역은 원래 크기 → preview 안 내부 요소 click 방지 필요 (`pointer-events: none` 추가 고려)

## 완료 기준

- [ ] 각 프로그램 타입별 preview 가 식별 가능하게 표시
- [ ] preview 내부 click 이 본창에 영향 주지 않음
- [ ] 테스트/빌드 통과
- [ ] PR 머지
