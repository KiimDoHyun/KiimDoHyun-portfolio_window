---
name: convention-commit
description: Use when creating or amending git commits in this project (any `git commit` call). Routes to docs/rules/commit-convention.md and ensures the project's `<type>(<scope>): <대상> — <성격>` message format. Invoke before composing any commit message.
---

# Commit Convention Router

이 프로젝트의 커밋 규약은 [`docs/rules/commit-convention.md`](../../../docs/rules/commit-convention.md) 에 정의되어 있다. 커밋을 만들기 전에 **반드시 이 문서를 Read 해서 규약을 확인한 뒤** 메시지를 작성한다.

## 적용 시점

다음 중 하나라도 해당하면 이 스킬을 발동한다.

- 사용자가 "커밋 만들어줘" / "commit" / "커밋해" 등을 요청
- `git commit` 호출 직전 (PR 생성 흐름의 일부일 때 포함)
- 기존 커밋 메시지 수정 (`--amend`)

## 사용 절차

1. [`docs/rules/commit-convention.md`](../../../docs/rules/commit-convention.md) 를 Read 한다
2. 변경 내역을 §2 단위 기준에 맞춰 평가 — 너무 큰가 / 너무 잘은가 / 적정인가
3. §3 메시지 포맷 (`<type>(<scope>): <대상> — <변경의 성격>`) 으로 메시지 초안 작성
4. 비자명한 결정이 있으면 §3-5 본문 추가, 자명하면 제목만으로 충분
5. 수정 커밋이면 §4 (스택 방식 — `--amend` / `rebase squash` 금지, 새 커밋으로 누적) 따른다
6. HEREDOC 으로 메시지 전달

## 적용 범위 밖

- §4-3 예외(방금 쌓은 커밋의 메시지만 교정) 의 `git commit --amend -m` 은 본 스킬 발동 후 규약 확인 후 사용 가능
- 머지 커밋, rebase 도중 자동 생성 커밋 등 도구가 만드는 메시지는 적용 대상이 아니다

## 자기 검증

작성한 메시지가 다음을 만족하는지 확인한다.

- [ ] type 이 §3-1 표의 7가지 중 하나인가
- [ ] scope 가 모듈/기능 단위로 명확한가 (모호하면 커밋 단위가 큰 것)
- [ ] 제목만 보고 "무엇을 / 어디에 / 어떻게" 가 드러나는가
