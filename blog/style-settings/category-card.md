# 카테고리 카드 스타일 설정 (Category Card Style Settings)

홈 화면 카테고리 카드(`.category-card`) 개별 스타일을 설정하는 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 |
| :--- | :--- | :--- | :--- |
| 배경색 | `var(--bg-card)` | 카테고리 카드 전체 배경색 | `#wrap.layout-tech .category-card` |
| 카드 테두리 | `1px solid var(--border-color)` | 카테고리 카드 테두리 선 스타일 | `#wrap.layout-tech .category-card` |
| 둥글기 | `10px` | 카테고리 카드 모서리 둥글기 (border-radius) | `#wrap.layout-tech .category-card` |
| 기본 높이 | `auto` | 펼치기 전 카드의 세로 크기 (기본 최소 250px) | `#wrap.layout-tech .category-card` |
| 카드 썸네일 높이 | `137.5px` | 카드 상단 썸네일 이미지의 세로 크기 | `#wrap.layout-tech .category-thumb` |
| 텍스트 영역 높이 | `80.5px` | 카드 하단 카테고리명 텍스트 영역 세로 크기 | `#wrap.layout-tech .category-body` |
| 텍스트 영역 패딩 | `10px` | 텍스트 영역 안쪽 여백 | `#wrap.layout-tech .category-body` |
| 카테고리명 텍스트 크기 | `clamp(0.9rem, 2vw, 1.4rem)` | 카테고리 제목 폰트 크기 | `#wrap.layout-tech .category-body strong` |
| 카테고리명 텍스트 색상 | `var(--point-color)` | 카테고리 제목 색상 | `#wrap.layout-tech .category-body strong` |
| 카테고리명 폰트 두께 | `800` | 카테고리 제목 글자 두께 (font-weight) | `#wrap.layout-tech .category-body strong` |
| 카드 호버 효과 (그림자) | `0 10px 24px rgba(0, 0, 0, 0.4)` | 마우스 올렸을 때의 카드 그림자 크기 | `#wrap.layout-tech .category-card:hover` |
| 카드 호버 효과 (위치 이동) | `translateY(-4px)` | 마우스 올렸을 때 카드가 붕 뜨는 높이 | `#wrap.layout-tech .category-card:hover` |

---
**주의사항:** 
- `clamp()` 함수는 윈도우 크기에 따라 글자 크기를 부드럽게 조정하는 반응형 함수입니다.
- 수정 완료 후 에이전트에게 "카테고리 카드 스타일 변경 사항을 반영해줘" 라고 요청하세요.
