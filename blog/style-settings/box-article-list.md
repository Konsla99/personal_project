# 글 목록 박스 스타일 설정 (Box Article List Style Settings)

글 목록 영역 전체 레이아웃(`.box-article-list`)의 스타일을 정의하는 설정 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 |
| :--- | :--- | :--- | :--- |
| 데스크탑 열 개수 | `repeat(5, 1fr)` | 데스크탑 화면에서 한 줄당 글 카드 개수 (5개) | `#wrap.layout-tech .article-list-wrapper .box-article-list` |
| 태블릿 열 개수 | `repeat(3, minmax(0, 1fr))` | 태블릿 화면(1060px 이하)에서의 한 줄당 글 카드 개수 | `@media ... .box-article-list` |
| 모바일 (중형) 열 개수 | `repeat(2, minmax(0, 1fr))` | 모바일 화면(768px 이하)에서의 한 줄당 글 카드 개수 | `@media ... .box-article-list` |
| 모바일 (소형) 열 개수 | `repeat(1, minmax(0, 1fr))` | 모바일 화면(480px 이하)에서의 한 줄당 글 카드 개수 | `@media ... .box-article-list` |
| 카드 간격 (gap) | `20px` | 글 카드 아이템 간의 간격 | `#wrap.layout-tech .article-list-wrapper .box-article-list` |
| 개별 글 너비 | `100%` | 그리드 셀 내에서 글 카드 아이템의 가로 크기 | `.article-list-wrapper .box-article-list article` |

---
**주의사항:** 
- 데스크탑에서 글 목록을 3열이나 4열로 조정하여 크게 보이게 하고 싶다면 데스크탑 열 개수를 `repeat(3, 1fr)` 등으로 수정해 보세요.
- 수정 완료 후 에이전트에게 "글 목록 레이아웃 변경 사항을 반영해줘" 라고 요청하세요.
