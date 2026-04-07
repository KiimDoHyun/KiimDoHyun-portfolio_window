# 폴더 구조 (Feature-First)

이 프로젝트의 `src/` 최상위 폴더 구조와 각 폴더의 책임을 정의한다.

## 최상위 구조

```
src/
├── app/        # 앱 설정, 라우터, 프로바이더
├── pages/      # 라우터에 등록할 페이지
├── features/   # 기능 단위 모듈 (각 기능별 독립 슬라이스)
├── shared/     # 도메인 무관 공유 코드 (ui, hooks, utils 등)
├── store/      # 전역 상태
└── types/      # 전역 타입
```

## 관련 규칙

- 컴포넌트 파일 구조 → [`../component-structure/`](../component-structure/)
- feature 공개 API → [`../feature-public-api/`](../feature-public-api/)
- 전역 상태 경계 → [`../global-state-boundary/`](../global-state-boundary/)
