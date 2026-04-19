---
name: convention-plan
description: Use when writing or updating a project design/plan document under `docs/plans/`. Routes to docs/rules/plan-writing-guide.md (project-specific guide that complements superpowers:writing-plans). Invoke before creating any docs/plans/*.md file.
---

# Plan Writing Convention Router

이 프로젝트의 설계 문서 작성 규약은 [`docs/rules/plan-writing-guide.md`](../../../docs/rules/plan-writing-guide.md) 에 정의되어 있다. `superpowers:writing-plans` 가 일반적인 plan 작성 패턴을 다룬다면, 본 가이드는 **본 프로젝트의 형식·검증·체크리스트-커밋 매핑** 을 다룬다. 두 문서는 보완 관계다.

## 적용 시점

- 사용자가 "설계 문서 작성", "플랜 만들어줘", "design.md 작성" 등을 요청
- `docs/plans/` 하위 신규 문서 생성 직전
- 기존 plan 문서를 phase 추가/완료 조건 변경 등으로 수정할 때
- `superpowers:writing-plans` 가 발동된 직후 — 본 프로젝트 형식 보완

## 사용 절차

1. [`docs/rules/plan-writing-guide.md`](../../../docs/rules/plan-writing-guide.md) 를 Read 한다
2. 문서명을 `docs/plans/YYYY-MM-DD-<topic>-{design,plan}.md` 형식으로 정한다
3. §1 Phase 별 자기 완결: 입력 / 작업 내용 (체크리스트) / 완료 조건 명시
4. §2 배경 / 설계 규칙 / 성공 기준 (Definition of Done) 내장
5. §3 진행 상태 추적 — `- [ ]` / `- [x]` 체크리스트 사용
6. §6 작업 내용 체크리스트 한 줄이 [`commit-convention.md`](../../../docs/rules/commit-convention.md) §3 메시지 포맷에 그대로 끼워 넣어도 말이 되는 모양인지 검증 (1:1 매핑)

## superpowers:writing-plans 와의 분담

| 항목 | 담당 |
|---|---|
| Phase 분해, 스코프 산정, 위험 평가 | `superpowers:writing-plans` |
| 본 프로젝트 문서 위치/네이밍 (`docs/plans/YYYY-MM-DD-...`) | 본 가이드 |
| Phase 완료 시 수동 검증 + 회고 형식 | 본 가이드 (§4) |
| 체크리스트 ↔ 커밋 1:1 매핑 | 본 가이드 (§6) + `commit-convention.md` |
| 검증 실패 시 처리 (3회 실패 후 사용자 보고) | 본 가이드 (§4-3) |

## 자기 검증

작성한 plan 문서가 다음을 만족하는지 확인한다.

- [ ] 파일명이 `YYYY-MM-DD-<topic>-{design,plan}.md` 형식
- [ ] 각 Phase 의 입력 / 작업 내용 / 완료 조건이 명시됨
- [ ] 작업 내용 체크리스트가 커밋 1개 단위로 분해됨 (§6)
- [ ] 성공 기준 (Definition of Done) 이 검증 가능한 형태로 작성됨
