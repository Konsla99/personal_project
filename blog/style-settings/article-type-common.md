# 일반 글 카드 스타일 설정 (Article Type Common Settings)

기본 글 카드 목록 아이템(`.article-type-common`)의 스타일을 설정하는 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 |
| :--- | :--- | :--- | :--- |
| 글 카드 기본 너비 | `100%` | 개별 글 목록 요소의 전체 너비 | `.article-type-common` |
| 마우스 오버 투명도 | `0.75` | 마우스 호버 시 카드 불투명도 (opacity) | `.article-type-common:hover` |
| 제목 텍스트 크기 | `24px` | 글 제목의 글자 크기 | `.article-type-common .title` |
| 제목 텍스트 색상 | `var(--text-main)` | 글 제목의 글자 색상 | `.article-type-common .title` |
| 제목 글자 두께 | `500` | 글 제목의 글자 굵기 | `.article-type-common .title` |
| 요약 텍스트 색상 | `var(--text-muted)` | 글 본문 요약본(summary)의 글자 색상 | `.article-type-common .summary` |
| 카테고리 텍스트 색상 | `var(--point-color)` | 글 목록에 표시되는 해당 글의 카테고리명 색상 | `.article-type-common .link-category` |
| 작성일 텍스트 색상 | `#999` | 글 작성 날짜 텍스트 색상 | `.article-type-common .date` |

---
**주의사항:** 
- 이 스타일은 모든 글 카드 형식의 공통 뼈대가 되는 속성들입니다.
- 수정 완료 후 에이전트에게 "공통 글 카드 스타일 변경 사항을 반영해줘" 라고 요청하세요.
