# 카테고리 그리드 스타일 설정 (Category Grid Style Settings)

카테고리 카드들이 모인 전체 그리드 레이아웃(`.category-grid`)의 스타일 설정 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 |
| :--- | :--- | :--- | :--- |
| 레이아웃 형태 | `grid` | 그리드 정렬 방식 (기본 grid 고정) | `#wrap.layout-tech .category-grid` |
| 데스크탑 열 개수 | `repeat(6, 1fr)` | 데스크탑 화면에서 한 줄당 카드 개수 (6개) | `#wrap.layout-tech .category-grid` |
| 태블릿 열 개수 | `repeat(3, minmax(0, 1fr))` | 태블릿 화면(1060px 이하)에서의 카드 개수 | `@media ... .category-grid` |
| 모바일 (중형) 열 개수 | `repeat(2, minmax(0, 1fr))` | 모바일 화면(768px 이하)에서의 카드 개수 | `@media ... .category-grid` |
| 모바일 (소형) 열 개수 | `repeat(1, minmax(0, 1fr))` | 모바일 화면(480px 이하)에서의 카드 개수 | `@media ... .category-grid` |
| 카드 간격 | `15px` | 카드 사이의 가로/세로 여백 (gap) | `#wrap.layout-tech .category-grid` |
| 하단 마진 | `40px` | 카테고리 영역 전체의 아래쪽 바깥 여백 | `#wrap.layout-tech .category-grid` |

---
**주의사항:** 
- 한 줄에 들어갈 카드의 개수를 조절하고 싶을 때 `repeat(원하는숫자, 1fr)` 형태로 수정하세요.
- 수정 완료 후 에이전트에게 "카테고리 그리드 스타일 변경 사항을 반영해줘" 라고 요청하세요.
