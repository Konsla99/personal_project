# 리사이즈 글 카드 스타일 설정 (Article Type Resize Settings)

이미지 및 타이틀 비율이 조절되는 형태의 리사이즈 글 카드(`.article-type-resize`) 관련 스타일 설정 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 | 실제 CSS 속성 |
| :--- | :--- | :--- | :--- | :--- |
| 하단 여백 (Margin) | `20px` | 글 카드 아래쪽 바깥 여백 | `.article-type-resize` | `margin-bottom` |
| 썸네일 여백 (Margin) | `20px` | 썸네일 이미지 영역 하단 바깥 여백 | `.article-type-resize .thumbnail` | `margin-bottom` |
| 썸네일 배경색 | `none` | 썸네일 이미지 박스 기본 배경색 | `.article-type-resize .thumbnail` | `background` |
| 썸네일 이미지 너비 | `100%` | 이미지 가로 크기 비율 | `.article-type-resize .thumbnail .img-thumbnail` | `width` |
| 썸네일 이미지 높이 | `auto` | 이미지 세로 크기 (기본 비율 자동 맞춤) | `.article-type-resize .thumbnail .img-thumbnail` | `height` |
| 제목 줄 수 제한 | `1` | 제목이 길 경우 말줄임표 처리할 최대 라인 수 | `.article-type-resize .title` | `-webkit-line-clamp` |
| 요약 텍스트 글자 크기 | `14px` | 본문 요약의 글자 크기 | `.article-type-resize .summary` | `font-size` |
| 요약 텍스트 줄 제한 | `3` | 요약 본문이 길 경우 말줄임표 처리할 최대 라인 수 | `.article-type-resize .summary` | `-webkit-line-clamp` |
| 요약 텍스트 색상 | `var(--text-muted)` | 요약 본문의 글자 색상 | `.article-type-resize .summary` | `color` |

---
**주의사항:** 
- 모바일(1060px 이하)에서의 여백 등은 미디어 쿼리로 각각 다르게 상속되고 있습니다.
- 수정 완료 후 에이전트에게 "리사이즈 글 카드 스타일 변경 사항을 반영해줘" 라고 요청하세요.
