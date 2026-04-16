# 스타일링 패턴 재검토 메모

> 상태: **논의 중 (정식 plan 아님)**
> 방향이 확정되면 별도 설계 문서로 승격한다.

## 배경

현재 프로젝트의 모든 feature 스타일은 한 가지 패턴으로 통일되어 있다.

```ts
// XxxProgram.style.ts
export const xxxStyle = css({
    "& .child": { ... },
    "& .child .grandchild": { ... },
});
```

```tsx
// XxxProgram.tsx
<div className={`${xxxStyle} root`}>
    <div className="child">
        <span className="grandchild" />
    </div>
</div>
```

- `.style.ts` 9개 파일, `"& ."` 셀렉터 **154회** 사용 (2026-04-14 기준)
- 자식 요소는 **문자열 className** 으로 식별, 스타일은 부모의 css 객체에서 CSS 셀렉터로 매칭

## 현재 패턴의 트레이드오프

### 장점

- 컴포넌트의 모든 스타일이 **단일 파일에 집중** — 어디서 스타일이 오는지 찾기 쉬움
- className 충돌 없음 — panda 해시로 부모 스코프가 걸림
- 번들에 추가되는 className 수 최소 (루트 해시 1개)

### 단점

- **className이 plain string** — 오타 쳐도 조용히 무시됨, rename refactor 불가능
- `.style.ts` 파일이 길어짐 — 컴포넌트 하나가 20~100개 셀렉터 규칙을 가짐
- **IDE 점프 불가** — 컴포넌트의 className → 스타일 정의로 바로 갈 수 없음
- 한 요소에만 쓰이는 스타일도 부모 css 객체에 묶여 **tree-shaking 이득 없음**
- **panda의 타입 시스템 이점 상실** — `css()` 는 키/값 타입 추론이 있지만, className 문자열은 타입 외부

## 대안: Panda 관용 패턴

### 대안 A: 요소별 별도 css()

```ts
export const headerCss = css({ display: "flex", ... });
export const labelCss = css({ fontSize: "11px", color: "surface.textMuted" });
```

```tsx
<div className={headerCss}>
    <span className={labelCss} />
</div>
```

- 각 스타일이 독립적이고 refactor에 강함
- className 문자열 대신 **변수 참조** — IDE 점프 가능, 오타 시 타입 에러

### 대안 B: styled factory

```ts
const Header = styled("div", { base: { display: "flex", ... } });
const Label = styled("span", { base: { fontSize: "11px", ... } });
```

- JSX 에서 바로 읽히는 컴포넌트 레벨 스타일
- 더 깔끔하지만, 컴포넌트가 많아지면 파일 분산됨

## 판단해야 할 질문

1. 현재 패턴의 단점 중 **실제로 팀을 아프게 하는 것**은 무엇인가?
   - 오타로 인한 silent failure 가 발생한 경험이 있는가?
   - 한 파일의 style 객체가 너무 커져서 읽기 힘든 경우가 있는가?
2. 전환한다면 **전체 일괄 마이그레이션** vs **신규만 새 패턴** 중 어느 쪽인가?
   - 후자는 컨벤션이 두 개가 되어 더 헷갈릴 위험
3. 전환 시 **레퍼런스로 쓸 feature 1개**를 먼저 재작성해서 감을 보는 게 나은가?

## 후속 작업 가능성

- 방향이 확정되면 본 문서를 `docs/plans/YYYY-MM-DD-style-pattern-migration.md` 형태의 정식 플랜으로 승격
- 혹은 현행 패턴 유지로 결정 시, `docs/rules/` 에 "스타일링은 root-selector 패턴으로 통일한다" 규칙 명문화
