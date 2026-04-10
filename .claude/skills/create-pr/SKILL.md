---
name: create-pr
description: Use whenever the user asks to create a pull request, open a PR, "PR 만들어줘", "PR 올려줘", or wants to draft PR body/description text. Generates a consistent PR body using this project's standard template (배경 / 변경 사항 / 동작 방식 / 테스트 / 영향 범위) and creates the PR via gh CLI.
---

# create-pr

이 프로젝트의 모든 PR은 아래 템플릿을 따른다. 리뷰어가 빠르게 맥락을 잡고, 작성자가 빠뜨리는 항목이 없도록 하기 위함이다.

## 작업 순서

1. **변경 내역 파악** — 다음을 병렬로 실행:
   - `git status`
   - `git diff master...HEAD` (또는 base 브랜치 기준)
   - `git log master..HEAD --oneline`
2. **분류** — 변경의 성격을 파악한다 (feat / fix / refactor / chore / docs / test). 커밋 메시지 prefix와 일치시킨다.
3. **템플릿 채우기** — 아래 구조에 맞춰 본문을 작성. 해당 없는 선택 섹션은 **생략**한다 (빈 칸으로 두지 않는다).
4. **PR 생성** — `gh pr create`를 HEREDOC으로 호출. 제목은 70자 이내, 커밋 prefix 형식 (`feat(scope): ...`).
5. **URL 반환** — 사용자가 바로 열 수 있도록 PR URL을 출력.

## PR 본문 템플릿

```markdown
## 배경
- 왜 이 작업이 필요한지, 어떤 문제/요구에서 출발했는지 1~3줄
- 관련 이슈가 있으면 #번호

## 변경 사항
- 추가/수정/삭제한 내용을 bullet로
- 모듈/파일 단위로 묶어서 작성

## 동작 방식
<!-- 비자명한 설계 결정, 트레이드오프, 리뷰어가 코드만 봐선 알기 어려운 맥락. 없으면 이 섹션 통째로 제거. -->

## 테스트
- [ ] 단위 테스트 추가/통과
- [ ] 수동 확인: <재현 단계 또는 확인 시나리오>
- 스크린샷/GIF (UI 변경 시)

## 영향 범위 / 주의사항
<!-- 마이그레이션, breaking change, 롤백 방법, 후속 작업. 없으면 섹션 통째로 제거. -->
```

## 작성 원칙

- **Why를 맨 위에.** 리뷰어가 가장 먼저 알아야 할 건 "왜". What/How는 코드가 이미 보여준다.
- **선택 섹션은 생략하라.** "없음", "N/A" 같은 placeholder는 형식적인 PR을 만든다. 해당 없으면 섹션 자체를 빼라.
- **체크리스트는 실제 상태로.** 아직 안 한 항목을 체크하지 마라. 작성 시점에 한 것만 체크.
- **스크린샷은 UI 변경에만.** 백엔드/리팩터 PR에 빈 칸 만들지 마라.
- **제목은 커밋 prefix 형식.** `feat(auth): JWT 기반 인증 추가` — scope는 최상위 폴더나 기능 단위.

## 예시

**Input:** `master` 브랜치 대비 `feature/folder-rename` 브랜치, FolderProgram의 폴더명 인라인 편집 기능 추가, 단위 테스트 포함.

**Output 제목:** `feat(folder-program): 폴더명 인라인 편집 지원`

**Output 본문:**
```markdown
## 배경
- 폴더 우클릭 → 이름 변경 메뉴가 모달을 띄워 흐름이 끊겼다.
- 윈도우 탐색기와 동일하게 인라인 편집을 기대한다는 피드백이 있었음.

## 변경 사항
- `FolderProgram/Folder.tsx`: 더블클릭 시 input 모드 진입
- `useFolderRename` 훅 신설 — 편집 상태/커밋/취소 관리
- 기존 rename 모달 코드 제거

## 테스트
- [x] `useFolderRename` 단위 테스트 추가 (커밋/Esc 취소/빈 문자열 거부)
- [x] 수동 확인: 폴더 더블클릭 → 이름 수정 → Enter 저장 / Esc 취소
```

## gh CLI 호출

본문은 반드시 HEREDOC으로 전달한다 (마크다운 줄바꿈 보존):

```bash
gh pr create --title "feat(folder-program): 폴더명 인라인 편집 지원" --body "$(cat <<'EOF'
## 배경
...

## 변경 사항
...

## 테스트
- [x] ...
EOF
)"
```

생성 후 출력된 URL을 사용자에게 그대로 보여준다.
