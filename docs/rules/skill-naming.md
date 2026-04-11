# 스킬 네이밍 컨벤션

이 프로젝트에서 직접 관리하는 커스텀 스킬(`.claude/skills/`)의 이름은 본 규칙을 따른다. 목적은 세 가지다.

1. 이름만 보고 **역할(누가)** 과 **단계(언제)** 를 구분할 수 있게 한다.
2. 디렉터리 정렬 시 **역할별 자동 그룹핑**이 되도록 한다.
3. LLM 이 스킬 리스트를 스캔할 때 **역할 prefix 가 먼저 눈에 들어오도록** 한다.

## 형식

```
<role>-<stage>[-<detail>][-<pattern>]
```

- `<role>` — 필수. `worker` / `orchestrator` / `convention` 중 하나.
- `<stage>` — 필수. `worker`/`orchestrator` 는 동사, `convention` 은 영역 명사.
- `<detail>` — 선택. 대상이나 범위를 명확히 한다.
- `<pattern>` — `orchestrator` 전용. 실행 패턴 접미사(`-loop` 등).

### 세부 규칙

- `worker-*` / `orchestrator-*` 는 **동사-명사 순서** 로 쓴다. 동사는 원형(`implement`, `create`, `review`, `resolve`, `deploy` 등).
- `convention-*` 는 **영역명**(명사 단독 또는 명사-명사)으로 쓴다. 동사를 쓰지 않는다.
- `orchestrator-*` 는 **실행 패턴 접미사를 반드시 붙인다**. 단독 `orchestrator-review` 같은 형태는 금지한다.
- `convention-*` 는 패턴 접미사를 갖지 않는다.
- 전치사(`to`, `for`, `with` 등)는 이름에서 제거한다. `deploy-to-vercel` → `worker-deploy-vercel`.
- 복수형 대신 단수형을 기본으로 한다. `frontend-conventions` → `convention-frontend`.
- `review` 처럼 단어 하나만으로는 대상이 불명확한 경우 `<detail>` 을 붙여 명시한다. `worker-review` → `worker-review-code`.

## 역할 prefix 정의

| 역할 prefix | 정의 | 예시 |
|---|---|---|
| **`worker-`** | 특정 단계의 작업을 **1회 실제로 수행**한다. | `worker-implement-plan`, `worker-review-code`, `worker-create-pr` |
| **`orchestrator-`** | 다른 스킬/Agent 를 **패턴에 따라 호출·제어**한다. 자기 자신은 직접 작업하지 않는다. | `orchestrator-review-loop` |
| **`convention-`** | 프로젝트 **규칙 문서로 라우팅**하는 횡단 참조. | `convention-frontend` |

## 실행 패턴 접미사 (orchestrator 전용)

| 접미사 | 의미 | 상태 |
|---|---|---|
| `-loop` | 종료 조건이 만족될 때까지 동일 작업을 반복 호출 | 사용 중 |
| `-pipeline` | 순차 단계를 고정 순서로 실행 | 예약 |
| `-fanout` | 독립 작업을 병렬로 분기 | 예약 |

새 패턴이 필요하면 이 표에 먼저 추가한 뒤 사용한다.

## 새 스킬 분류 흐름

새 스킬을 만들거나 기존 스킬을 분류할 때 다음 순서로 판별한다.

1. **"다른 스킬/Agent 의 호출 흐름을 제어하는가?"**
   - YES → `orchestrator-` + 패턴 접미사 선택 (`-loop` 등).
   - NO → 2단계로.
2. **"규칙 문서로 안내만 하는가?"**
   - YES → `convention-`.
   - NO → `worker-`.

## 현재 스킬 매핑

| 현재 이름 | 역할 | 해석 |
|---|---|---|
| `worker-implement-plan` | worker | 플랜을 구현 |
| `worker-create-pr` | worker | PR 을 생성 |
| `worker-review-code` | worker | 코드를 리뷰 |
| `worker-resolve-review` | worker | 리뷰(코멘트)를 해소 |
| `worker-deploy-vercel` | worker | Vercel 에 배포 |
| `orchestrator-review-loop` | orchestrator (loop) | 리뷰를 루프로 실행 |
| `convention-frontend` | convention | 프론트엔드 규칙 라우팅 |

## 적용 범위

- **대상**: 이 프로젝트에서 직접 관리하는 커스텀 스킬 (`.claude/skills/` 하위).
- **대상 외**: 외부 스킬 (`vercel-*`, `web-design-guidelines`, `superpowers:*` 등). 외부 패키지는 자체 네이밍을 유지한다. 본 규칙은 강제하지 않는다.

## 체크리스트 (스킬을 새로 만들거나 리네임할 때)

- [ ] 이름이 `<role>-<stage>[-<detail>][-<pattern>]` 형식을 만족하는가?
- [ ] `role` 이 `worker` / `orchestrator` / `convention` 중 하나인가?
- [ ] `worker` / `orchestrator` 이면 동사-명사 순서인가?
- [ ] `orchestrator` 이면 패턴 접미사가 붙었는가?
- [ ] 전치사(`to`/`for`/`with`)나 복수형이 남아 있지 않은가?
- [ ] 디렉터리명과 `SKILL.md` 의 `name:` frontmatter 가 일치하는가?
